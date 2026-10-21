const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "WorkerProfile", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "", maxlength: 500 },
  },
  { timestamps: true }
);

// One review per customer per worker (the database enforces it)
reviewSchema.index({ worker: 1, customer: 1 }, { unique: true });

// Recalculates a worker's average rating with an aggregation pipeline
reviewSchema.statics.recalc = async function (workerId) {
  // aggregate() does not cast ids, so convert the string to an ObjectId first
  const id = new mongoose.Types.ObjectId(String(workerId));
  const [r] = await this.aggregate([
    { $match: { worker: id } },
    { $group: { _id: "$worker", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await mongoose.model("WorkerProfile").findByIdAndUpdate(id, {
    ratingAvg: r ? Math.round(r.avg * 10) / 10 : 0,
    ratingCount: r ? r.count : 0,
  });
};

module.exports = mongoose.model("Review", reviewSchema);
