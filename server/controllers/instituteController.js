import { db } from "../config/firebaseConfig.js";
import { validationResult } from "express-validator";
import {
  sendApplicationStatusEmail,
  sendAdmissionOfferEmail,
} from "../utils/emailService.js";

export const getInstituteProfile = async (req, res, next) => {
  try {
    const { uid } = req.user;

    const instituteDoc = await db.collection("users").doc(uid).get();

    if (!instituteDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Institute profile not found",
      });
    }

    const instituteData = instituteDoc.data();

    res.json({
      success: true,
      profile: {
        userId: instituteData.userId,
        email: instituteData.email,
        role: instituteData.role,
        isApproved: instituteData.isApproved,
        profile: instituteData.profile,
        createdAt: instituteData.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateInstituteProfile = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const updateData = req.body;

    // Don't allow updating sensitive fields
    delete updateData.userId;
    delete updateData.email;
    delete updateData.role;
    delete updateData.isVerified;
    delete updateData.isApproved;

    await db
      .collection("users")
      .doc(uid)
      .update({
        profile: updateData.profile || updateData,
        updatedAt: new Date().toISOString(),
      });

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { uid } = req.user;
    const {
      title,
      description,
      duration,
      fee,
      eligibility,
      category,
      seats,
      startDate,
      endDate,
    } = req.body;

    const courseId = `course_${uid}_${Date.now()}`;
    const courseData = {
      courseId,
      institutionId: uid,
      title,
      description,
      duration,
      fee,
      eligibility,
      category,
      seats,
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("courses").doc(courseId).set(courseData);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: courseData,
    });
  } catch (error) {
    next(error);
  }
};

