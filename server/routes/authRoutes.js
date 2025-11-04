import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyEmail,
  logout,
  deleteAccount,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateEmail,
  validatePasswordReset,
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateEmail, forgotPassword);

// Protected routes
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, validateProfileUpdate, updateProfile);
router.put('/change-password', verifyToken, changePassword);
router.post('/verify-email', verifyToken, verifyEmail);
router.post('/logout', verifyToken, logout);
router.delete('/account', verifyToken, deleteAccount);

export default router;
