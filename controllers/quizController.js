const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// GET /quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("questions");

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /quizzes/:quizId
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("questions");

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// POST /quizzes
const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);

    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// PUT /quizzes/:quizId
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE /quizzes/:quizId
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// POST /quizzes/:quizId/question
const addQuestionToQuiz = async (req, res) => {
  try {
    // 1. Tìm Quiz
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    // 2. Tạo Question mới (author = user đang đăng nhập)
    const question = await Question.create({
      ...req.body,
      author: req.user._id,
    });

    // 3. Thêm Question ID vào Quiz
    quiz.questions.push(question._id);

    // 4. Lưu Quiz
    await quiz.save();

    // 5. Populate questions
    const updatedQuiz = await Quiz.findById(quiz._id).populate("questions");

    // 6. Trả kết quả
    res.status(201).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// POST /quizzes/:quizId/questions
const addMultipleQuestionsToQuiz = async (req, res) => {
  try {
    // 1. Tìm Quiz
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    // 2. Kiểm tra body phải là array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Request body must be an array",
      });
    }

    // 3. Tạo nhiều Question (author = user đang đăng nhập)
    const questions = await Question.insertMany(
      req.body.map((item) => ({
        ...item,
        author: req.user._id,
      }))
    );

    // 4. Lấy ID của tất cả Question
    const questionIds = questions.map((question) => question._id);

    // 5. Thêm tất cả Question ID vào Quiz
    quiz.questions.push(...questionIds);

    // 6. Lưu Quiz
    await quiz.save();

    // 7. Populate lại Quiz
    const updatedQuiz = await Quiz.findById(quiz._id)
      .populate("questions");

    // 8. Trả kết quả
    res.status(201).json(updatedQuiz);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// GET /quizzes/:quizId/populate
const populateCapitalQuestions = async (req, res) => {
  try {
    // 1. Tìm Quiz theo ID
    const populatedQuiz = await Quiz.findById(req.params.quizId)
      .populate({
        path: "questions",
        match: {
          $or: [
            { keywords: { $regex: "capital", $options: "i" } },
            { text: { $regex: "capital", $options: "i" } },
          ],
        },
      });

    // 2. Kiểm tra Quiz có tồn tại không
    if (!populatedQuiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    // 3. Kiểm tra có câu hỏi nào khớp từ khóa không
    if (populatedQuiz.questions.length === 0) {
      return res.status(404).json({
        message: "No questions found matching keyword: capital",
      });
    }

    // 4. Nếu tìm thấy câu hỏi thì trả về kết quả
    return res.status(200).json(populatedQuiz);

  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestionToQuiz,
  addMultipleQuestionsToQuiz,
  populateCapitalQuestions,
};