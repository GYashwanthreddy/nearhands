// All text that can switch between English and Telugu lives here.

export const TRADES = [
  "plumber", "electrician", "carpenter", "painter", "tutor",
  "ac-technician", "cook", "driver", "mechanic", "cleaner",
];

export const CITIES = [
  "Hyderabad", "Bangalore", "Mumbai", "Chennai", "Delhi",
  "Pune", "Kolkata", "Vijayawada", "Visakhapatnam",
];

export const TRADE_LABELS = {
  en: {
    plumber: "Plumber", electrician: "Electrician", carpenter: "Carpenter", painter: "Painter",
    tutor: "Tutor", "ac-technician": "AC Technician", cook: "Cook", driver: "Driver",
    mechanic: "Mechanic", cleaner: "Cleaner",
  },
  te: {
    plumber: "ప్లంబర్", electrician: "ఎలక్ట్రీషియన్", carpenter: "కార్పెంటర్", painter: "పెయింటర్",
    tutor: "ట్యూటర్", "ac-technician": "ఏసీ టెక్నీషియన్", cook: "వంటవారు", driver: "డ్రైవర్",
    mechanic: "మెకానిక్", cleaner: "క్లీనర్",
  },
};

export const CITY_LABELS = {
  en: Object.fromEntries(CITIES.map((c) => [c, c])),
  te: {
    Hyderabad: "హైదరాబాద్", Bangalore: "బెంగళూరు", Mumbai: "ముంబై", Chennai: "చెన్నై",
    Delhi: "ఢిల్లీ", Pune: "పూణే", Kolkata: "కోల్‌కతా", Vijayawada: "విజయవాడ",
    Visakhapatnam: "విశాఖపట్నం",
  },
};

