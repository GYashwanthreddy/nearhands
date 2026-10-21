const router = require("express").Router();
const mongoose = require("mongoose");
const WorkerProfile = require("../models/WorkerProfile");
const User = require("../models/User");
const Review = require("../models/Review");
const { protect, requireRole } = require("../middleware/auth");
const { publicShape } = require("../services/shape");

// Everything in this file is admin only
router.use(protect, requireRole("admin"));

const STATUSES = ["pending", "approved", "rejected"];

// Counts for the tabs
router.get("/stats", async (req, res, next) => {
  try {
    const [pending, approved, rejected, customers, reviews] = await Promise.all([
      WorkerProfile.countDocuments({ status: "pending" }),
      WorkerProfile.countDocuments({ status: "approved" }),
      WorkerProfile.countDocuments({ status: "rejected" }),
      User.countDocuments({ role: "customer" }),
      Review.countDocuments(),
    ]);
    res.json({ pending, approved, rejected, customers, reviews });
  } catch (err) {
    next(err);
  }
});

// Worker profiles by status. Admin also sees the phone number and email to verify the worker.
router.get("/workers", async (req, res, next) => {
  try {
    const status = STATUSES.includes(req.query.status) ? req.query.status : "pending";
    const docs = await WorkerProfile.find({ status })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .lean();

    res.json({
      workers: docs.map((p) => ({
        ...publicShape(p),
        phone: p.phone,
        email: p.user?.email,
        status: p.status,
        createdAt: p.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// Approve or reject
router.patch("/workers/:id/status", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid worker id" });
    const status = req.body.status;
    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ message: "Status must be approved or rejected" });

    const profile = await WorkerProfile.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!profile) return res.status(404).json({ message: "Worker not found" });

    res.json({ message: `Worker ${status}`, status: profile.status });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
