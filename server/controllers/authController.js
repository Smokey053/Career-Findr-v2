import { adminAuth } from '../config/firebase.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import config from '../config/config.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      uid: user.uid,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );
};

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  // Check if user already exists
  const existingUser = await User.getByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists',
    });
  }

  // Create user in Firebase Auth
  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName: `${firstName} ${lastName}`,
    emailVerified: false,
  });

  // Create user document in Firestore
  const userData = await User.create(userRecord.uid, {
    email,
    firstName,
    lastName,
    role: role || 'jobseeker',
  });

  // Generate JWT token
  const token = generateToken(userData);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        uid: userData.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      },
      token,
    },
  });
});

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Get user from Firestore
  const user = await User.getByEmail(email);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Verify user exists in Firebase Auth
  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    
    // Generate custom token for Firebase Auth
    const firebaseToken = await adminAuth.createCustomToken(userRecord.uid);
    
    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          uid: user.uid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImage: user.profileImage,
        },
        token,
        firebaseToken, // Can be used for client-side Firebase Auth
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }
});

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.getById(req.user.uid);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

/**
 * Update user profile
 * @route PUT /api/auth/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    'firstName',
    'lastName',
    'phone',
    'bio',
    'skills',
    'experience',
    'education',
    'profileImage',
    'resume',
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const updatedUser = await User.update(req.user.uid, updates);

  // Update Firebase Auth display name if firstName or lastName changed
  if (updates.firstName || updates.lastName) {
    const displayName = `${updatedUser.firstName} ${updatedUser.lastName}`;
    await adminAuth.updateUser(req.user.uid, { displayName });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser,
    },
  });
});

/**
 * Change password
 * @route PUT /api/auth/change-password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Update password in Firebase Auth
  await adminAuth.updateUser(req.user.uid, {
    password: newPassword,
  });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * Send password reset email
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.getByEmail(email);
  
  if (!user) {
    // Don't reveal if user exists or not
    return res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent',
    });
  }

  // Generate password reset link using Firebase Admin
  const link = await adminAuth.generatePasswordResetLink(email);

  // TODO: Send email with reset link
  // For now, just return success
  console.log('Password reset link:', link);

  res.status(200).json({
    success: true,
    message: 'Password reset link sent to your email',
    // In development, you might want to include the link
    ...(process.env.NODE_ENV === 'development' && { resetLink: link }),
  });
});

/**
 * Verify email
 * @route POST /api/auth/verify-email
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { uid } = req.user;

  // Update email verification status
  await adminAuth.updateUser(uid, {
    emailVerified: true,
  });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});

/**
 * Logout user (optional - mainly for token invalidation if implementing blacklist)
 * @route POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  // If you implement token blacklist, add token to blacklist here
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * Delete user account
 * @route DELETE /api/auth/account
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  const { uid } = req.user;

  // Delete user from Firestore
  await User.delete(uid);

  // Delete user from Firebase Auth
  await adminAuth.deleteUser(uid);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
});

export default {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyEmail,
  logout,
  deleteAccount,
};
