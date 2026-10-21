const router = require("express").Router();
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { message: "Too many attempts. Please try again later." },
});

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });
const emailRe = /^\S+@\S+\.\S+$/;

router.post("/register", limiter, async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    // Anyone can sign up as a customer or a worker. Admin accounts cannot be created here.
    const role = req.body.role === "worker" ? "worker" : "customer";

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required" });
    if (!emailRe.test(email)) return res.status(400).json({ message: "Enter a valid email" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: sign(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post("/login", limiter, async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({ token: sign(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.get("/me", protect, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
