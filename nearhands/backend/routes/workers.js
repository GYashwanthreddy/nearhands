const router = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const WorkerProfile = require("../models/WorkerProfile");
const { protect, requireRole } = require("../middleware/auth");
const { TRADES, CITIES } = require("../config/constants");
const { translateBio } = require("../services/gemini");
const { uploadImage, isConfigured } = require("../services/cloudinary");
const { publicShape } = require("../services/shape");

const PAGE_SIZE = 12;

// Limits how many phone numbers one person can reveal, so bots cannot scrape them
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  message: { message: "Too many number lookups. Please try again later." },
});

// Photos are kept in memory, checked, then sent to Cloudinary (nothing is saved on disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) return cb(null, true);
    const err = new Error("Only JPG, PNG or WebP images are allowed");
    err.status = 400;
    cb(err);
  },
});

const SORTS = {
  rating: { ratingAvg: -1, ratingCount: -1, _id: 1 },
  rate_low: { ratePerHour: 1, _id: 1 },
  rate_high: { ratePerHour: -1, _id: 1 },
  experience: { experienceYears: -1, _id: 1 },
};

// ---------- Public: search approved workers ----------
router.get("/", async (req, res, next) => {
  try {
    const filter = { status: "approved" };
    if (CITIES.includes(req.query.city)) filter.city = req.query.city;
    if (TRADES.includes(req.query.trade)) filter.trade = req.query.trade;

    const sort = SORTS[req.query.sort] || SORTS.rating;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const [docs, total] = await Promise.all([
      WorkerProfile.find(filter)
        .sort(sort)
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .select("-phone") // the phone number is never part of search results
        .populate("user", "name")
        .lean(),
      WorkerProfile.countDocuments(filter),
    ]);

    res.json({
      workers: docs.map(publicShape),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    });
  } catch (err) {
    next(err);
  }
});

// ---------- Worker: own profile (these routes come before /:id) ----------
router.get("/me/profile", protect, requireRole("worker"), async (req, res, next) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id }).lean();
    res.json({ profile: profile ? { ...profile, name: req.user.name } : null });
  } catch (err) {
    next(err);
  }
});

router.put("/me/profile", protect, requireRole("worker"), async (req, res, next) => {
  try {
    const trade = req.body.trade;
    const city = req.body.city;
    if (!TRADES.includes(trade)) return res.status(400).json({ message: "Choose a valid work type" });
    if (!CITIES.includes(city)) return res.status(400).json({ message: "Choose a valid city" });

    const phone = String(req.body.phone || "").replace(/[^\d+]/g, "");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13)
      return res.status(400).json({ message: "Enter a valid phone number" });

    const ratePerHour = Number(req.body.ratePerHour);
    if (!Number.isFinite(ratePerHour) || ratePerHour < 50 || ratePerHour > 10000)
      return res.status(400).json({ message: "Rate per hour must be between 50 and 10000" });

    const experienceYears = Number(req.body.experienceYears);
    if (!Number.isInteger(experienceYears) || experienceYears < 0 || experienceYears > 60)
      return res.status(400).json({ message: "Experience must be between 0 and 60 years" });

    const bioLang = req.body.bioLang === "te" ? "te" : "en";
    const bioText = String(req.body.bioText || "").trim().slice(0, 600);
    if (bioText.length < 20)
      return res.status(400).json({ message: "Write at least 20 characters about yourself" });

    let profile = await WorkerProfile.findOne({ user: req.user._id });
    const isNew = !profile;

    // Only call Gemini when the bio actually changed (saves time and API quota)
    let bio;
    let translationOk = true;
    const unchanged =
      profile &&
      profile.bioLang === bioLang &&
      profile.bio?.[bioLang] === bioText &&
      profile.bio?.en &&
      profile.bio?.te;

    if (unchanged) {
      bio = { en: profile.bio.en, te: profile.bio.te };
    } else {
      const tr = await translateBio(bioText, bioLang);
      bio = { en: tr.en, te: tr.te };
      translationOk = tr.ok;
    }

    if (!profile) profile = new WorkerProfile({ user: req.user._id });
    Object.assign(profile, { trade, city, phone, ratePerHour, experienceYears, bioLang, bio });
    // A rejected profile goes back to the admin when the worker edits and saves it again
    if (profile.status === "rejected") profile.status = "pending";
    await profile.save();

    res.status(isNew ? 201 : 200).json({
      profile: { ...profile.toObject(), name: req.user.name },
      translationOk,
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/me/photo",
  protect,
  requireRole("worker"),
  upload.single("photo"),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ message: "Choose a photo to upload" });
      if (!isConfigured())
        return res.status(503).json({
          message: "Photo upload is not set up yet. Add the Cloudinary keys to backend/.env",
        });

      const profile = await WorkerProfile.findOne({ user: req.user._id });
      if (!profile) return res.status(400).json({ message: "Save your profile first, then add a photo" });

      profile.photoUrl = await uploadImage(req.file.buffer);
      await profile.save();
      res.json({ photoUrl: profile.photoUrl });
    } catch (err) {
      next(err);
    }
  }
);

// ---------- Public: one approved worker ----------
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid worker id" });

    const doc = await WorkerProfile.findOne({ _id: req.params.id, status: "approved" })
      .select("-phone")
      .populate("user", "name")
      .lean();
    if (!doc) return res.status(404).json({ message: "Worker not found" });

    res.json({ worker: publicShape(doc) });
  } catch (err) {
    next(err);
  }
});

// ---------- Logged-in users only: reveal the phone number ----------
router.get("/:id/contact", protect, contactLimiter, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid worker id" });

    const p = await WorkerProfile.findOne({ _id: req.params.id, status: "approved" }).select(
      "phone isSample"
    );
    if (!p) return res.status(404).json({ message: "Worker not found" });

    res.json({ phone: p.phone, isSample: p.isSample });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
