require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

async function createAdmin() {
  await connectDB();

  const username = process.argv[2] || "admin";
  const password = process.argv[3] || "admin123";

  const existing = await User.findOne({ username });
  if (existing) {
    existing.admin = true;
    await existing.setPassword(password);
    await existing.save();
    console.log("Updated existing user to admin:", username);
  } else {
    const user = await User.register(new User({ username, admin: true }), password);
    console.log("Created admin user:", user.username);
  }

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
