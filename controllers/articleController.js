const Article = require("../models/Article");

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "username admin")
      .sort({ createdAt: -1 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createArticle = async (req, res) => {
  try {
    const article = await Article.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.articleId,
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.articleId);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json({
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
};
