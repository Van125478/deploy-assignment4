const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const usersRouter = require("./routes/users");
const articleRoutes = require("./routes/articleRoutes");

dotenv.config();
require("./authenticate");

const app = express();

connectDB();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({
    message: "Assignment 3 User Authentication API is running",
    endpoints: {
      signup: "POST /users/signup",
      login: "POST /users/login",
      users: "GET /users (admin)",
      quizzes: "/quizzes",
      questions: "/questions",
      articles: "/articles",
    },
  });
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/users", usersRouter);
app.use("/quizzes", quizRoutes);
app.use("/questions", questionRoutes);
app.use("/articles", articleRoutes);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || "Internal Server Error",
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;