export const getInstituteCourses = async (req, res, next) => {
  try {
    const { uid } = req.user;

    const coursesSnapshot = await db
      .collection("courses")
      .where("institutionId", "==", uid)
      .get();

    const courses = [];

    for (const doc of coursesSnapshot.docs) {
      const courseData = doc.data();

      // Get application count
      const applicationsSnapshot = await db
        .collection("applications")
        .where("courseId", "==", doc.id)
        .get();

      courses.push({
        courseId: doc.id,
        ...courseData,
        applicationCount: applicationsSnapshot.size,
        pendingApplications: applicationsSnapshot.docs.filter(
          (d) => d.data().status === "pending"
        ).length,
      });
    }

    res.json({
      success: true,
      courses: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { courseId } = req.params;
    const updateData = req.body;

    const courseDoc = await db.collection("courses").doc(courseId).get();

    if (!courseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const courseData = courseDoc.data();

    // Verify ownership
    if (courseData.institutionId !== uid) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own courses",
      });
    }

    // Don't allow updating certain fields
    delete updateData.courseId;
    delete updateData.institutionId;
    delete updateData.createdAt;

    await courseDoc.ref.update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Course updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { courseId } = req.params;

    const courseDoc = await db.collection("courses").doc(courseId).get();

    if (!courseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const courseData = courseDoc.data();

    if (courseData.institutionId !== uid) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own courses",
      });
    }

    // Check if there are pending applications
    const pendingAppsSnapshot = await db
      .collection("applications")
      .where("courseId", "==", courseId)
      .where("status", "==", "pending")
      .get();

    if (!pendingAppsSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete course with pending applications. Please review them first.",
      });
    }

    // Soft delete (mark as inactive)
    await courseDoc.ref.update({
      isActive: false,
      deletedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseApplications = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { courseId } = req.params;
    const { status } = req.query;

    // Verify course ownership
    const courseDoc = await db.collection("courses").doc(courseId).get();

    if (!courseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (courseDoc.data().institutionId !== uid) {
      return res.status(403).json({
        success: false,
        message: "You can only view applications for your own courses",
      });
    }

    let applicationsQuery = db
      .collection("applications")
      .where("courseId", "==", courseId);

    if (status) {
      applicationsQuery = applicationsQuery.where("status", "==", status);
    }

    const applicationsSnapshot = await applicationsQuery.get();
    const applications = [];

    for (const doc of applicationsSnapshot.docs) {
      const appData = doc.data();
      const studentDoc = await db
        .collection("users")
        .doc(appData.studentId)
        .get();
      const transcriptSnapshot = await db
        .collection("transcripts")
        .where("studentId", "==", appData.studentId)
        .where("verified", "==", true)
        .get();

      applications.push({
        applicationId: doc.id,
        ...appData,
        student: studentDoc.exists
          ? {
              name: studentDoc.data().profile?.name,
              email: studentDoc.data().email,
              profile: studentDoc.data().profile,
            }
          : null,
        hasVerifiedTranscript: !transcriptSnapshot.empty,
      });
    }

    res.json({
      success: true,
      applications: applications,
      summary: {
        total: applications.length,
        pending: applications.filter((a) => a.status === "pending").length,
        accepted: applications.filter((a) => a.status === "accepted").length,
        rejected: applications.filter((a) => a.status === "rejected").length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const reviewApplication = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { applicationId } = req.params;
    const { status, remarks } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either accepted or rejected",
      });
    }

    const applicationDoc = await db
      .collection("applications")
      .doc(applicationId)
      .get();

    if (!applicationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const applicationData = applicationDoc.data();

    // Verify course ownership
    const courseDoc = await db
      .collection("courses")
      .doc(applicationData.courseId)
      .get();
    if (courseDoc.data().institutionId !== uid) {
      return res.status(403).json({
        success: false,
        message: "You can only review applications for your own courses",
      });
    }

    // Check if already reviewed
    if (applicationData.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Application has already been reviewed",
      });
    }

    // Update application
    await applicationDoc.ref.update({
      status,
      remarks: remarks || "",
      reviewedAt: new Date().toISOString(),
      reviewedBy: uid,
    });

    // Get student and course info for email
    const studentDoc = await db
      .collection("users")
      .doc(applicationData.studentId)
      .get();
    const courseData = courseDoc.data();

    // Send email notification
    try {
      await sendApplicationStatusEmail(
        studentDoc.data().email,
        studentDoc.data().profile?.name,
        courseData.title,
        status
      );
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      applicationId,
      status,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdmissions = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { courseId, selectedStudents } = req.body;

    if (!Array.isArray(selectedStudents) || selectedStudents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Selected students array is required",
      });
    }

    // Verify course ownership
    const courseDoc = await db.collection("courses").doc(courseId).get();

    if (!courseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (courseDoc.data().institutionId !== uid) {
      return res.status(403).json({
        success: false,
        message: "You can only create admissions for your own courses",
      });
    }

    const courseData = courseDoc.data();
    const admissions = [];

    // Get institute info
    const instituteDoc = await db.collection("users").doc(uid).get();
    const instituteName = instituteDoc.data().profile?.name;

    for (const studentId of selectedStudents) {
      // Check if student has accepted application
      const applicationSnapshot = await db
        .collection("applications")
        .where("courseId", "==", courseId)
        .where("studentId", "==", studentId)
        .where("status", "==", "accepted")
        .get();

      if (applicationSnapshot.empty) {
        continue; // Skip if no accepted application
      }

      // Check if admission already exists
      const existingAdmissionSnapshot = await db
        .collection("admissions")
        .where("courseId", "==", courseId)
        .where("studentId", "==", studentId)
        .get();

      if (!existingAdmissionSnapshot.empty) {
        continue; // Skip if admission already exists
      }

      const admissionId = `admission_${studentId}_${courseId}_${Date.now()}`;
      const admissionData = {
        admissionId,
        studentId,
        courseId,
        institutionId: uid,
        status: "offered",
        studentResponse: null,
        offeredAt: new Date().toISOString(),
        respondedAt: null,
      };

      await db.collection("admissions").doc(admissionId).set(admissionData);
      admissions.push(admissionData);

      // Send admission offer email
      try {
        const studentDoc = await db.collection("users").doc(studentId).get();
        await sendAdmissionOfferEmail(
          studentDoc.data().email,
          studentDoc.data().profile?.name,
          courseData.title,
          instituteName
        );
      } catch (emailError) {
        console.error("Admission email failed:", emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: `${admissions.length} admission offer(s) created successfully`,
      admissions: admissions,
    });
  } catch (error) {
    next(error);
  }
};

export const getInstituteAdmissions = async (req, res, next) => {
  try {
    const { uid } = req.user;

    const admissionsSnapshot = await db
      .collection("admissions")
      .where("institutionId", "==", uid)
      .get();

    const admissions = [];

    for (const doc of admissionsSnapshot.docs) {
      const admissionData = doc.data();
      const studentDoc = await db
        .collection("users")
        .doc(admissionData.studentId)
        .get();
      const courseDoc = await db
        .collection("courses")
        .doc(admissionData.courseId)
        .get();

      admissions.push({
        admissionId: doc.id,
        ...admissionData,
        student: studentDoc.exists
          ? {
              name: studentDoc.data().profile?.name,
              email: studentDoc.data().email,
            }
          : null,
        course: courseDoc.exists
          ? {
              title: courseDoc.data().title,
            }
          : null,
      });
    }

    res.json({
      success: true,
      admissions: admissions,
      summary: {
        total: admissions.length,
        offered: admissions.filter(
          (a) => a.status === "offered" && !a.studentResponse
        ).length,
        accepted: admissions.filter((a) => a.studentResponse === "accepted")
          .length,
        declined: admissions.filter((a) => a.studentResponse === "declined")
          .length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getInstituteStats = async (req, res, next) => {
  try {
    const { uid } = req.user;

    // Get courses count
    const coursesSnapshot = await db
      .collection("courses")
      .where("institutionId", "==", uid)
      .get();

    const activeCourses = coursesSnapshot.docs.filter(
      (doc) => doc.data().isActive
    ).length;

    // Get applications count
    const applicationsSnapshot = await db
      .collection("applications")
      .where("institutionId", "==", uid)
      .get();

    const pendingApplications = applicationsSnapshot.docs.filter(
      (doc) => doc.data().status === "pending"
    ).length;
    const acceptedApplications = applicationsSnapshot.docs.filter(
      (doc) => doc.data().status === "accepted"
    ).length;

    // Get admissions count
    const admissionsSnapshot = await db
      .collection("admissions")
      .where("institutionId", "==", uid)
      .get();

    const confirmedAdmissions = admissionsSnapshot.docs.filter(
      (doc) => doc.data().studentResponse === "accepted"
    ).length;

    res.json({
      success: true,
      stats: {
        totalCourses: coursesSnapshot.size,
        activeCourses,
        totalApplications: applicationsSnapshot.size,
        pendingApplications,
        acceptedApplications,
        totalAdmissions: admissionsSnapshot.size,
        confirmedAdmissions,
      },
    });
  } catch (error) {
    next(error);
  }
};
