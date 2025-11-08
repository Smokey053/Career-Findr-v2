import express from "express";
import {
  getCompanyProfile,
  updateCompanyProfile,
  createJob,
  getCompanyJobs,
  updateJob,
  closeJob,
  getJobApplications,
  reviewJobApplication,
  getCompanyStats,
  searchCandidates,
} from "../controllers/companyController.js";
import { requireRole } from "../middleware/authMiddleware.js";
import { validateJobPosting } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Apply role check middleware to all routes
router.use(requireRole("company"));

// Company profile routes
router.get("/profile", getCompanyProfile);
router.put("/profile", updateCompanyProfile);

// Job routes
router.post("/jobs", validateJobPosting, createJob);
router.get("/jobs", getCompanyJobs);
router.put("/jobs/:jobId", updateJob);
router.post("/jobs/:jobId/close", closeJob);

// Job application routes
router.get("/jobs/:jobId/applications", getJobApplications);
router.put("/applications/:applicationId/review", reviewJobApplication);

// Candidate search
router.get("/candidates/search", searchCandidates);

// Statistics
router.get("/stats", getCompanyStats);

export default router;
