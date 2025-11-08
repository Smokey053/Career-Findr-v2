import express from "express";
import {
  getInstituteProfile,
  updateInstituteProfile,
  createCourse,
  getInstituteCourses,
  updateCourse,
  deleteCourse,
  getCourseApplications,
  reviewApplication,
  createAdmissions,
  getInstituteAdmissions,
  getInstituteStats,
} from "../controllers/instituteController.js";
import { requireRole } from "../middleware/authMiddleware.js";
import {
  validateCourse,
  validateAdmission,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Apply role check middleware to all routes
router.use(requireRole("institute"));

// Institute profile routes
router.get("/profile", getInstituteProfile);
router.put("/profile", updateInstituteProfile);

// Course routes
router.post("/courses", validateCourse, createCourse);
router.get("/courses", getInstituteCourses);
router.put("/courses/:courseId", updateCourse);
router.delete("/courses/:courseId", deleteCourse);

// Application routes
router.get("/courses/:courseId/applications", getCourseApplications);
router.put("/applications/:applicationId/review", reviewApplication);

// Admission routes
router.post("/admissions", createAdmissions);
router.get("/admissions", getInstituteAdmissions);

// Statistics
router.get("/stats", getInstituteStats);

export default router;
