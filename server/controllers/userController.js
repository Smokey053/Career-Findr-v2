import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get user profile by ID
 * @route GET /api/users/:id
 * @access Public
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.getById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Remove sensitive information
  const publicProfile = {
    uid: user.uid,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    profileImage: user.profileImage,
    bio: user.bio,
    skills: user.skills,
    experience: user.experience,
    education: user.education,
  };

  res.status(200).json({
    success: true,
    data: { user: publicProfile },
  });
});

/**
 * Get all users (admin only)
 * @route GET /api/users
 * @access Private (Admin only)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.user;
  
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const { page = 1, limit = 10 } = req.query;
  const users = await User.getAll(parseInt(page), parseInt(limit));

  res.status(200).json({
    success: true,
    count: users.length,
    data: { users },
  });
});

/**
 * Search users
 * @route GET /api/users/search
 * @access Private (Employer for finding jobseekers, Admin)
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { role: userRole } = req.user;
  const { role, page = 1, limit = 10 } = req.query;

  // Only employers and admins can search users
  if (userRole !== 'employer' && userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const criteria = {};
  if (role) criteria.role = role;

  const users = await User.search(criteria, parseInt(page), parseInt(limit));

  res.status(200).json({
    success: true,
    count: users.length,
    data: { users },
  });
});

/**
 * Save a job (bookmark)
 * @route POST /api/users/saved-jobs/:jobId
 * @access Private (Jobseeker only)
 */
export const saveJob = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { jobId } = req.params;

  const updatedUser = await User.saveJob(uid, jobId);

  res.status(200).json({
    success: true,
    message: 'Job saved successfully',
    data: { savedJobs: updatedUser.savedJobs },
  });
});

/**
 * Remove saved job
 * @route DELETE /api/users/saved-jobs/:jobId
 * @access Private (Jobseeker only)
 */
export const unsaveJob = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { jobId } = req.params;

  const updatedUser = await User.unsaveJob(uid, jobId);

  res.status(200).json({
    success: true,
    message: 'Job removed from saved list',
    data: { savedJobs: updatedUser.savedJobs },
  });
});

/**
 * Get saved jobs
 * @route GET /api/users/saved-jobs
 * @access Private
 */
export const getSavedJobs = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const user = await User.getById(uid);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: { savedJobs: user.savedJobs },
  });
});

/**
 * Delete user (admin only)
 * @route DELETE /api/users/:id
 * @access Private (Admin only)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { role } = req.user;
  
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  await User.delete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

export default {
  getUserById,
  getAllUsers,
  searchUsers,
  saveJob,
  unsaveJob,
  getSavedJobs,
  deleteUser,
};
