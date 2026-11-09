const express = require("express");
const fs = require("fs");
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

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", usersRouter);
app.use("/quizzes", quizRoutes);
app.use("/questions", questionRoutes);
app.use("/articles", articleRoutes);

const clientBuild = [
  path.join(__dirname, "client", "dist"),
  path.join(__dirname, "..", "client", "dist"),
  path.join(process.cwd(), "client", "dist"),
].find((folder) => fs.existsSync(path.join(folder, "index.html")));
const clientIndex = clientBuild ? path.join(clientBuild, "index.html") : "";


if (clientIndex && fs.existsSync(clientIndex)) {
  app.use(express.static(clientBuild));
  app.get(/^(?!\/(?:users|quizzes|questions|articles|health)(?:\/|$)).*/, (req, res) => {
    res.sendFile(clientIndex);
  });
}

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
