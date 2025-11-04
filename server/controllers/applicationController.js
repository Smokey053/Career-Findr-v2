import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Apply for a job
 * @route POST /api/applications
 * @access Private (Jobseeker only)
 */
export const applyForJob = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { jobId, coverLetter, resume } = req.body;

  // Verify user is a jobseeker
  const user = await User.getById(uid);
  if (user.role !== 'jobseeker') {
    return res.status(403).json({
      success: false,
      message: 'Only jobseekers can apply for jobs',
    });
  }

  // Check if job exists
  const job = await Job.getById(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  if (!job.isActive) {
    return res.status(400).json({
      success: false,
      message: 'This job is no longer accepting applications',
    });
  }

  // Check if already applied
  const alreadyApplied = await Application.checkExisting(jobId, uid);
  if (alreadyApplied) {
    return res.status(400).json({
      success: false,
      message: 'You have already applied for this job',
    });
  }

  // Create application
  const application = await Application.create({
    jobId,
    jobseekerId: uid,
    employerId: job.employerId,
    coverLetter,
    resume: resume || user.resume,
  });

  // Increment job application count
  await Job.incrementApplications(jobId);

  // Add to user's applied jobs
  await User.update(uid, {
    appliedJobs: [...user.appliedJobs, jobId],
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: { application },
  });
});

/**
 * Get all applications (for admin)
 * @route GET /api/applications
 * @access Private (Admin only)
 */
export const getAllApplications = asyncHandler(async (req, res) => {
  const { role } = req.user;
  
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const { page = 1, limit = 10 } = req.query;
  // This would need to be implemented in the Application model
  
  res.status(200).json({
    success: true,
    message: 'Feature not yet implemented',
  });
});

/**
 * Get my applications (jobseeker)
 * @route GET /api/applications/my-applications
 * @access Private (Jobseeker only)
 */
export const getMyApplications = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { page = 1, limit = 10 } = req.query;

  const applications = await Application.getByJobseeker(uid, parseInt(page), parseInt(limit));

  // Fetch job details for each application
  const applicationsWithJobDetails = await Promise.all(
    applications.map(async (app) => {
      const job = await Job.getById(app.jobId);
      return {
        ...app,
        jobDetails: job,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: applications.length,
    data: { applications: applicationsWithJobDetails },
  });
});

/**
 * Get applications for my jobs (employer)
 * @route GET /api/applications/received
 * @access Private (Employer only)
 */
export const getReceivedApplications = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { page = 1, limit = 10, jobId } = req.query;

  let applications;
  
  if (jobId) {
    // Get applications for a specific job
    const job = await Job.getById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.employerId !== uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job',
      });
    }

    applications = await Application.getByJob(jobId, parseInt(page), parseInt(limit));
  } else {
    // Get all applications for employer's jobs
    applications = await Application.getByEmployer(uid, parseInt(page), parseInt(limit));
  }

  // Fetch applicant details for each application
  const applicationsWithDetails = await Promise.all(
    applications.map(async (app) => {
      const [job, applicant] = await Promise.all([
        Job.getById(app.jobId),
        User.getById(app.jobseekerId),
      ]);
      
      return {
        ...app,
        jobDetails: job,
        applicantDetails: {
          uid: applicant.uid,
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          email: applicant.email,
          profileImage: applicant.profileImage,
          skills: applicant.skills,
          experience: applicant.experience,
          education: applicant.education,
        },
      };
    })
  );

  res.status(200).json({
    success: true,
    count: applications.length,
    data: { applications: applicationsWithDetails },
  });
});

/**
 * Get single application by ID
 * @route GET /api/applications/:id
 * @access Private
 */
export const getApplicationById = asyncHandler(async (req, res) => {
  const { uid, role } = req.user;
  const application = await Application.getById(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found',
    });
  }

  // Check authorization
  if (
    application.jobseekerId !== uid &&
    application.employerId !== uid &&
    role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this application',
    });
  }

  // Fetch additional details
  const [job, applicant] = await Promise.all([
    Job.getById(application.jobId),
    User.getById(application.jobseekerId),
  ]);

  res.status(200).json({
    success: true,
    data: {
      application: {
        ...application,
        jobDetails: job,
        applicantDetails: {
          uid: applicant.uid,
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          email: applicant.email,
          profileImage: applicant.profileImage,
          skills: applicant.skills,
          experience: applicant.experience,
          education: applicant.education,
        },
      },
    },
  });
});

/**
 * Update application status (employer)
 * @route PUT /api/applications/:id/status
 * @access Private (Employer only)
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { status, notes } = req.body;
  const application = await Application.getById(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found',
    });
  }

  // Verify employer owns the job
  if (application.employerId !== uid) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this application',
    });
  }

  const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status',
    });
  }

  const updatedApplication = await Application.updateStatus(
    req.params.id,
    status,
    notes
  );

  res.status(200).json({
    success: true,
    message: 'Application status updated successfully',
    data: { application: updatedApplication },
  });
});

/**
 * Withdraw application (jobseeker)
 * @route DELETE /api/applications/:id
 * @access Private (Jobseeker only)
 */
export const withdrawApplication = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const application = await Application.getById(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found',
    });
  }

  // Verify user is the applicant
  if (application.jobseekerId !== uid) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to withdraw this application',
    });
  }

  await Application.delete(req.params.id);

  // Remove from user's applied jobs
  const user = await User.getById(uid);
  await User.update(uid, {
    appliedJobs: user.appliedJobs.filter(id => id !== application.jobId),
  });

  res.status(200).json({
    success: true,
    message: 'Application withdrawn successfully',
  });
});

/**
 * Get application statistics (employer)
 * @route GET /api/applications/stats
 * @access Private (Employer only)
 */
export const getApplicationStats = asyncHandler(async (req, res) => {
  const { uid } = req.user;

  const stats = await Application.getStats(uid);

  res.status(200).json({
    success: true,
    data: { stats },
  });
});

export default {
  applyForJob,
  getAllApplications,
  getMyApplications,
  getReceivedApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats,
};
