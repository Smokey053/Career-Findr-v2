import { db } from "../config/firebaseConfig.js";
import { validationResult } from "express-validator";
import { sendApplicationStatusEmail } from "../utils/emailService.js";

export const getStudentProfile = async (req, res, next) => {
  try {
    const { uid } = req.user;

    const studentDoc = await db.collection("users").doc(uid).get();

    if (!studentDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const studentData = studentDoc.data();

    res.json({
      success: true,
      profile: {
        userId: studentData.userId,
        email: studentData.email,
        role: studentData.role,
        profile: studentData.profile,
        createdAt: studentData.createdAt,
        updatedAt: studentData.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudentProfile = async (req, res, next) => {
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

export const getAvailableCourses = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    let coursesQuery = db.collection("courses").where("isActive", "==", true);

    if (category) {
      coursesQuery = coursesQuery.where("category", "==", category);
    }

    const coursesSnapshot = await coursesQuery.get();
    let courses = [];

    for (const doc of coursesSnapshot.docs) {
      const courseData = doc.data();

      // Get institution details
      const institutionDoc = await db
        .collection("users")
        .doc(courseData.institutionId)
        .get();

      const institutionData = institutionDoc.exists
        ? institutionDoc.data()
        : null;

      // Calculate available seats
      const applicationsSnapshot = await db
        .collection("applications")
        .where("courseId", "==", doc.id)
        .where("status", "==", "accepted")
        .get();

      const availableSeats = courseData.seats - applicationsSnapshot.size;

      courses.push({
        courseId: doc.id,
        ...courseData,
        institution: {
          name: institutionData?.profile?.name || "Unknown",
          location: institutionData?.profile?.location || "N/A",
        },
        availableSeats: availableSeats,
      });
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      courses = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          course.category.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCourses = courses.slice(startIndex, endIndex);

    res.json({
      success: true,
      courses: paginatedCourses,
      pagination: {
        total: courses.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(courses.length / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const applyForCourse = async (req, res, next) => {
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
    const { courseId, institutionId, documents, additionalInfo } = req.body;

    // Check if course exists
    const courseDoc = await db.collection("courses").doc(courseId).get();
    if (!courseDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const courseData = courseDoc.data();

    // Check if course is active
    if (!courseData.isActive) {
      return res.status(400).json({
        success: false,
        message: "This course is no longer accepting applications",
      });
    }

    // Check available seats
    const acceptedAppsSnapshot = await db
      .collection("applications")
      .where("courseId", "==", courseId)
      .where("status", "==", "accepted")
      .get();

    if (acceptedAppsSnapshot.size >= courseData.seats) {
      return res.status(400).json({
        success: false,
        message: "No seats available for this course",
      });
    }

    // Check existing applications for this institution (max 2 per institution)
    const existingApps = await db
      .collection("applications")
      .where("studentId", "==", uid)
      .where("institutionId", "==", institutionId)
      .get();

    if (existingApps.size >= 2) {
      return res.status(400).json({
        success: false,
        message: "Maximum 2 applications per institution allowed",
      });
    }

    // Check if already applied to this course
    const existingCourseApp = existingApps.docs.find(
      (doc) => doc.data().courseId === courseId
    );

    if (existingCourseApp) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this course",
      });
    }

    // Create application
    const applicationId = `app_${uid}_${courseId}_${Date.now()}`;
    const application = {
      applicationId,
      studentId: uid,
      courseId,
      institutionId,
      status: "pending",
      appliedAt: new Date().toISOString(),
      documents: documents || [],
      additionalInfo: additionalInfo || "",
      reviewedAt: null,
      reviewedBy: null,
    };

    await db.collection("applications").doc(applicationId).set(application);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: {
        applicationId,
        courseTitle: courseData.title,
        status: "pending",
        appliedAt: application.appliedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentApplications = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { status } = req.query;

    let applicationsQuery = db
      .collection("applications")
      .where("studentId", "==", uid);

    if (status) {
      applicationsQuery = applicationsQuery.where("status", "==", status);
    }

    const applicationsSnapshot = await applicationsQuery.get();
    const applications = [];

    for (const doc of applicationsSnapshot.docs) {
      const appData = doc.data();
      const courseDoc = await db
        .collection("courses")
        .doc(appData.courseId)
        .get();
      const institutionDoc = await db
        .collection("users")
        .doc(appData.institutionId)
        .get();

      applications.push({
        ...appData,
        course: courseDoc.exists
          ? {
              courseId: courseDoc.id,
              ...courseDoc.data(),
            }
          : null,
        institution: institutionDoc.exists
          ? {
              name: institutionDoc.data().profile?.name,
              email: institutionDoc.data().email,
            }
          : null,
      });
    }

    // Sort by application date (newest first)
    applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

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

export const withdrawApplication = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { applicationId } = req.params;

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

    // Verify ownership
    if (applicationData.studentId !== uid) {
      return res.status(403).json({
        success: false,
        message: "You can only withdraw your own applications",
      });
    }

    // Only allow withdrawal of pending applications
    if (applicationData.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw ${applicationData.status} application`,
      });
    }

    await applicationDoc.ref.update({
      status: "withdrawn",
      withdrawnAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAdmissionResults = async (req, res, next) => {
  try {
    const { uid } = req.user;

    // Get all admissions for this student
    const admissionsSnapshot = await db
      .collection("admissions")
      .where("studentId", "==", uid)
      .get();

    const admissions = [];

    for (const doc of admissionsSnapshot.docs) {
      const admissionData = doc.data();
      const courseDoc = await db
        .collection("courses")
        .doc(admissionData.courseId)
        .get();
      const institutionDoc = await db
        .collection("users")
        .doc(admissionData.institutionId)
        .get();

      admissions.push({
        admissionId: doc.id,
        ...admissionData,
        course: courseDoc.exists ? courseDoc.data() : null,
        institution: institutionDoc.exists
          ? {
              name: institutionDoc.data().profile?.name,
              email: institutionDoc.data().email,
              contact: institutionDoc.data().profile?.phone,
            }
          : null,
      });
    }

    res.json({
      success: true,
      admissions: admissions,
      hasAcceptedAdmission: admissions.some(
        (a) => a.studentResponse === "accepted"
      ),
    });
  } catch (error) {
    next(error);
  }
};

export const acceptAdmissionOffer = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { admissionId, accept } = req.body;

    if (typeof accept !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Accept parameter must be true or false",
      });
    }

    // Check if student already accepted an admission
    const existingAcceptedSnapshot = await db
      .collection("admissions")
      .where("studentId", "==", uid)
      .where("studentResponse", "==", "accepted")
      .get();

    if (!existingAcceptedSnapshot.empty && accept) {
      return res.status(400).json({
        success: false,
        message: "You can only accept one admission offer",
      });
    }

    const admissionDoc = await db
      .collection("admissions")
      .doc(admissionId)
      .get();

    if (!admissionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    const admissionData = admissionDoc.data();

    if (admissionData.studentId !== uid) {
      return res.status(403).json({
        success: false,
        message: "This admission does not belong to you",
      });
    }

    if (admissionData.studentResponse) {
      return res.status(400).json({
        success: false,
        message: "You have already responded to this admission offer",
      });
    }

    await admissionDoc.ref.update({
      studentResponse: accept ? "accepted" : "declined",
      respondedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: accept
        ? "Admission offer accepted successfully"
        : "Admission offer declined",
    });
  } catch (error) {
    next(error);
  }
};

export const uploadTranscript = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { transcriptUrl, description, academicYear } = req.body;

    if (!transcriptUrl) {
      return res.status(400).json({
        success: false,
        message: "Transcript URL is required",
      });
    }

    const transcriptId = `transcript_${uid}_${Date.now()}`;
    const transcriptData = {
      transcriptId,
      studentId: uid,
      transcriptUrl,
      description: description || "Academic Transcript",
      academicYear: academicYear || "",
      uploadedAt: new Date().toISOString(),
      verified: false,
      verifiedBy: null,
      verifiedAt: null,
    };

    await db.collection("transcripts").doc(transcriptId).set(transcriptData);

    // Update student profile
    await db.collection("users").doc(uid).update({
      "profile.hasTranscript": true,
      "profile.latestTranscriptId": transcriptId,
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: "Transcript uploaded successfully",
      transcript: transcriptData,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentTranscripts = async (req, res, next) => {
  try {
    const { uid } = req.user;

    const transcriptsSnapshot = await db
      .collection("transcripts")
      .where("studentId", "==", uid)
      .get();

    const transcripts = transcriptsSnapshot.docs.map((doc) => ({
      transcriptId: doc.id,
      ...doc.data(),
    }));

    // Sort by upload date (newest first)
    transcripts.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.json({
      success: true,
      transcripts: transcripts,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableJobs = async (req, res, next) => {
  try {
    const { type, location, search, page = 1, limit = 20 } = req.query;

    let jobsQuery = db
      .collection("jobs")
      .where("isActive", "==", true)
      .where("status", "==", "open");

    if (type) {
      jobsQuery = jobsQuery.where("type", "==", type);
    }

    const jobsSnapshot = await jobsQuery.get();
    let jobs = [];

    for (const doc of jobsSnapshot.docs) {
      const jobData = doc.data();

      // Get company details
      const companyDoc = await db
        .collection("users")
        .doc(jobData.companyId)
        .get();

      const companyData = companyDoc.exists ? companyDoc.data() : null;

      // Count applications
      const applicationsSnapshot = await db
        .collection("jobApplications")
        .where("jobId", "==", doc.id)
        .get();

      jobs.push({
        jobId: doc.id,
        ...jobData,
        company: {
          name: companyData?.profile?.name || "Unknown",
          location: companyData?.profile?.location || "N/A",
          industry: companyData?.profile?.industry || "N/A",
        },
        applicationCount: applicationsSnapshot.size,
      });
    }

    // Location filter
    if (location) {
      const locationLower = location.toLowerCase();
      jobs = jobs.filter((job) =>
        job.location.toLowerCase().includes(locationLower)
      );
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.requirements.some((req) =>
            req.toLowerCase().includes(searchLower)
          )
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    res.json({
      success: true,
      jobs: paginatedJobs,
      pagination: {
        total: jobs.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(jobs.length / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const applyForJob = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { jobId, companyId, coverLetter, resume } = req.body;

    if (!jobId || !companyId) {
      return res.status(400).json({
        success: false,
        message: "Job ID and Company ID are required",
      });
    }

    // Check if job exists
    const jobDoc = await db.collection("jobs").doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const jobData = jobDoc.data();

    // Check if job is active
    if (!jobData.isActive || jobData.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      });
    }

    // Check if already applied
    const existingAppSnapshot = await db
      .collection("jobApplications")
      .where("studentId", "==", uid)
      .where("jobId", "==", jobId)
      .get();

    if (!existingAppSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    // Create job application
    const jobApplicationId = `jobapp_${uid}_${jobId}_${Date.now()}`;
    const jobApplication = {
      jobApplicationId,
      studentId: uid,
      jobId,
      companyId,
      coverLetter: coverLetter || "",
      resume: resume || "",
      status: "pending",
      appliedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
    };

    await db
      .collection("jobApplications")
      .doc(jobApplicationId)
      .set(jobApplication);

    res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      application: {
        jobApplicationId,
        jobTitle: jobData.title,
        companyName: jobData.company?.name,
        status: "pending",
        appliedAt: jobApplication.appliedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentJobApplications = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { status } = req.query;

    let applicationsQuery = db
      .collection("jobApplications")
      .where("studentId", "==", uid);

    if (status) {
      applicationsQuery = applicationsQuery.where("status", "==", status);
    }

    const applicationsSnapshot = await applicationsQuery.get();
    const applications = [];

    for (const doc of applicationsSnapshot.docs) {
      const appData = doc.data();
      const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
      const companyDoc = await db
        .collection("users")
        .doc(appData.companyId)
        .get();

      applications.push({
        ...appData,
        job: jobDoc.exists
          ? {
              jobId: jobDoc.id,
              ...jobDoc.data(),
            }
          : null,
        company: companyDoc.exists
          ? {
              name: companyDoc.data().profile?.name,
              email: companyDoc.data().email,
            }
          : null,
      });
    }

    // Sort by application date (newest first)
    applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

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
