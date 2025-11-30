import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// Submit a course application
export const submitCourseApplication = async (applicationData, studentId) => {
  try {
    const applicationsRef = collection(db, "applications");

    // Check if student already has 2 applications to this institution
    const existingAppsQuery = query(
      applicationsRef,
      where("studentId", "==", studentId),
      where("institutionId", "==", applicationData.institutionId),
      where("type", "==", "course")
    );

    const existingAppsSnapshot = await getDocs(existingAppsQuery);

    if (existingAppsSnapshot.size >= 2) {
      throw new Error(
        "You have already applied to 2 courses at this institution. Maximum 2 applications per institution allowed."
      );
    }

    // Create studentName from firstName and lastName if available
    let studentName = applicationData.studentName;
    if (!studentName && applicationData.firstName) {
      studentName = applicationData.lastName 
        ? `${applicationData.firstName} ${applicationData.lastName}`
        : applicationData.firstName;
    }

    const newApplication = {
      ...applicationData,
      studentId,
      studentName: studentName || "Student",
      studentEmail: applicationData.email || applicationData.studentEmail,
      type: "course",
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(applicationsRef, newApplication);
    return { id: docRef.id, ...newApplication };
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

// Submit a job application
export const submitJobApplication = async (applicationData, studentId) => {
  try {
    const applicationsRef = collection(db, "applications");

    // Check if already applied
    const existingAppQuery = query(
      applicationsRef,
      where("studentId", "==", studentId),
      where("jobId", "==", applicationData.jobId),
      where("type", "==", "job")
    );

    const existingSnapshot = await getDocs(existingAppQuery);
    if (!existingSnapshot.empty) {
      throw new Error("You have already applied to this job");
    }

    const newApplication = {
      ...applicationData,
      studentId,
      type: "job",
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(applicationsRef, newApplication);
    return { id: docRef.id, ...newApplication };
  } catch (error) {
    console.error("Error submitting job application:", error);
    throw error;
  }
};

// Get applications for a student
export const getStudentApplications = async (studentId) => {
  try {
    const applicationsRef = collection(db, "applications");
    const q = query(
      applicationsRef,
      where("studentId", "==", studentId),
      where("type", "==", "course"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });

    return applications;
  } catch (error) {
    console.error("Error getting student applications:", error);
    throw error;
  }
};

// Get job applications for a student
export const getStudentJobApplications = async (studentId) => {
  try {
    const applicationsRef = collection(db, "applications");
    const q = query(
      applicationsRef,
      where("studentId", "==", studentId),
      where("type", "==", "job"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });

    return applications;
  } catch (error) {
    console.error("Error getting student job applications:", error);
    throw error;
  }
};

// Withdraw an application (only pending applications can be withdrawn)
export const withdrawApplication = async (applicationId) => {
  try {
    const applicationRef = doc(db, "applications", applicationId);
    const appSnap = await getDoc(applicationRef);
    
    if (!appSnap.exists()) {
      throw new Error("Application not found");
    }
    
    const appData = appSnap.data();
    
    // Only allow withdrawing pending applications
    if (appData.status !== "pending") {
      throw new Error("Only pending applications can be withdrawn");
    }
    
    await deleteDoc(applicationRef);
    return { id: applicationId, withdrawn: true };
  } catch (error) {
    console.error("Error withdrawing application:", error);
    throw error;
  }
};

// Get applications for an institution
export const getInstitutionApplications = async (
  institutionId,
  filters = {}
) => {
  try {
    const applicationsRef = collection(db, "applications");
    const constraints = [
      where("institutionId", "==", institutionId),
      where("type", "==", "course"),
    ];

    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters.courseId) {
      constraints.push(where("courseId", "==", filters.courseId));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(applicationsRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });

    return applications;
  } catch (error) {
    console.error("Error getting institution applications:", error);
    throw error;
  }
};

// Get job applications for a company
export const getCompanyJobApplications = async (companyId, filters = {}) => {
  try {
    const applicationsRef = collection(db, "applications");
    const constraints = [
      where("companyId", "==", companyId),
      where("type", "==", "job"),
    ];

    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters.jobId) {
      constraints.push(where("jobId", "==", filters.jobId));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(applicationsRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });

    return applications;
  } catch (error) {
    console.error("Error getting company job applications:", error);
    throw error;
  }
};

// Helper function to create application status notification
const createApplicationStatusNotification = async (applicationData, status, applicationType) => {
  try {
    const notificationsRef = collection(db, "notifications");
    
    // Determine notification content based on status and type
    let title, message;
    const itemName = applicationType === "course" 
      ? applicationData.courseName || "Course"
      : applicationData.jobTitle || "Job";
    const orgName = applicationType === "course"
      ? applicationData.institutionName || "Institution"
      : applicationData.companyName || "Company";
    
    switch (status.toLowerCase()) {
      case "approved":
      case "accepted":
        title = `Application Accepted! 🎉`;
        message = `Congratulations! Your application for "${itemName}" at ${orgName} has been accepted.`;
        break;
      case "rejected":
        title = `Application Update`;
        message = `Your application for "${itemName}" at ${orgName} was not successful. Don't give up - keep applying!`;
        break;
      case "under review":
        title = `Application Under Review`;
        message = `Your application for "${itemName}" at ${orgName} is now being reviewed.`;
        break;
      case "interview":
        title = `Interview Scheduled! 📅`;
        message = `Great news! You've been selected for an interview for "${itemName}" at ${orgName}.`;
        break;
      case "shortlisted":
        title = `You've Been Shortlisted! ⭐`;
        message = `Exciting news! You've been shortlisted for "${itemName}" at ${orgName}.`;
        break;
      default:
        title = `Application Status Update`;
        message = `Your application for "${itemName}" at ${orgName} status has been updated to: ${status}.`;
    }
    
    const notification = {
      userId: applicationData.studentId,
      type: "application_status",
      title,
      message,
      applicationId: applicationData.id,
      applicationType,
      status,
      read: false,
      createdAt: serverTimestamp(),
    };
    
    await addDoc(notificationsRef, notification);
    console.log(`Created notification for student ${applicationData.studentId}`);
  } catch (error) {
    console.error("Error creating application status notification:", error);
    // Don't throw - we don't want to fail the status update
  }
};

// Update application status
export const updateApplicationStatus = async (
  applicationId,
  status,
  reason = null
) => {
  try {
    const applicationRef = doc(db, "applications", applicationId);
    
    // Get the application data first for notification
    const appSnap = await getDoc(applicationRef);
    const appData = appSnap.exists() ? { id: applicationId, ...appSnap.data() } : null;
    
    if (!appData) {
      throw new Error("Application not found");
    }
    
    // If approving a course application, check if institution already approved another application from this student
    if (status === "approved" && appData.type === "course") {
      const applicationsRef = collection(db, "applications");
      const approvedQuery = query(
        applicationsRef,
        where("studentId", "==", appData.studentId),
        where("institutionId", "==", appData.institutionId),
        where("type", "==", "course"),
        where("status", "==", "approved")
      );
      
      const approvedSnapshot = await getDocs(approvedQuery);
      
      if (!approvedSnapshot.empty) {
        throw new Error("This student already has an approved application at your institution. Only one application per student can be accepted.");
      }
    }
    
    const updatedData = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (reason) {
      updatedData.statusReason = reason;
    }

    // If approved, create admission record
    if (status === "approved" && appData) {
      await createAdmission(applicationId, appData);
    }

    await updateDoc(applicationRef, updatedData);
    
    // Create notification for the student
    if (appData && appData.studentId) {
      await createApplicationStatusNotification(appData, status, appData.type || "course");
    }
    
    return { id: applicationId, ...updatedData };
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};

// Create admission record
const createAdmission = async (applicationId, applicationData) => {
  try {
    const admissionsRef = collection(db, "admissions");
    const newAdmission = {
      applicationId,
      studentId: applicationData.studentId,
      institutionId: applicationData.institutionId,
      courseId: applicationData.courseId,
      status: "pending", // student needs to accept/decline
      createdAt: serverTimestamp(),
    };

    await addDoc(admissionsRef, newAdmission);
  } catch (error) {
    console.error("Error creating admission:", error);
    throw error;
  }
};

// Get admissions for a student
export const getStudentAdmissions = async (studentId) => {
  try {
    const admissionsRef = collection(db, "admissions");
    const q = query(
      admissionsRef,
      where("studentId", "==", studentId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const admissions = [];
    querySnapshot.forEach((doc) => {
      admissions.push({ id: doc.id, ...doc.data() });
    });

    return admissions;
  } catch (error) {
    console.error("Error getting student admissions:", error);
    throw error;
  }
};

// Get admissions for an institution
export const getInstitutionAdmissions = async (institutionId) => {
  try {
    const admissionsRef = collection(db, "admissions");
    const q = query(admissionsRef, where("institutionId", "==", institutionId));

    const querySnapshot = await getDocs(q);
    const admissions = [];

    for (const docSnap of querySnapshot.docs) {
      const admissionData = docSnap.data();
      const [studentSnap, courseSnap] = await Promise.all([
        getDoc(doc(db, "users", admissionData.studentId)),
        getDoc(doc(db, "courses", admissionData.courseId)),
      ]);

      admissions.push({
        id: docSnap.id,
        ...admissionData,
        studentName: studentSnap.exists()
          ? studentSnap.data().name || studentSnap.data().profile?.name
          : "Unknown",
        studentEmail: studentSnap.exists() ? studentSnap.data().email : "",
        courseName: courseSnap.exists() ? courseSnap.data().name : "Course",
      });
    }

    // Sort by createdAt in JavaScript
    admissions.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    return admissions;
  } catch (error) {
    console.error("Error getting institution admissions:", error);
    throw error;
  }
};

// Accept admission - only one course admission can be accepted
export const acceptAdmission = async (admissionId) => {
  try {
    const admissionRef = doc(db, "admissions", admissionId);
    const admissionSnap = await getDoc(admissionRef);
    
    if (!admissionSnap.exists()) {
      throw new Error("Admission not found");
    }
    
    const admissionData = admissionSnap.data();
    const studentId = admissionData.studentId;
    
    // Check if student already has an accepted admission
    const admissionsRef = collection(db, "admissions");
    const acceptedQuery = query(
      admissionsRef,
      where("studentId", "==", studentId),
      where("status", "==", "accepted")
    );
    
    const acceptedSnapshot = await getDocs(acceptedQuery);
    
    if (!acceptedSnapshot.empty) {
      throw new Error("You have already accepted an admission offer. Only one course admission can be accepted.");
    }
    
    // Accept this admission
    await updateDoc(admissionRef, {
      status: "accepted",
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Automatically decline all other pending admissions for this student
    const pendingQuery = query(
      admissionsRef,
      where("studentId", "==", studentId),
      where("status", "==", "pending")
    );
    
    const pendingSnapshot = await getDocs(pendingQuery);
    const declinePromises = [];
    
    pendingSnapshot.forEach((docSnap) => {
      if (docSnap.id !== admissionId) {
        declinePromises.push(
          updateDoc(doc(db, "admissions", docSnap.id), {
            status: "auto-declined",
            declineReason: "Another admission offer was accepted",
            updatedAt: serverTimestamp(),
          })
        );
      }
    });
    
    await Promise.all(declinePromises);
    
    return { success: true, autoDeclined: declinePromises.length };
  } catch (error) {
    console.error("Error accepting admission:", error);
    throw error;
  }
};

// Decline admission
export const declineAdmission = async (admissionId) => {
  try {
    const admissionRef = doc(db, "admissions", admissionId);
    await updateDoc(admissionRef, {
      status: "declined",
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error declining admission:", error);
    throw error;
  }
};
