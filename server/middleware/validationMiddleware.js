import { body, param, query } from "express-validator";

// Auth validation
export const validateRegistration = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["student", "institute", "company", "admin"])
    .withMessage("Invalid role"),
  body("profileData.name").trim().notEmpty().withMessage("Name is required"),
];

export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Student validation
export const validateStudentProfile = [
  body("profile.name").optional().trim().notEmpty(),
  body("profile.phone").optional().isMobilePhone(),
  body("profile.dateOfBirth").optional().isISO8601(),
  body("profile.address").optional().isObject(),
  body("profile.education").optional().isArray(),
];

export const validateCourseApplication = [
  body("courseId").notEmpty().withMessage("Course ID is required"),
  body("institutionId").notEmpty().withMessage("Institution ID is required"),
  body("documents")
    .optional()
    .isArray()
    .withMessage("Documents must be an array"),
];

export const validateJobApplication = [
  body("jobId").notEmpty().withMessage("Job ID is required"),
  body("companyId").notEmpty().withMessage("Company ID is required"),
  body("coverLetter")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Cover letter must be less than 1000 characters"),
];

// Institute validation
export const validateCourse = [
  body("title").trim().notEmpty().withMessage("Course title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required"),
  body("duration").notEmpty().withMessage("Duration is required"),
  body("fee").isNumeric().withMessage("Fee must be a number"),
  body("eligibility")
    .isArray()
    .withMessage("Eligibility criteria must be an array"),
  body("category").notEmpty().withMessage("Category is required"),
  body("seats")
    .isInt({ min: 1 })
    .withMessage("Seats must be a positive integer"),
];

export const validateAdmission = [
  body("applicationId").notEmpty().withMessage("Application ID is required"),
  body("status")
    .isIn(["accepted", "rejected"])
    .withMessage("Status must be accepted or rejected"),
];

// Company validation
export const validateJobPosting = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required"),
  body("requirements").isArray().withMessage("Requirements must be an array"),
  body("salary")
    .optional()
    .isObject()
    .withMessage("Salary must be an object with min and max"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("type")
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Invalid job type"),
  body("positions")
    .isInt({ min: 1 })
    .withMessage("Positions must be a positive integer"),
];

// Admin validation
export const validateApproval = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("approved").isBoolean().withMessage("Approved must be a boolean"),
];

// Common validation
export const validateId = [
  param("id").notEmpty().withMessage("ID parameter is required"),
];

export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
