const mongoose = require("mongoose");
const config = require("./config");
const seedDatabase = require("../scripts/seedData");

let connecting;

const connectDB = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (!connecting) {
    connecting = mongoose
      .connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 })
      .then(async () => {
        console.log("MongoDB connected successfully");
        await seedDatabase();
      })
      .catch((error) => {
        connecting = null;
        console.error("MongoDB connection failed:", error.message);
        throw error;
      });
  }

  return connecting;
};

module.exports = connectDB;