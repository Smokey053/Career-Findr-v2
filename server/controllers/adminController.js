import { db, auth } from "../config/firebaseConfig.js";
import { sendApprovalEmail } from "../utils/emailService.js";

export const getPendingApprovals = async (req, res, next) => {
  try {
    const { role } = req.query;

    let query = db
      .collection("users")
      .where("isVerified", "==", true)
      .where("isApproved", "==", false);

    if (role && ["institute", "company"].includes(role)) {
      query = query.where("role", "==", role);
    }

    const usersSnapshot = await query.get();

    const pendingUsers = usersSnapshot.docs.map((doc) => {
      const userData = doc.data();
      return {
        userId: userData.userId,
        email: userData.email,
        role: userData.role,
        profile: userData.profile,
        createdAt: userData.createdAt,
        isVerified: userData.isVerified,
      };
    });

    res.json({
      success: true,
      pendingApprovals: pendingUsers,
      total: pendingUsers.length,
    });
  } catch (error) {
    next(error);
  }
};

export const approveUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { approved, remarks } = req.body;

    if (typeof approved !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Approved parameter must be true or false",
      });
    }

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    // Only institutes and companies need approval
    if (!["institute", "company"].includes(userData.role)) {
      return res.status(400).json({
        success: false,
        message: "Only institutes and companies require approval",
      });
    }

    // Update approval status
    await userDoc.ref.update({
      isApproved: approved,
      approvedAt: approved ? new Date().toISOString() : null,
      approvedBy: req.user.uid,
      approvalRemarks: remarks || "",
      updatedAt: new Date().toISOString(),
    });

    // Send approval/rejection email
    if (approved) {
      try {
        await sendApprovalEmail(
          userData.email,
          userData.profile?.name || "User",
          userData.role
        );
      } catch (emailError) {
        console.error("Approval email failed:", emailError);
      }
    }

    res.json({
      success: true,
      message: approved
        ? "User approved successfully"
        : "User approval declined",
      userId,
      approved,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, verified, approved, page = 1, limit = 50 } = req.query;

    let query = db.collection("users");

    if (role) {
      query = query.where("role", "==", role);
    }

    if (verified !== undefined) {
      query = query.where("isVerified", "==", verified === "true");
    }

    if (approved !== undefined && ["institute", "company"].includes(role)) {
      query = query.where("isApproved", "==", approved === "true");
    }

    const usersSnapshot = await query.get();

    const users = usersSnapshot.docs.map((doc) => {
      const userData = doc.data();
      return {
        userId: userData.userId,
        email: userData.email,
        role: userData.role,
        isVerified: userData.isVerified,
        isApproved: userData.isApproved,
        profile: {
          name: userData.profile?.name,
          phone: userData.profile?.phone,
          location: userData.profile?.location,
        },
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin,
      };
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);

    res.json({
      success: true,
      users: paginatedUsers,
      pagination: {
        total: users.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(users.length / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    // Get additional data based on role
    let additionalData = {};

    if (userData.role === "student") {
      const applicationsSnapshot = await db
        .collection("applications")
        .where("studentId", "==", userId)
        .get();

      const jobApplicationsSnapshot = await db
        .collection("jobApplications")
        .where("studentId", "==", userId)
        .get();

      additionalData = {
        totalApplications: applicationsSnapshot.size,
        totalJobApplications: jobApplicationsSnapshot.size,
      };
    } else if (userData.role === "institute") {
      const coursesSnapshot = await db
        .collection("courses")
        .where("institutionId", "==", userId)
        .get();

      additionalData = {
        totalCourses: coursesSnapshot.size,
        activeCourses: coursesSnapshot.docs.filter((d) => d.data().isActive)
          .length,
      };
    } else if (userData.role === "company") {
      const jobsSnapshot = await db
        .collection("jobs")
        .where("companyId", "==", userId)
        .get();

      additionalData = {
        totalJobs: jobsSnapshot.size,
        openJobs: jobsSnapshot.docs.filter((d) => d.data().status === "open")
          .length,
      };
    }

    res.json({
      success: true,
      user: {
        ...userData,
        ...additionalData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { permanent } = req.query;

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (permanent === "true") {
      // Permanent delete from Firestore and Firebase Auth
      await auth.deleteUser(userId);
      await userDoc.ref.delete();

      res.json({
        success: true,
        message: "User permanently deleted",
      });
    } else {
      // Soft delete (disable account)
      await auth.updateUser(userId, { disabled: true });
      await userDoc.ref.update({
        isActive: false,
        deletedAt: new Date().toISOString(),
        deletedBy: req.user.uid,
      });

      res.json({
        success: true,
        message: "User account disabled",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getPlatformStats = async (req, res, next) => {
  try {
    // Get users count
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map((doc) => doc.data());

    const studentCount = users.filter((u) => u.role === "student").length;
    const instituteCount = users.filter((u) => u.role === "institute").length;
    const companyCount = users.filter((u) => u.role === "company").length;
    const verifiedUsers = users.filter((u) => u.isVerified).length;

    // Get courses count
    const coursesSnapshot = await db.collection("courses").get();
    const activeCourses = coursesSnapshot.docs.filter(
      (d) => d.data().isActive
    ).length;

    // Get jobs count
    const jobsSnapshot = await db.collection("jobs").get();
    const openJobs = jobsSnapshot.docs.filter(
      (d) => d.data().status === "open"
    ).length;

    // Get applications count
    const applicationsSnapshot = await db.collection("applications").get();
    const pendingApplications = applicationsSnapshot.docs.filter(
      (d) => d.data().status === "pending"
    ).length;

    // Get job applications count
    const jobApplicationsSnapshot = await db
      .collection("jobApplications")
      .get();

    // Get admissions count
    const admissionsSnapshot = await db.collection("admissions").get();
    const confirmedAdmissions = admissionsSnapshot.docs.filter(
      (d) => d.data().studentResponse === "accepted"
    ).length;

    // Get pending approvals
    const pendingApprovalsSnapshot = await db
      .collection("users")
      .where("isVerified", "==", true)
      .where("isApproved", "==", false)
      .where("role", "in", ["institute", "company"])
      .get();

    res.json({
      success: true,
      stats: {
        users: {
          total: usersSnapshot.size,
          students: studentCount,
          institutes: instituteCount,
          companies: companyCount,
          verified: verifiedUsers,
          pendingApprovals: pendingApprovalsSnapshot.size,
        },
        courses: {
          total: coursesSnapshot.size,
          active: activeCourses,
        },
        jobs: {
          total: jobsSnapshot.size,
          open: openJobs,
        },
        applications: {
          total: applicationsSnapshot.size,
          pending: pendingApplications,
        },
        jobApplications: {
          total: jobApplicationsSnapshot.size,
        },
        admissions: {
          total: admissionsSnapshot.size,
          confirmed: confirmedAdmissions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyTranscript = async (req, res, next) => {
  try {
    const { transcriptId } = req.params;
    const { verified, remarks } = req.body;

    if (typeof verified !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Verified parameter must be true or false",
      });
    }

    const transcriptDoc = await db
      .collection("transcripts")
      .doc(transcriptId)
      .get();

    if (!transcriptDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Transcript not found",
      });
    }

    await transcriptDoc.ref.update({
      verified,
      verifiedBy: req.user.uid,
      verifiedAt: new Date().toISOString(),
      verificationRemarks: remarks || "",
    });

    res.json({
      success: true,
      message: verified
        ? "Transcript verified successfully"
        : "Transcript verification declined",
      transcriptId,
      verified,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivities = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;

    // This is a simplified version. In production, you'd maintain an activities log
    const activities = [];

    // Get recent registrations
    const recentUsersSnapshot = await db
      .collection("users")
      .orderBy("createdAt", "desc")
      .limit(parseInt(limit) / 4)
      .get();

    recentUsersSnapshot.docs.forEach((doc) => {
      const userData = doc.data();
      activities.push({
        type: "user_registered",
        timestamp: userData.createdAt,
        data: {
          userId: userData.userId,
          role: userData.role,
          email: userData.email,
        },
      });
    });

    // Get recent applications
    const recentAppsSnapshot = await db
      .collection("applications")
      .orderBy("appliedAt", "desc")
      .limit(parseInt(limit) / 4)
      .get();

    for (const doc of recentAppsSnapshot.docs) {
      const appData = doc.data();
      activities.push({
        type: "course_application",
        timestamp: appData.appliedAt,
        data: {
          applicationId: appData.applicationId,
          studentId: appData.studentId,
          status: appData.status,
        },
      });
    }

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      activities: activities.slice(0, parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};
