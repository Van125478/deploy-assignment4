const express = require("express");
const passport = require("passport");

const User = require("../models/User");
const authenticate = require("../authenticate");

const router = express.Router();

router.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  async (req, res, next) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/signup", async (req, res) => {
  try {
    const { username, password, admin } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Cho phép đăng ký với quyền admin khi gửi admin: true
    const isAdmin =
      admin === true ||
      admin === "true" ||
      admin === 1 ||
      admin === "1";

    const user = await User.register(
      new User({
        username,
        admin: isAdmin,
      }),
      password
    );

    const token = authenticate.getToken({ _id: user._id });

    res.status(200).json({
      success: true,
      status: "Registration Successful!",
      user: {
        _id: user._id,
        username: user.username,
        admin: user.admin,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Registration failed",
      err,
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Login failed",
      });
    }

    const token = authenticate.getToken({ _id: user._id });
    return res.status(200).json({
      success: true,
      token,
      status: "You are successfully logged in!",
      user: {
        _id: user._id,
        username: user.username,
        admin: user.admin,
      },
    });
  })(req, res, next);
});

router.get("/me", authenticate.verifyUser, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    username: req.user.username,
    admin: req.user.admin,
  });
});

router.get("/logout", (req, res, next) => {
  if (req.user) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } else {
    const err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
