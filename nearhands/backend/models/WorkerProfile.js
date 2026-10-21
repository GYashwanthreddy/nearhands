const mongoose = require("mongoose");
const { TRADES, CITIES } = require("../config/constants");

const workerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    trade: { type: String, enum: TRADES, required: true },
    city: { type: String, enum: CITIES, required: true },
    phone: { type: String, required: true }, // never sent in search results
    ratePerHour: { type: Number, required: true, min: 50, max: 10000 },
    experienceYears: { type: Number, default: 0, min: 0, max: 60 },

    // The bio is stored in both languages. Gemini translates it when the worker saves.
    bioLang: { type: String, enum: ["en", "te"], default: "en" }, // language the worker wrote in
    bio: {
      en: { type: String, default: "" },
      te: { type: String, default: "" },
    },

    photoUrl: { type: String, default: "" },

    // Admin approval: only "approved" profiles appear in search
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

    // Kept up to date by Review.recalc() so search can sort without joining reviews
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    isSample: { type: Boolean, default: false }, // true for the seeded demo workers
  },
  { timestamps: true }
);

workerProfileSchema.index({ status: 1, city: 1, trade: 1 });

module.exports = mongoose.model("WorkerProfile", workerProfileSchema);
