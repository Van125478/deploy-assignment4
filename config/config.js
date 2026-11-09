require("dotenv").config();

module.exports = {
  mongoUri:
    process.env.MONGO_URI ||
    process.env.MONGO_URL ||
    process.env.DATABASE_URL ||
    "mongodb://localhost:27017/SimpleQuiz",
  secretKey: process.env.SECRET_KEY || "ass3-question-bank-secret-key",
};
