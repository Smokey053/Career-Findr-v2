import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  getAvailableCourses,
  applyForCourse,
  getStudentApplications,
  withdrawApplication,
  getAdmissionResults,
  acceptAdmissionOffer,
  uploadTranscript,
  getStudentTranscripts,
  getAvailableJobs,
  applyForJob,
  getStudentJobApplications,
} from "../controllers/studentController.js";
import { requireRole } from "../middleware/authMiddleware.js";
import {
  validateStudentProfile,
  validateCourseApplication,
  validateJobApplication,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Apply role check middleware to all routes
router.use(requireRole("student"));

// Student profile routes
router.get("/profile", getStudentProfile);
router.put("/profile", validateStudentProfile, updateStudentProfile);

// Course routes
router.get("/courses", getAvailableCourses);
router.post("/courses/apply", validateCourseApplication, applyForCourse);
router.get("/applications", getStudentApplications);
router.delete("/applications/:applicationId", withdrawApplication);

// Admission routes
router.get("/admissions", getAdmissionResults);
router.post("/admissions/accept", acceptAdmissionOffer);

// Transcript routes
router.post("/transcripts", uploadTranscript);
router.get("/transcripts", getStudentTranscripts);

// Job routes
router.get("/jobs", getAvailableJobs);
router.post("/jobs/apply", validateJobApplication, applyForJob);
router.get("/job-applications", getStudentJobApplications);

export default router;
