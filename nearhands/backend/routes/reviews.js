const router = require("express").Router();
const mongoose = require("mongoose");
const Review = require("../models/Review");
const WorkerProfile = require("../models/WorkerProfile");
const { protect, requireRole } = require("../middleware/auth");

// This router is mounted at /api, and every route here sets its own auth rules.

// Public: reviews for a worker
router.get("/workers/:id/reviews", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid worker id" });

    const reviews = await Review.find({ worker: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("customer", "name")
      .lean();

    res.json({
      reviews: reviews.map((r) => ({
        _id: r._id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        customerName: r.customer?.name || "Customer",
      })),
    });
  } catch (err) {
    next(err);
  }
});

// Customers only: one review per worker
router.post("/workers/:id/reviews", protect, requireRole("customer"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid worker id" });

    const worker = await WorkerProfile.findOne({ _id: req.params.id, status: "approved" });
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Choose a rating from 1 to 5" });
    const comment = String(req.body.comment || "").trim().slice(0, 500);

    try {
      await Review.create({ worker: worker._id, customer: req.user._id, rating, comment });
    } catch (err) {
      if (err.code === 11000)
        return res.status(409).json({ message: "You have already reviewed this worker" });
      throw err;
    }

    await Review.recalc(worker._id);
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    next(err);
  }
});

// Admin only: remove an abusive review
router.delete("/reviews/:id", protect, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid review id" });

    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    await Review.recalc(review.worker);
    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
