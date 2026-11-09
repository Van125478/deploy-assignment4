const express = require("express");
const authenticate = require("../authenticate");

const router = express.Router();

const {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestionToQuiz,
  addMultipleQuestionsToQuiz,
  populateCapitalQuestions,
} = require("../controllers/quizController");

router.get("/", getAllQuizzes);
router.get("/:quizId/populate", populateCapitalQuestions);
router.get("/:quizId", getQuizById);

router.post(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  createQuiz
);

router.put(
  "/:quizId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  updateQuiz
);

router.delete(
  "/:quizId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  deleteQuiz
);

router.post(
  "/:quizId/question",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  addQuestionToQuiz
);

router.post(
  "/:quizId/questions",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  addMultipleQuestionsToQuiz
);

module.exports = router;
