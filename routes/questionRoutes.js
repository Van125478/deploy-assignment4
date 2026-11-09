const express = require("express");
const authenticate = require("../authenticate");

const router = express.Router();

const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

router.get("/", getAllQuestions);
router.get("/:questionId", getQuestionById);

router.post("/", authenticate.verifyUser, createQuestion);

function verifyAdminOrAuthor(req, res, next) {
  if (req.user && req.user.admin) {
    return next();
  }

  return authenticate.verifyAuthor(req, res, next);
}

router.put(
  "/:questionId",
  authenticate.verifyUser,
  verifyAdminOrAuthor,
  updateQuestion
);

router.delete(
  "/:questionId",
  authenticate.verifyUser,
  verifyAdminOrAuthor,
  deleteQuestion
);

module.exports = router;
