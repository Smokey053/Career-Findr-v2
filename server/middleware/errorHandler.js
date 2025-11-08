export const errorHandler = (err, req, res, next) => {
  console.error("Error Details:", {
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // Firebase Auth errors
  if (err.code === "auth/email-already-exists") {
    return res.status(400).json({
      success: false,
      message:
        "Email already registered. Please use a different email or login.",
    });
  }

  if (err.code === "auth/invalid-email") {
    return res.status(400).json({
      success: false,
      message: "Invalid email address format.",
    });
  }

  if (err.code === "auth/weak-password") {
    return res.status(400).json({
      success: false,
      message: "Password should be at least 6 characters long.",
    });
  }

  if (err.code === "auth/user-not-found") {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  if (err.code === "auth/wrong-password") {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials.",
    });
  }

  // Firestore errors
  if (err.code === "not-found" || err.code === 5) {
    return res.status(404).json({
      success: false,
      message: "Resource not found.",
    });
  }

  if (err.code === "already-exists" || err.code === 6) {
    return res.status(409).json({
      success: false,
      message: "Resource already exists.",
    });
  }

  if (err.code === "permission-denied" || err.code === 7) {
    return res.status(403).json({
      success: false,
      message: "Permission denied.",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Authentication token has expired. Please login again.",
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: err.errors,
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An internal server error occurred. Please try again later."
        : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
