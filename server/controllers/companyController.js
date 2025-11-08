import { db } from "../config/firebaseConfig.js";
import { validationResult } from "express-validator";

export const getCompanyProfile = async (req, res, next) => {
  try {
    const { uid } = req.user;

    const companyDoc = await db.collection("users").doc(uid).get();

    if (!companyDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const companyData = companyDoc.data();

    res.json({
      success: true,
      profile: {
        userId: companyData.userId,
        email: companyData.email,
        role: companyData.role,
        isApproved: companyData.isApproved,
        profile: companyData.profile,
        createdAt: companyData.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyProfile = async (req, res, next) => {
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

export const createJob = async (req, res, next) => {
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
      requirements,
      salary,
      location,
      type,
      positions,
      skills,
      experience,
    } = req.body;

    const jobId = `job_${uid}_${Date.now()}`;
    const jobData = {
      jobId,
      companyId: uid,
      title,
      description,
      requirements,
      salary: salary || { min: 0, max: 0, currency: "USD" },
      location,
      type, // full-time, part-time, contract, internship
      positions,
      skills: skills || [],
      experience: experience || "Entry level",
      status: "open",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      closingDate: req.body.closingDate || null,
    };

    await db.collection("jobs").doc(jobId).set(jobData);

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: jobData,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyJobs = async (req, res, next) => {
  try {
    const { uid } = req.user;

    const jobsSnapshot = await db
      .collection("jobs")
      .where("companyId", "==", uid)
      .get();

    const jobs = [];

    for (const doc of jobsSnapshot.docs) {
      const jobData = doc.data();

      // Get application count
      const applicationsSnapshot = await db
        .collection("jobApplications")
        .where("jobId", "==", doc.id)
        .get();

      jobs.push({
        jobId: doc.id,
        ...jobData,
        applicationCount: applicationsSnapshot.size,
        pendingApplications: applicationsSnapshot.docs.filter(
          (d) => d.data().status === "pending"
        ).length,
      });
    }

    // Sort by creation date (newest first)
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      jobs: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { jobId } = req.params;
    const updateData = req.body;

    const jobDoc = await db.collection("jobs").doc(jobId).get();

    if (!jobDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const jobData = jobDoc.data();

    // Verify ownership
    if (jobData.companyId !== uid) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own job postings",
      });
    }

    // Don't allow updating certain fields
    delete updateData.jobId;
    delete updateData.companyId;
    delete updateData.createdAt;

    await jobDoc.ref.update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Job updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const closeJob = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { jobId } = req.params;

    const jobDoc = await db.collection("jobs").doc(jobId).get();

    if (!jobDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const jobData = jobDoc.data();

    if (jobData.companyId !== uid) {
      return res.status(403).json({
        success: false,
        message: "You can only close your own job postings",
      });
    }

    await jobDoc.ref.update({
      status: "closed",
      isActive: false,
      closedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Job closed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getJobApplications = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { jobId } = req.params;
    const { status } = req.query;

    // Verify job ownership
    const jobDoc = await db.collection("jobs").doc(jobId).get();

    if (!jobDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (jobDoc.data().companyId !== uid) {
      return res.status(403).json({
        success: false,
        message: "You can only view applications for your own jobs",
      });
    }

    let applicationsQuery = db
      .collection("jobApplications")
      .where("jobId", "==", jobId);

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

      applications.push({
        jobApplicationId: doc.id,
        ...appData,
        student: studentDoc.exists
          ? {
              name: studentDoc.data().profile?.name,
              email: studentDoc.data().email,
              phone: studentDoc.data().profile?.phone,
              profile: studentDoc.data().profile,
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
        shortlisted: applications.filter((a) => a.status === "shortlisted")
          .length,
        accepted: applications.filter((a) => a.status === "accepted").length,
        rejected: applications.filter((a) => a.status === "rejected").length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const reviewJobApplication = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { applicationId } = req.params;
    const { status, remarks } = req.body;

    if (!["shortlisted", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be shortlisted, accepted, or rejected",
      });
    }

    const applicationDoc = await db
      .collection("jobApplications")
      .doc(applicationId)
      .get();

    if (!applicationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const applicationData = applicationDoc.data();

    // Verify job ownership
    const jobDoc = await db.collection("jobs").doc(applicationData.jobId).get();
    if (jobDoc.data().companyId !== uid) {
      return res.status(403).json({
        success: false,
        message: "You can only review applications for your own jobs",
      });
    }

    // Update application
    await applicationDoc.ref.update({
      status,
      remarks: remarks || "",
      reviewedAt: new Date().toISOString(),
      reviewedBy: uid,
    });

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

export const getCompanyStats = async (req, res, next) => {
  try {
    const { uid } = req.user;

    // Get jobs count
    const jobsSnapshot = await db
      .collection("jobs")
      .where("companyId", "==", uid)
      .get();

    const openJobs = jobsSnapshot.docs.filter(
      (doc) => doc.data().status === "open"
    ).length;

    // Get applications count
    const applicationsSnapshot = await db
      .collection("jobApplications")
      .where("companyId", "==", uid)
      .get();

    const pendingApplications = applicationsSnapshot.docs.filter(
      (doc) => doc.data().status === "pending"
    ).length;
    const shortlistedApplications = applicationsSnapshot.docs.filter(
      (doc) => doc.data().status === "shortlisted"
    ).length;
    const acceptedApplications = applicationsSnapshot.docs.filter(
      (doc) => doc.data().status === "accepted"
    ).length;

    res.json({
      success: true,
      stats: {
        totalJobs: jobsSnapshot.size,
        openJobs,
        closedJobs: jobsSnapshot.size - openJobs,
        totalApplications: applicationsSnapshot.size,
        pendingApplications,
        shortlistedApplications,
        acceptedApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const searchCandidates = async (req, res, next) => {
  try {
    const { skills, location, education } = req.query;

    // Get all students
    const studentsSnapshot = await db
      .collection("users")
      .where("role", "==", "student")
      .where("isVerified", "==", true)
      .get();

    let students = studentsSnapshot.docs.map((doc) => ({
      userId: doc.id,
      ...doc.data(),
    }));

    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim().toLowerCase());
      students = students.filter((student) => {
        const studentSkills = (student.profile?.skills || []).map((s) =>
          s.toLowerCase()
        );
        return skillsArray.some((skill) => studentSkills.includes(skill));
      });
    }

    // Filter by location
    if (location) {
      const locationLower = location.toLowerCase();
      students = students.filter((student) =>
        (student.profile?.location || "").toLowerCase().includes(locationLower)
      );
    }

    // Filter by education
    if (education) {
      const educationLower = education.toLowerCase();
      students = students.filter((student) => {
        const studentEducation = student.profile?.education || [];
        return studentEducation.some(
          (edu) =>
            (edu.degree || "").toLowerCase().includes(educationLower) ||
            (edu.field || "").toLowerCase().includes(educationLower)
        );
      });
    }

    // Return only safe profile info
    const candidates = students.map((student) => ({
      userId: student.userId,
      name: student.profile?.name,
      email: student.email,
      phone: student.profile?.phone,
      location: student.profile?.location,
      skills: student.profile?.skills,
      education: student.profile?.education,
      experience: student.profile?.experience,
    }));

    res.json({
      success: true,
      candidates: candidates,
      total: candidates.length,
    });
  } catch (error) {
    next(error);
  }
};
