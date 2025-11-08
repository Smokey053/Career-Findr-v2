import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification,
  getCurrentUser,
  forgotPassword,
  logout,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  validateRegistration,
  validateLogin,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);
router.post("/logout", authenticateToken, logout);

export default router;
