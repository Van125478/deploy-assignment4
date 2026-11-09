const express = require("express");
const authenticate = require("../authenticate");

const {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");

const router = express.Router();

router.get("/", getAllArticles);

router.post(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  createArticle
);

router.put(
  "/:articleId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  updateArticle
);

router.delete(
  "/:articleId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  deleteArticle
);

module.exports = router;
