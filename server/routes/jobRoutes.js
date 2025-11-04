import express from 'express';
import {
  createJob,
  getAllJobs,
  searchJobs,
  getFeaturedJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByEmployer,
  getMyJobs,
} from '../controllers/jobController.js';
import { verifyToken, checkRole } from '../middleware/auth.js';
import {
  validateJobCreation,
  validateId,
  validateSearch,
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/search', validateSearch, searchJobs);
router.get('/featured', getFeaturedJobs);
router.get('/employer/:employerId', getJobsByEmployer);
router.get('/:id', validateId, getJobById);

// Protected routes (Employer/Admin only)
router.post(
  '/',
  verifyToken,
  checkRole('employer', 'admin'),
  validateJobCreation,
  createJob
);

router.get(
  '/my/jobs',
  verifyToken,
  checkRole('employer', 'admin'),
  getMyJobs
);

router.put(
  '/:id',
  verifyToken,
  checkRole('employer', 'admin'),
  validateId,
  updateJob
);

router.delete(
  '/:id',
  verifyToken,
  checkRole('employer', 'admin'),
  validateId,
  deleteJob
);

export default router;
