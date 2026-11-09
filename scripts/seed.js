require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

connectDB()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
