import axios from "axios";

// Check if backend API is configured
const API_URL = import.meta.env.VITE_API_URL;
const USE_BACKEND_API = API_URL && API_URL.trim() !== "";

// Create axios instance with base configuration (only if backend is enabled)
const api = USE_BACKEND_API
  ? axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })
  : null;

// Helper function to check if backend is available
const checkBackend = () => {
  if (!USE_BACKEND_API) {
    return Promise.reject({
      message: "Backend API not configured. Using Firebase directly.",
      noBackend: true,
    });
  }
  return Promise.resolve();
};

// Request interceptor to add auth token (only if using backend)
if (USE_BACKEND_API && api) {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  api.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      // Handle 401 Unauthorized - redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      return Promise.reject({
        message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  );
}

// Auth API
export const authAPI = {
  register: (data) =>
    checkBackend().then(() => api.post("/auth/register", data)),
  login: (data) => checkBackend().then(() => api.post("/auth/login", data)),
  getCurrentUser: () => checkBackend().then(() => api.get("/auth/me")),
  verifyEmail: (token) =>
    checkBackend().then(() => api.get(`/auth/verify-email?token=${token}`)),
  resendVerification: (email) =>
    checkBackend().then(() => api.post("/auth/resend-verification", { email })),
  forgotPassword: (email) =>
    checkBackend().then(() => api.post("/auth/forgot-password", { email })),
  logout: () => checkBackend().then(() => api.post("/auth/logout")),
};

// Student API
export const studentAPI = {
  getProfile: () => api.get("/students/profile"),
  updateProfile: (data) => api.put("/students/profile", data),
  getCourses: (params) => api.get("/students/courses", { params }),
  applyForCourse: (data) => api.post("/students/courses/apply", data),
  getApplications: () => api.get("/students/applications"),
  withdrawApplication: (id) => api.delete(`/students/applications/${id}`),
  getAdmissions: () => api.get("/students/admissions"),
  acceptAdmission: (data) => api.post("/students/admissions/accept", data),
  uploadTranscript: (data) => api.post("/students/transcripts", data),
  getTranscripts: () => api.get("/students/transcripts"),
  getJobs: (params) => api.get("/students/jobs", { params }),
  applyForJob: (data) => api.post("/students/jobs/apply", data),
  getJobApplications: () => api.get("/students/job-applications"),
};

// Institute API
export const instituteAPI = {
  getProfile: () => api.get("/institutes/profile"),
  updateProfile: (data) => api.put("/institutes/profile", data),
  createCourse: (data) => api.post("/institutes/courses", data),
  getCourses: () => api.get("/institutes/courses"),
  updateCourse: (id, data) => api.put(`/institutes/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/institutes/courses/${id}`),
  getCourseApplications: (courseId, params) =>
    api.get(`/institutes/courses/${courseId}/applications`, { params }),
  reviewApplication: (id, data) =>
    api.put(`/institutes/applications/${id}/review`, data),
  createAdmissions: (data) => api.post("/institutes/admissions", data),
  getAdmissions: () => api.get("/institutes/admissions"),
  getStats: () => api.get("/institutes/stats"),
};

// Company API
export const companyAPI = {
  getProfile: () => api.get("/companies/profile"),
  updateProfile: (data) => api.put("/companies/profile", data),
  createJob: (data) => api.post("/companies/jobs", data),
  getJobs: () => api.get("/companies/jobs"),
  updateJob: (id, data) => api.put(`/companies/jobs/${id}`, data),
  closeJob: (id) => api.post(`/companies/jobs/${id}/close`),
  getJobApplications: (jobId, params) =>
    api.get(`/companies/jobs/${jobId}/applications`, { params }),
  reviewJobApplication: (id, data) =>
    api.put(`/companies/applications/${id}/review`, data),
  searchCandidates: (params) =>
    api.get("/companies/candidates/search", { params }),
  getStats: () => api.get("/companies/stats"),
};

// Admin API
export const adminAPI = {
  getUsers: (params) => api.get("/admin/users", { params }),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id, params) => api.delete(`/admin/users/${id}`, { params }),
  getPendingApprovals: (params) =>
    api.get("/admin/approvals/pending", { params }),
  approveUser: (id, data) => api.put(`/admin/approvals/${id}`, data),
  verifyTranscript: (id, data) =>
    api.put(`/admin/transcripts/${id}/verify`, data),
  getStats: () => api.get("/admin/stats"),
  getActivities: (params) => api.get("/admin/activities", { params }),
};

export default api;
