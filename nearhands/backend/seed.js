// Creates sample data for demos. Run it with:  npm run seed
// It is safe to run again: it first removes its own old sample data (emails ending in @nearhands.demo).
// Run  npm run seed:clear  to remove the sample data without creating it again.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const WorkerProfile = require("./models/WorkerProfile");
const Review = require("./models/Review");

const DEMO_PASSWORD = "Demo@1234";
const ADMIN_PASSWORD = "Admin@1234";

// The phone numbers are made-up demo numbers, and sample workers have no call/WhatsApp buttons.
const WORKERS = [
  {
    name: "Aarav", trade: "plumber", city: "Hyderabad", rate: 350, exp: 8, lang: "en", phone: "9000000001",
    en: "I am a plumber with 8 years of experience. I fix tap leaks, pipe repairs and bathroom fittings. I reach on time and keep the work clean.",
    te: "నేను 8 సంవత్సరాల అనుభవం ఉన్న ప్లంబర్‌ని. నల్లా లీకేజీలు, పైపు మరమ్మతులు, బాత్రూమ్ ఫిట్టింగ్‌లు చేస్తాను. సమయానికి వచ్చి పనిని శుభ్రంగా చేస్తాను.",
  },
  {
    name: "Vihaan", trade: "electrician", city: "Bangalore", rate: 400, exp: 6, lang: "te", phone: "9000000002",
    en: "Experienced electrician for home wiring, fans, lights and switchboard problems. Safety comes first in every job I do.",
    te: "ఇంటి వైరింగ్, ఫ్యాన్లు, లైట్లు, స్విచ్‌బోర్డు సమస్యలు సరిచేసే అనుభవం ఉన్న ఎలక్ట్రీషియన్‌ని. ప్రతి పనిలో భద్రతకే మొదటి ప్రాధాన్యత ఇస్తాను.",
  },
  {
    name: "Rohan", trade: "carpenter", city: "Mumbai", rate: 450, exp: 10, lang: "en", phone: "9000000003",
    en: "Carpenter with 10 years of experience. I repair doors, windows and wardrobes and also build custom furniture.",
    te: "10 సంవత్సరాల అనుభవం ఉన్న కార్పెంటర్‌ని. తలుపులు, కిటికీలు, అల్మారాలు మరమ్మతు చేస్తాను, కొత్త ఫర్నిచర్ కూడా తయారు చేస్తాను.",
  },
  {
    name: "Aditya", trade: "painter", city: "Hyderabad", rate: 300, exp: 5, lang: "te", phone: "9000000004",
    en: "House painter for interior and exterior walls. I finish the work neatly and protect your furniture while painting.",
    te: "ఇంటి లోపల, బయట గోడలకు రంగులు వేసే పెయింటర్‌ని. పని శుభ్రంగా పూర్తి చేస్తాను, పెయింటింగ్ సమయంలో మీ సామాను కాపాడతాను.",
  },
  {
    name: "Kabir", trade: "ac-technician", city: "Bangalore", rate: 500, exp: 7, lang: "en", phone: "9000000005",
    en: "AC technician for installation, servicing and gas refilling of all major brands. Quick response and fair pricing.",
    te: "అన్ని ప్రముఖ బ్రాండ్ల ఏసీల ఇన్‌స్టాలేషన్, సర్వీసింగ్, గ్యాస్ రీఫిల్లింగ్ చేసే టెక్నీషియన్‌ని. త్వరగా స్పందిస్తాను, న్యాయమైన ధరలు.",
  },
  {
    name: "Arjun", trade: "driver", city: "Mumbai", rate: 250, exp: 9, lang: "te", phone: "9000000006",
    en: "Experienced driver for city trips and outstation travel. I know the routes well and drive safely.",
    te: "నగరంలో మరియు ఊర్లకు ప్రయాణాలకు అనుభవం ఉన్న డ్రైవర్‌ని. దారులు బాగా తెలుసు, సురక్షితంగా నడుపుతాను.",
  },
  {
    name: "Reyansh", trade: "tutor", city: "Hyderabad", rate: 400, exp: 4, lang: "en", phone: "9000000007",
    en: "Maths and science tutor for classes 6 to 10. I explain concepts in simple language and give regular practice tests.",
    te: "6 నుండి 10వ తరగతి వరకు గణితం, సైన్స్ ట్యూటర్‌ని. సులభమైన భాషలో వివరిస్తాను, క్రమం తప్పకుండా ప్రాక్టీస్ టెస్టులు ఇస్తాను.",
  },
  {
    name: "Devansh", trade: "mechanic", city: "Bangalore", rate: 300, exp: 11, lang: "te", phone: "9000000008",
    en: "Bike and scooter mechanic. I handle servicing, brake work and engine problems at your doorstep.",
    te: "బైక్, స్కూటర్ మెకానిక్‌ని. సర్వీసింగ్, బ్రేక్ పనులు, ఇంజిన్ సమస్యలు మీ ఇంటి దగ్గరే సరిచేస్తాను.",
  },
  {
    name: "Pranav", trade: "cook", city: "Mumbai", rate: 280, exp: 12, lang: "en", phone: "9000000009",
    en: "Home cook for South and North Indian meals. I cook fresh, tasty food and keep the kitchen clean.",
    te: "దక్షిణ, ఉత్తర భారత వంటకాలు వండే ఇంటి వంటవాడిని. తాజాగా రుచిగా వండుతాను, వంటగదిని శుభ్రంగా ఉంచుతాను.",
  },
  {
    name: "Ishaan", trade: "cleaner", city: "Hyderabad", rate: 200, exp: 3, lang: "te", phone: "9000000010",
    en: "Home and office cleaning including deep cleaning of kitchens and bathrooms. Reliable and careful with your belongings.",
    te: "ఇల్లు, ఆఫీసు క్లీనింగ్ చేస్తాను, వంటగది, బాత్రూమ్ డీప్ క్లీనింగ్ కూడా చేస్తాను. నమ్మకంగా, మీ వస్తువులను జాగ్రత్తగా చూసుకుంటాను.",
  },
];

