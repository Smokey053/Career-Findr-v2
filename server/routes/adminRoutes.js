import express from "express";
import {
  getPendingApprovals,
  approveUser,
  getAllUsers,
  getUserDetails,
  deleteUser,
  getPlatformStats,
  verifyTranscript,
  getRecentActivities,
} from "../controllers/adminController.js";
import { requireRole } from "../middleware/authMiddleware.js";
import { validateApproval } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Apply role check middleware to all routes
router.use(requireRole("admin"));

// User management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);
router.delete("/users/:userId", deleteUser);

// Approval management
router.get("/approvals/pending", getPendingApprovals);
router.put("/approvals/:userId", approveUser);

// Transcript verification
router.put("/transcripts/:transcriptId/verify", verifyTranscript);

// Platform statistics and activities
router.get("/stats", getPlatformStats);
router.get("/activities", getRecentActivities);

export default router;
