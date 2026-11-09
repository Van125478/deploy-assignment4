const User = require("../models/User");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const Article = require("../models/Article");

const sampleQuestions = [
  {
    text: "Who developed the theory of relativity?",
    options: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"],
    correctAnswerIndex: 0,
    keywords: ["science", "physics"],
  },
  {
    text: "What is the symbol for iron on the periodic table?",
    options: ["Fe", "I", "Au", "Ag"],
    correctAnswerIndex: 0,
    keywords: ["science", "chemistry"],
  },
  {
    text: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswerIndex: 0,
    keywords: ["capital", "geography"],
  },
  {
    text: "What is the capital of England?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswerIndex: 1,
    keywords: ["capital", "geography"],
  },
  {
    text: "What is the capital of Germany?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswerIndex: 2,
    keywords: ["capital", "geography"],
  },
];

const sampleArticles = [
  {
    title: "How to take a quiz",
    content:
      "Open Quiz from the menu, choose one answer, then click Submit Answer. Your score appears when the quiz is finished.",
  },
  {
    title: "Quiz tips",
    content:
      "Read every option before you submit. After the quiz ends you can restart and try again.",
  },
];

async function upsertUser(username, password, admin) {
  let user = await User.findOne({ username });

  if (!user) {
    user = await User.register(new User({ username, admin }), password);
    console.log("Created user:", username, "admin =", admin);
    return user;
  }

  if (user.admin !== admin) {
    user.admin = admin;
    await user.save();
  }

  console.log("User already exists:", username);
  return user;
}

async function seedDatabase() {
  const john = await upsertUser("John", "john123", false);
  const mary = await upsertUser("Mary", "mary123", true);
  const questionIds = [];

  for (const item of sampleQuestions) {
    let question = await Question.findOne({ text: item.text });

    if (!question) {
      question = await Question.create({
        ...item,
        author: mary._id,
      });
      console.log("Created question:", item.text);
    }

    questionIds.push(question._id);
  }

  let quiz = await Quiz.findOne({ title: "General Knowledge" });

  if (!quiz) {
    quiz = await Quiz.create({
      title: "General Knowledge",
      description: "Practice questions for the quiz application",
      questions: questionIds,
    });
    console.log("Created quiz:", quiz.title);
  } else {
    const existing = new Set(quiz.questions.map((id) => String(id)));
    let changed = false;

    questionIds.forEach((id) => {
      if (!existing.has(String(id))) {
        quiz.questions.push(id);
        changed = true;
      }
    });

    if (changed) {
      await quiz.save();
      console.log("Updated quiz with sample questions");
    }
  }

  for (const item of sampleArticles) {
    const exists = await Article.findOne({ title: item.title });
    if (!exists) {
      await Article.create({
        ...item,
        author: mary._id,
      });
      console.log("Created article:", item.title);
    }
  }

  console.log("Seed finished.");
  console.log("User  :", john.username, "/ john123");
  console.log("Admin :", mary.username, "/ mary123");
}

module.exports = seedDatabase;
