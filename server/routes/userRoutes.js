import express from 'express';
import {
  getUserById,
  getAllUsers,
  searchUsers,
  saveJob,
  unsaveJob,
  getSavedJobs,
  deleteUser,
} from '../controllers/userController.js';
import { verifyToken, checkRole } from '../middleware/auth.js';
import { validateId } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/:id', validateId, getUserById);

// Protected routes
router.get('/', verifyToken, checkRole('admin'), getAllUsers);
router.get('/search', verifyToken, checkRole('employer', 'admin'), searchUsers);

// Saved jobs (Jobseeker)
router.get('/saved-jobs', verifyToken, checkRole('jobseeker'), getSavedJobs);
router.post('/saved-jobs/:jobId', verifyToken, checkRole('jobseeker'), saveJob);
router.delete('/saved-jobs/:jobId', verifyToken, checkRole('jobseeker'), unsaveJob);

// Admin routes
router.delete('/:id', verifyToken, checkRole('admin'), validateId, deleteUser);

export default router;
