import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuizzes,
  restartQuiz,
  selectOption,
  startQuiz,
  submitAnswer,
} from "../slices/quizSlice";

function QuizPage() {
  const dispatch = useDispatch();
  const { quizzes, activeQuizId, currentIndex, selectedOption, score, finished, status, error } =
    useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  useEffect(() => {
    if (!activeQuizId && quizzes.length === 1) {
      dispatch(startQuiz(quizzes[0]._id));
    }
  }, [activeQuizId, quizzes, dispatch]);

  const quiz = quizzes.find((item) => item._id === activeQuizId);
  const question = quiz?.questions?.[currentIndex];

  if (status === "loading" && quizzes.length === 0) {
    return <p className="text-center mt-5">Loading quiz...</p>;
  }

  if (!quiz) {
    return (
      <div className="quiz-wrap">
        <h2>Quiz</h2>
        {quizzes.length === 0 ? (
          <p>No quiz available yet.</p>
        ) : (
          <div className="list-group text-start">
            {quizzes.map((item) => (
              <button
                key={item._id}
                type="button"
                className="list-group-item list-group-item-action"
                onClick={() => dispatch(startQuiz(item._id))}
              >
                <strong>{item.title}</strong>
                <div className="small text-secondary">{item.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!quiz.questions?.length) {
    return (
      <div className="quiz-wrap">
        <h2>Quiz</h2>
        <p>This quiz has no questions yet.</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quiz-wrap">
        <h2 className="fw-bold">Quiz Completed</h2>
        <p>Your score: {score}</p>
        <button type="button" className="btn btn-primary" onClick={() => dispatch(restartQuiz())}>
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-wrap">
      <h2 className="fw-bold">Quiz</h2>
      <h3 className="mb-4">{question.text}</h3>

      <div className="quiz-options mb-4">
        {question.options.map((option, index) => (
            <div className="form-check" key={`${question._id}-${index}`}>
            <input
              className="form-check-input"
              type="radio"
              name="answer"
              id={`option-${index}`}
              checked={selectedOption === index}
              onChange={() => dispatch(selectOption(index))}
            />
            <label className="form-check-label" htmlFor={`option-${index}`}>
              {option}
            </label>
          </div>
        ))}
      </div>

      {error && <p className="text-danger">{error}</p>}

      <button type="button" className="btn btn-primary" onClick={() => dispatch(submitAnswer())}>
        Submit Answer
      </button>
    </div>
  );
}

export default QuizPage;
