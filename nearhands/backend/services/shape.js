// What the public can see about a worker. The phone number is deliberately NOT included.
// p.user must be populated with at least { name }.
exports.publicShape = (p) => ({
  _id: p._id,
  name: p.user?.name || "Worker",
  trade: p.trade,
  city: p.city,
  ratePerHour: p.ratePerHour,
  experienceYears: p.experienceYears,
  bio: p.bio,
  photoUrl: p.photoUrl,
  ratingAvg: p.ratingAvg,
  ratingCount: p.ratingCount,
  isSample: p.isSample,
});
