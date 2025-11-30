import { db } from "../config/firebase";
import {
  collection,
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

// Get all users (for admin)
export const getUsers = async (filters = {}) => {
  try {
    const usersRef = collection(db, "users");
    const constraints = [];

    // Add filters
    if (filters.role) {
      constraints.push(where("role", "==", filters.role));
    }
    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }

    const q =
      constraints.length > 0
        ? query(usersRef, ...constraints)
        : query(usersRef);

    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

// Get a single user
export const getUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// Update basic user profile details
export const updateUserProfile = async (userId, updates = {}) => {
  if (!userId) {
    throw new Error("User ID is required to update profile");
  }

  if (!updates || Object.keys(updates).length === 0) {
    throw new Error("No profile fields provided for update");
  }

  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { id: userId, ...updates };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Update user status
export const updateUserStatus = async (userId, status) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { id: userId, status };
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role,
      updatedAt: serverTimestamp(),
    });
    return { id: userId, role };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// Approve user (for admin)
export const approveUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status: "active",
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: userId, status: "active" };
  } catch (error) {
    console.error("Error approving user:", error);
    throw error;
  }
};

// Reject user (for admin)
export const rejectUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status: "rejected",
      rejectedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: userId, status: "rejected" };
  } catch (error) {
    console.error("Error rejecting user:", error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Get platform statistics (for admin dashboard)
export const getPlatformStats = async (timeRange = '30days') => {
  try {
    const stats = {
      totalUsers: 0,
      totalCourses: 0,
      totalJobs: 0,
      totalApplications: 0,
      totalAdmissions: 0,
      activeUsers: 0,
      totalInstitutions: 0,
      activeInstitutions: 0,
      totalCompanies: 0,
      activeCompanies: 0,
      usersByRole: {
        student: 0,
        institution: 0,
        company: 0,
        admin: 0,
      },
      applicationsByStatus: {
        pending: 0,
        approved: 0,
        rejected: 0,
        interviewing: 0,
        shortlisted: 0,
      },
      recentActivity: [],
      userGrowth: [],
      topInstitutes: [],
      topCompanies: [],
    };

    // Calculate date range based on timeRange parameter
    const now = new Date();
    let startDate = new Date();
    let dateFormat = 'short';
    
    switch (timeRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        dateFormat = 'month';
        break;
      case 'all':
        startDate = new Date(2020, 0, 1); // Start from 2020
        dateFormat = 'month';
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Track users by date for growth chart
    const usersByDate = {};
    const studentsByDate = {};
    const institutesByDate = {};
    const companiesByDate = {};

    // Count users
    const usersSnapshot = await getDocs(collection(db, "users"));
    stats.totalUsers = usersSnapshot.size;
    
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      const role = data.role;
      const status = (data.status || "").toLowerCase();
      
      // Count by role
      if (role === 'institute') {
        stats.usersByRole.institution = (stats.usersByRole.institution || 0) + 1;
        stats.totalInstitutions++;
        if (status === "active") {
          stats.activeInstitutions++;
        }
      } else if (stats.usersByRole[role] !== undefined) {
        stats.usersByRole[role]++;
      }
      
      if (status === "active") {
        stats.activeUsers++;
      }
      
      if (role === "company") {
        stats.totalCompanies++;
        if (status === "active") {
          stats.activeCompanies++;
        }
      }

      // Track user creation dates for growth chart
      let createdAt = data.createdAt;
      if (createdAt) {
        // Handle Firestore Timestamp
        if (typeof createdAt.toDate === 'function') {
          createdAt = createdAt.toDate();
        } else if (typeof createdAt === 'string') {
          createdAt = new Date(createdAt);
        } else if (createdAt.seconds) {
          createdAt = new Date(createdAt.seconds * 1000);
        }

        if (createdAt instanceof Date && !isNaN(createdAt.getTime())) {
          const dateKey = dateFormat === 'month' 
            ? `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`
            : createdAt.toISOString().split('T')[0];
          
          usersByDate[dateKey] = (usersByDate[dateKey] || 0) + 1;
          
          if (role === 'student') {
            studentsByDate[dateKey] = (studentsByDate[dateKey] || 0) + 1;
          } else if (role === 'institute') {
            institutesByDate[dateKey] = (institutesByDate[dateKey] || 0) + 1;
          } else if (role === 'company') {
            companiesByDate[dateKey] = (companiesByDate[dateKey] || 0) + 1;
          }
        }
      }
    });

    // Generate user growth data points
    const allDates = new Set([
      ...Object.keys(usersByDate),
      ...Object.keys(studentsByDate),
      ...Object.keys(institutesByDate),
      ...Object.keys(companiesByDate)
    ]);
    
    // Sort dates and convert to growth chart data
    const sortedDates = Array.from(allDates).sort();
    
    // Calculate cumulative totals
    let cumulativeStudents = 0;
    let cumulativeInstitutes = 0;
    let cumulativeCompanies = 0;
    
    stats.userGrowth = sortedDates.map(date => {
      cumulativeStudents += studentsByDate[date] || 0;
      cumulativeInstitutes += institutesByDate[date] || 0;
      cumulativeCompanies += companiesByDate[date] || 0;
      
      // Format date for display
      let displayDate = date;
      if (dateFormat === 'month') {
        const [year, month] = date.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        displayDate = `${monthNames[parseInt(month) - 1]} ${year}`;
      } else {
        const d = new Date(date);
        displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      return {
        date: displayDate,
        students: cumulativeStudents,
        institutes: cumulativeInstitutes,
        companies: cumulativeCompanies,
        total: cumulativeStudents + cumulativeInstitutes + cumulativeCompanies,
      };
    });

    // If no growth data, generate sample data points
    if (stats.userGrowth.length === 0) {
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        stats.userGrowth.push({
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          students: stats.usersByRole.student || 0,
          institutes: stats.usersByRole.institution || 0,
          companies: stats.usersByRole.company || 0,
          total: stats.totalUsers || 0,
        });
      }
    }

    // Count courses
    const coursesSnapshot = await getDocs(collection(db, "courses"));
    stats.totalCourses = coursesSnapshot.size;

    // Count jobs
    const jobsSnapshot = await getDocs(collection(db, "jobs"));
    stats.totalJobs = jobsSnapshot.size;

    // Count applications
    const applicationsSnapshot = await getDocs(collection(db, "applications"));
    stats.totalApplications = applicationsSnapshot.size;
    applicationsSnapshot.forEach((doc) => {
      const data = doc.data();
      const status = (data.status || "").toLowerCase();
      if (stats.applicationsByStatus[status] !== undefined) {
        stats.applicationsByStatus[status]++;
      }
    });

    // Count admissions
    const admissionsSnapshot = await getDocs(collection(db, "admissions"));
    stats.totalAdmissions = admissionsSnapshot.size;

    // Generate top institutes (based on courses count)
    const instituteCourses = {};
    coursesSnapshot.forEach((doc) => {
      const data = doc.data();
      const instId = data.institutionId || data.instituteId;
      const instName = data.institutionName || data.instituteName || 'Unknown';
      if (instId) {
        if (!instituteCourses[instId]) {
          instituteCourses[instId] = { id: instId, name: instName, courses: 0, students: 0 };
        }
        instituteCourses[instId].courses++;
      }
    });
    stats.topInstitutes = Object.values(instituteCourses)
      .sort((a, b) => b.courses - a.courses)
      .slice(0, 5);

    // Generate top companies (based on jobs count)
    const companyJobs = {};
    jobsSnapshot.forEach((doc) => {
      const data = doc.data();
      const compId = data.companyId;
      const compName = data.companyName || 'Unknown';
      if (compId) {
        if (!companyJobs[compId]) {
          companyJobs[compId] = { id: compId, name: compName, jobs: 0, applicants: 0 };
        }
        companyJobs[compId].jobs++;
      }
    });
    
    // Count applicants per company
    applicationsSnapshot.forEach((doc) => {
      const data = doc.data();
      const compId = data.companyId;
      if (compId && companyJobs[compId]) {
        companyJobs[compId].applicants++;
      }
    });
    
    stats.topCompanies = Object.values(companyJobs)
      .sort((a, b) => b.jobs - a.jobs)
      .slice(0, 5);

    // Generate recent activity
    const recentUsers = [];
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt) {
        let createdAt = data.createdAt;
        if (typeof createdAt.toDate === 'function') {
          createdAt = createdAt.toDate();
        } else if (createdAt.seconds) {
          createdAt = new Date(createdAt.seconds * 1000);
        } else {
          createdAt = new Date(createdAt);
        }
        recentUsers.push({
          type: 'user',
          message: `New ${data.role} registered: ${data.profile?.name || data.email || 'Unknown'}`,
          time: getRelativeTime(createdAt),
          timestamp: createdAt,
        });
      }
    });
    
    stats.recentActivity = recentUsers
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    return stats;
  } catch (error) {
    console.error("Error getting platform stats:", error);
    throw error;
  }
};

// Helper function to get relative time
const getRelativeTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

// Search candidates (for companies)
export const searchCandidates = async (filters = {}) => {
  try {
    const usersRef = collection(db, "users");
    const constraints = [where("role", "==", "student")];

    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }

    const q = query(usersRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const candidates = [];
    querySnapshot.forEach((doc) => {
      const userData = { id: doc.id, ...doc.data() };

      // Client-side filtering for search terms
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          userData.name?.toLowerCase().includes(searchLower) ||
          userData.email?.toLowerCase().includes(searchLower) ||
          userData.skills?.some((skill) =>
            skill.toLowerCase().includes(searchLower)
          )
        ) {
          candidates.push(userData);
        }
      } else {
        candidates.push(userData);
      }
    });

    return candidates;
  } catch (error) {
    console.error("Error searching candidates:", error);
    throw error;
  }
};
