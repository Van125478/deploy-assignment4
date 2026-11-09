import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearQuestionError,
  createQuestion,
  deleteQuestion,
  fetchQuestions,
  updateQuestion,
} from "../slices/questionSlice";

const emptyForm = {
  text: "",
  options: ["", "", "", ""],
  correctAnswerIndex: 0,
};

function ManageQuestions() {
  const dispatch = useDispatch();
  const { items, error } = useSelector((state) => state.questions);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const setOption = (index, value) => {
    setForm((current) => {
      const options = [...current.options];
      options[index] = value;
      return { ...current, options };
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    dispatch(clearQuestionError());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      text: form.text.trim(),
      options: form.options.map((option) => option.trim()).filter(Boolean),
      correctAnswerIndex: Number(form.correctAnswerIndex),
      keywords: [],
    };

    const action = editingId
      ? await dispatch(updateQuestion({ id: editingId, payload }))
      : await dispatch(createQuestion(payload));

    if (action.meta.requestStatus === "fulfilled") {
      resetForm();
    }
  };

  const handleEdit = (question) => {
    const options = [...question.options];
    while (options.length < 4) {
      options.push("");
    }

    setEditingId(question._id);
    setForm({
      text: question.text,
      options: options.slice(0, 4),
      correctAnswerIndex: question.correctAnswerIndex,
    });
    dispatch(clearQuestionError());
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this question?")) {
      dispatch(deleteQuestion(id));
      if (editingId === id) {
        resetForm();
      }
    }
  };

  return (
    <section>
      <h2 className="h4">Questions</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form className="border rounded p-3 mb-3" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label" htmlFor="questionText">
            Question Text:
          </label>
          <input
            id="questionText"
            className="form-control"
            value={form.text}
            onChange={(event) => setForm({ ...form, text: event.target.value })}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Options:</label>
          {form.options.map((option, index) => (
            <input
              key={index}
              className="form-control mb-2"
              value={option}
              onChange={(event) => setOption(index, event.target.value)}
              required
            />
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="correctIndex">
            Correct Answer Index:
          </label>
          <input
            id="correctIndex"
            type="number"
            min="0"
            max={Math.max(form.options.length - 1, 0)}
            className="form-control"
            value={form.correctAnswerIndex}
            onChange={(event) =>
              setForm({ ...form, correctAnswerIndex: event.target.value })
            }
            required
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          {editingId ? "Update Question" : "Add Question"}
        </button>
        {editingId && (
          <button type="button" className="btn btn-link w-100" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {items.map((question) => (
        <article className="border rounded p-3 mb-3" key={question._id}>
          <h3 className="h5">{question.text}</h3>
          <ul>
            {question.options.map((option, index) => (
              <li key={`${question._id}-${index}`}>{option}</li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-warning btn-sm me-2"
            onClick={() => handleEdit(question)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(question._id)}
          >
            Delete
          </button>
        </article>
      ))}
    </section>
  );
}

export default ManageQuestions;
