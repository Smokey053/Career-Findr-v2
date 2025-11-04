import express from 'express';
import {
  applyForJob,
  getAllApplications,
  getMyApplications,
  getReceivedApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats,
} from '../controllers/applicationController.js';
import { verifyToken, checkRole } from '../middleware/auth.js';
import {
  validateJobApplication,
  validateId,
} from '../middleware/validation.js';

const router = express.Router();

// All routes are protected - require authentication
router.use(verifyToken);

// Jobseeker routes
router.post('/', checkRole('jobseeker'), validateJobApplication, applyForJob);
router.get('/my-applications', checkRole('jobseeker'), getMyApplications);
router.delete('/:id', checkRole('jobseeker'), validateId, withdrawApplication);

// Employer routes
router.get('/received', checkRole('employer', 'admin'), getReceivedApplications);
router.put(
  '/:id/status',
  checkRole('employer', 'admin'),
  validateId,
  updateApplicationStatus
);
router.get('/stats', checkRole('employer', 'admin'), getApplicationStats);

// Admin routes
router.get('/', checkRole('admin'), getAllApplications);

// Shared routes (Jobseeker, Employer, Admin)
router.get('/:id', validateId, getApplicationById);

export default router;