const CUSTOMERS = ["Priya", "Sneha", "Rahul"];

// Three ratings per worker (one from each sample customer)
const RATINGS = [
  [5, 5, 4], [4, 4, 5], [5, 4, 4], [3, 4, 4], [5, 5, 5],
  [4, 5, 4], [5, 4, 5], [4, 3, 4], [5, 5, 4], [4, 4, 4],
];
const COMMENTS = {
  5: "Very professional and on time. Highly recommended.",
  4: "Good work at a fair price.",
  3: "Work was okay, but it took longer than expected.",
};

async function run() {
  await connectDB();

  // Remove old sample data
  const oldUsers = await User.find({ email: /@nearhands\.demo$/ }).select("_id");
  const oldIds = oldUsers.map((u) => u._id);
  const oldProfiles = await WorkerProfile.find({ user: { $in: oldIds } }).select("_id");
  const oldProfileIds = oldProfiles.map((p) => p._id);
  await Review.deleteMany({ $or: [{ worker: { $in: oldProfileIds } }, { customer: { $in: oldIds } }] });
  await WorkerProfile.deleteMany({ _id: { $in: oldProfileIds } });
  await User.deleteMany({ _id: { $in: oldIds } });

  // "npm run seed:clear" stops here: it only removes the sample data
  if (process.argv.includes("--clear")) {
    console.log(`Sample data removed (${oldIds.length} sample accounts).`);
    await mongoose.disconnect();
    return;
  }

  // Admin + sample customers (User.create runs the password hashing)
  await User.create({
    name: "NearHands Admin", email: "admin@nearhands.demo", password: ADMIN_PASSWORD, role: "admin",
  });
  const customers = [];
  for (const name of CUSTOMERS) {
    customers.push(
      await User.create({
        name, email: `${name.toLowerCase()}@nearhands.demo`, password: DEMO_PASSWORD, role: "customer",
      })
    );
  }

  // Sample workers (already approved so they show up in search)
  for (let i = 0; i < WORKERS.length; i++) {
    const w = WORKERS[i];
    const user = await User.create({
      name: w.name, email: `${w.name.toLowerCase()}@nearhands.demo`, password: DEMO_PASSWORD, role: "worker",
    });
    const profile = await WorkerProfile.create({
      user: user._id,
      trade: w.trade,
      city: w.city,
      phone: w.phone,
      ratePerHour: w.rate,
      experienceYears: w.exp,
      bioLang: w.lang,
      bio: { en: w.en, te: w.te },
      status: "approved",
      isSample: true,
    });

    for (let c = 0; c < customers.length; c++) {
      const rating = RATINGS[i][c];
      await Review.create({ worker: profile._id, customer: customers[c]._id, rating, comment: COMMENTS[rating] });
    }
    await Review.recalc(profile._id);
  }

  console.log("\nSample data created:");
  console.log(`  ${WORKERS.length} workers (Hyderabad, Bangalore, Mumbai), ${CUSTOMERS.length} customers, 1 admin\n`);
  console.log("Demo logins:");
  console.log(`  Admin     admin@nearhands.demo   / ${ADMIN_PASSWORD}`);
  console.log(`  Customer  priya@nearhands.demo   / ${DEMO_PASSWORD}`);
  console.log(`  Worker    aarav@nearhands.demo   / ${DEMO_PASSWORD}  (same password for all sample workers)\n`);

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("Seeding failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