export const UI = {
  en: {
    navFind: "Find workers", navProfile: "My profile", navAdmin: "Admin",
    login: "Log in", register: "Sign up", logout: "Logout",

    heroTitle: "Find trusted workers in your city",
    heroSub: "Plumbers, electricians, tutors and more. See their rate and rating, then call or WhatsApp them directly.",
    city: "City", allCities: "All cities", workType: "Work type", all: "All", sortBy: "Sort by",
    sortRating: "Top rated", sortLow: "Rate: low to high", sortHigh: "Rate: high to low",
    sortExp: "Most experienced",
    found: "workers found", noResults: "No workers found for these filters.",
    prev: "Previous", next: "Next", page: "Page",

    perHour: "/hr", yrs: "yrs experience", noRatings: "No ratings yet", reviewsWord: "reviews",
    showNumber: "Show number", loginToView: "Log in to view number",
    call: "Call", whatsapp: "WhatsApp", viewProfile: "View profile",
    sample: "Sample", sampleNote: "Sample profile with a demo number.",
    expectedRate: "Expected rate",

    about: "About", reviews: "Reviews", noReviews: "No reviews yet.", writeReview: "Write a review",
    yourRating: "Your rating", comment: "Comment (optional)", submit: "Submit",
    onlyCustomers: "Only customers can review workers.",
    loginToReview: "Log in as a customer to leave a review.",
    thanks: "Thanks, your review was added.", del: "Delete", back: "Back to search",

    email: "Email", password: "Password", name: "Name", iAm: "I am a",
    customerRole: "Customer (looking for workers)", workerRole: "Worker (offering my services)",
    welcomeBack: "Welcome back", loginSub: "Log in to see phone numbers and leave reviews.",
    createAccount: "Create your account", newHere: "New here?", haveAccount: "Already registered?",
    createOne: "Create an account", loginLink: "Log in",

    profileTitle: "Your worker profile",
    profileSub: "Fill this once. Customers will see it after the admin approves it.",
    phone: "Phone / WhatsApp number", rate: "Expected rate per hour (₹)",
    experience: "Years of experience", bioLang: "I will write about myself in",
    bio: "About you", bioHelp: "Write in English or Telugu. We translate it to the other language automatically.",
    save: "Save profile", saving: "Saving and translating…", saved: "Profile saved.",
    translationFail: "Saved, but the translation was not available right now. Your text is saved in the language you wrote it.",
    photo: "Profile photo", uploadPhoto: "Choose photo", uploading: "Uploading…",
    photoHelp: "JPG, PNG or WebP, up to 3 MB. Save your profile first.",
    status: "Status",
    pending: "Waiting for admin approval", approved: "Approved and visible to customers",
    rejected: "Rejected. Edit your profile and save to ask for review again.",
    englishVersion: "English version", teluguVersion: "Telugu version",

    adminTitle: "Admin panel", approve: "Approve", reject: "Reject", nothing: "Nothing here.",
    tabPending: "Pending", tabApproved: "Approved", tabRejected: "Rejected",
    customersCount: "customers", reviewsCount: "reviews",
    loading: "Loading…",
  },
  te: {
    navFind: "పనివారిని వెతకండి", navProfile: "నా ప్రొఫైల్", navAdmin: "అడ్మిన్",
    login: "లాగిన్", register: "సైన్ అప్", logout: "లాగౌట్",

    heroTitle: "మీ నగరంలో నమ్మకమైన పనివారిని కనుగొనండి",
    heroSub: "ప్లంబర్లు, ఎలక్ట్రీషియన్లు, ట్యూటర్లు మరియు మరిన్ని. వారి రేటు, రేటింగ్ చూసి నేరుగా కాల్ లేదా వాట్సాప్ చేయండి.",
    city: "నగరం", allCities: "అన్ని నగరాలు", workType: "పని రకం", all: "అన్నీ", sortBy: "క్రమం",
    sortRating: "అత్యధిక రేటింగ్", sortLow: "రేటు: తక్కువ నుండి ఎక్కువ", sortHigh: "రేటు: ఎక్కువ నుండి తక్కువ",
    sortExp: "ఎక్కువ అనుభవం",
    found: "పనివారు లభించారు", noResults: "ఈ ఫిల్టర్లకు పనివారు లభించలేదు.",
    prev: "వెనుకకు", next: "తరువాత", page: "పేజీ",

    perHour: "/గంట", yrs: "సం. అనుభవం", noRatings: "ఇంకా రేటింగ్‌లు లేవు", reviewsWord: "రివ్యూలు",
    showNumber: "నంబర్ చూపించు", loginToView: "నంబర్ చూడటానికి లాగిన్ అవ్వండి",
    call: "కాల్", whatsapp: "వాట్సాప్", viewProfile: "ప్రొఫైల్ చూడండి",
    sample: "నమూనా", sampleNote: "ఇది డెమో నంబర్‌తో ఉన్న నమూనా ప్రొఫైల్.",
    expectedRate: "అంచనా రేటు",

    about: "గురించి", reviews: "రివ్యూలు", noReviews: "ఇంకా రివ్యూలు లేవు.", writeReview: "రివ్యూ రాయండి",
    yourRating: "మీ రేటింగ్", comment: "వ్యాఖ్య (ఐచ్ఛికం)", submit: "సమర్పించు",
    onlyCustomers: "కస్టమర్లు మాత్రమే రివ్యూ ఇవ్వగలరు.",
    loginToReview: "రివ్యూ ఇవ్వడానికి కస్టమర్‌గా లాగిన్ అవ్వండి.",
    thanks: "ధన్యవాదాలు, మీ రివ్యూ చేర్చబడింది.", del: "తొలగించు", back: "శోధనకు తిరిగి వెళ్ళండి",

    email: "ఈమెయిల్", password: "పాస్‌వర్డ్", name: "పేరు", iAm: "నేను",
    customerRole: "కస్టమర్ (పనివారి కోసం చూస్తున్నాను)", workerRole: "పనివారు (నా సేవలు అందిస్తాను)",
    welcomeBack: "మళ్ళీ స్వాగతం", loginSub: "ఫోన్ నంబర్లు చూడటానికి మరియు రివ్యూ ఇవ్వడానికి లాగిన్ అవ్వండి.",
    createAccount: "మీ ఖాతాను సృష్టించండి", newHere: "కొత్తవారా?", haveAccount: "ఇప్పటికే ఖాతా ఉందా?",
    createOne: "ఖాతా సృష్టించండి", loginLink: "లాగిన్",

    profileTitle: "మీ పనివారి ప్రొఫైల్",
    profileSub: "ఒక్కసారి నింపండి. అడ్మిన్ ఆమోదించిన తర్వాత కస్టమర్లకు కనిపిస్తుంది.",
    phone: "ఫోన్ / వాట్సాప్ నంబర్", rate: "గంటకు అంచనా రేటు (₹)",
    experience: "అనుభవం (సంవత్సరాలు)", bioLang: "నా గురించి రాసే భాష",
    bio: "మీ గురించి", bioHelp: "ఇంగ్లీష్ లేదా తెలుగులో రాయండి. మిగతా భాషలోకి మేము ఆటోమేటిక్‌గా అనువదిస్తాము.",
    save: "ప్రొఫైల్ సేవ్ చేయండి", saving: "సేవ్ చేస్తూ అనువదిస్తున్నాము…", saved: "ప్రొఫైల్ సేవ్ అయింది.",
    translationFail: "సేవ్ అయింది, కానీ ఇప్పుడు అనువాదం అందుబాటులో లేదు. మీరు రాసిన భాషలో మీ టెక్స్ట్ సేవ్ అయింది.",
    photo: "ప్రొఫైల్ ఫోటో", uploadPhoto: "ఫోటో ఎంచుకోండి", uploading: "అప్‌లోడ్ అవుతోంది…",
    photoHelp: "JPG, PNG లేదా WebP, 3 MB వరకు. ముందుగా ప్రొఫైల్ సేవ్ చేయండి.",
    status: "స్థితి",
    pending: "అడ్మిన్ ఆమోదం కోసం వేచి ఉంది", approved: "ఆమోదించబడింది, కస్టమర్లకు కనిపిస్తుంది",
    rejected: "తిరస్కరించబడింది. ప్రొఫైల్ మార్చి సేవ్ చేస్తే మళ్ళీ సమీక్షకు వెళ్తుంది.",
    englishVersion: "ఇంగ్లీష్ వెర్షన్", teluguVersion: "తెలుగు వెర్షన్",

    adminTitle: "అడ్మిన్ ప్యానెల్", approve: "ఆమోదించు", reject: "తిరస్కరించు", nothing: "ఇక్కడ ఏమీ లేదు.",
    tabPending: "పెండింగ్", tabApproved: "ఆమోదించినవి", tabRejected: "తిరస్కరించినవి",
    customersCount: "కస్టమర్లు", reviewsCount: "రివ్యూలు",
    loading: "లోడ్ అవుతోంది…",
  },
};
