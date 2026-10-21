exports.notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

exports.errorHandler = (err, req, res, next) => {
  console.error(err.message);
  let status = err.status || 500;
  let message = err.message || "Server error";

  if (err.name === "ValidationError") status = 400;
  if (err.name === "CastError") { status = 400; message = "Invalid id"; }
  if (err.code === 11000) { status = 409; message = "That record already exists"; }
  if (err.name === "MulterError") {
    status = 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "Photo must be smaller than 3 MB" : err.message;
  }

  res.status(status).json({ message });
};
