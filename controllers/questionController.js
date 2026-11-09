const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

const attachToDefaultQuiz = async (questionId) => {
  let quiz = await Quiz.findOne({ title: "General Knowledge" });

  if (!quiz) {
    await Quiz.create({
      title: "General Knowledge",
      description: "Practice questions for the quiz application",
      questions: [questionId],
    });
    return;
  }

  const alreadyAdded = quiz.questions.some((id) => id.equals(questionId));
  if (!alreadyAdded) {
    quiz.questions.push(questionId);
    await quiz.save();
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("author", "username admin");
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId).populate(
      "author",
      "username admin"
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const createQuestion = async (req, res) => {
  try {
    const question = await Question.create({
      ...req.body,
      author: req.user._id,
    });

    await attachToDefaultQuiz(question._id);

    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload.author;

    const question = await Question.findByIdAndUpdate(
      req.params.questionId,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.questionId);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    await Quiz.updateMany(
      { questions: question._id },
      { $pull: { questions: question._id } }
    );

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
