import Job from '../models/Job.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Create a new job posting
 * @route POST /api/jobs
 * @access Private (Employer only)
 */
export const createJob = asyncHandler(async (req, res) => {
  const { uid } = req.user;

  // Verify user is an employer
  const user = await User.getById(uid);
  if (user.role !== 'employer' && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only employers can create job postings',
    });
  }

  const job = await Job.create(req.body, uid);

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: { job },
  });
});

/**
 * Get all jobs with filters
 * @route GET /api/jobs
 * @access Public
 */
export const getAllJobs = asyncHandler(async (req, res) => {
  const { type, category, experienceLevel, page = 1, limit = 10 } = req.query;

  const filters = {};
  if (type) filters.type = type;
  if (category) filters.category = category;
  if (experienceLevel) filters.experienceLevel = experienceLevel;

  const jobs = await Job.getAll(filters, parseInt(page), parseInt(limit));

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: { jobs },
  });
});

/**
 * Search jobs by keyword
 * @route GET /api/jobs/search
 * @access Public
 */
export const searchJobs = asyncHandler(async (req, res) => {
  const { q, type, category, experienceLevel, page = 1, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
  }

  const filters = {};
  if (type) filters.type = type;
  if (category) filters.category = category;
  if (experienceLevel) filters.experienceLevel = experienceLevel;

  const jobs = await Job.search(q, filters, parseInt(page), parseInt(limit));

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: { jobs },
  });
});

/**
 * Get featured/recommended jobs
 * @route GET /api/jobs/featured
 * @access Public
 */
export const getFeaturedJobs = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const jobs = await Job.getFeatured(parseInt(limit));

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: { jobs },
  });
});

/**
 * Get single job by ID
 * @route GET /api/jobs/:id
 * @access Public
 */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.getById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  res.status(200).json({
    success: true,
    data: { job },
  });
});

/**
 * Update job
 * @route PUT /api/jobs/:id
 * @access Private (Employer - own jobs only)
 */
export const updateJob = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const job = await Job.getById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  // Check if user is the job owner or admin
  const user = await User.getById(uid);
  if (job.employerId !== uid && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this job',
    });
  }

  const updatedJob = await Job.update(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    data: { job: updatedJob },
  });
});

/**
 * Delete job
 * @route DELETE /api/jobs/:id
 * @access Private (Employer - own jobs only)
 */
export const deleteJob = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const job = await Job.getById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  // Check if user is the job owner or admin
  const user = await User.getById(uid);
  if (job.employerId !== uid && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this job',
    });
  }

  await Job.delete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
  });
});

/**
 * Get jobs by employer
 * @route GET /api/jobs/employer/:employerId
 * @access Public
 */
export const getJobsByEmployer = asyncHandler(async (req, res) => {
  const { employerId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const jobs = await Job.getByEmployer(employerId, parseInt(page), parseInt(limit));

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: { jobs },
  });
});

/**
 * Get my posted jobs (for logged-in employer)
 * @route GET /api/jobs/my-jobs
 * @access Private (Employer only)
 */
export const getMyJobs = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const jobs = await Job.getByEmployer(uid, parseInt(page), parseInt(limit));

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: { jobs },
  });
});

export default {
  createJob,
  getAllJobs,
  searchJobs,
  getFeaturedJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByEmployer,
  getMyJobs,
};
