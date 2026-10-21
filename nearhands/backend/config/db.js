const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

module.exports = async function connectDB() {
  // Fixes "querySrv ECONNREFUSED" on some networks (set USE_GOOGLE_DNS=true in .env)
  if (process.env.USE_GOOGLE_DNS === "true") {
    require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
  }
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing. Add it to backend/.env");
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing. Add it to backend/.env");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
