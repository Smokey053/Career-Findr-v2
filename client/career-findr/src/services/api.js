/**
 * @file This file configures and exports an Axios instance for making API requests.
 * It handles conditional backend API usage, authentication headers, and global error handling.
 */

import axios from "axios";

// Check if backend API is configured
const API_URL = import.meta.env.VITE_API_URL;
const USE_BACKEND_API = API_URL && API_URL.trim() !== "";

/**
 * Axios instance for API communication.
 * Initialized only if a backend API URL is provided in the environment variables.
 * @type {axios.AxiosInstance|null}
 */
const api = USE_BACKEND_API
  ? axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })
  : null;

/**
 * Checks if the backend API is configured.
 * Rejects the promise if the backend is not in use, allowing services to fall back to Firebase.
 * @returns {Promise<void>}
 */
const checkBackend = () => {
  if (!USE_BACKEND_API) {
    return Promise.reject({
      message: "Backend API not configured. Using Firebase directly.",
      noBackend: true,
    });
  }
  return Promise.resolve();
};

/**
 * Axios request interceptor to automatically attach the JWT token to requests.
 */
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

  /**
   * Axios response interceptor for global error handling.
   * Handles 401 Unauthorized errors by redirecting to the login page.
   */
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

/**
 * A collection of authentication-related API endpoints.
 * @namespace authAPI
 */
export const authAPI = {
  /**
   * Registers a new user.
   * @param {object} data - User registration data.
   * @returns {Promise<object>}
   */
  register: (data) =>
    checkBackend().then(() => api.post("/auth/register", data)),
  /**
   * Logs in a user.
   * @param {object} data - User login credentials.
   * @returns {Promise<object>}
   */
  login: (data) => checkBackend().then(() => api.post("/auth/login", data)),
  /**
   * Fetches the current authenticated user's profile.
   * @returns {Promise<object>}
   */
  getCurrentUser: () => checkBackend().then(() => api.get("/auth/me")),
  /**
   * Verifies a user's email address.
   * @param {string} token - The email verification token.
   * @returns {Promise<object>}
   */
  verifyEmail: (token) =>
    checkBackend().then(() => api.get(`/auth/verify-email?token=${token}`)),
  /**
   * Resends the email verification link.
   * @param {string} email - The user's email address.
   * @returns {Promise<object>}
   */
  resendVerification: (email) =>
    checkBackend().then(() => api.post("/auth/resend-verification", { email })),
  /**
   * Initiates the password reset process.
   * @param {string} email - The user's email address.
   * @returns {Promise<object>}
   */
  forgotPassword: (email) =>
    checkBackend().then(() => api.post("/auth/forgot-password", { email })),
  /**
   * Logs out the current user.
   * @returns {Promise<object>}
   */
  logout: () => checkBackend().then(() => api.post("/auth/logout")),
};

/**
 * A collection of API endpoints for student-related actions.
 * @namespace studentAPI
 */
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

/**
 * A collection of API endpoints for institute-related actions.
 * @namespace instituteAPI
 */
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

/**
 * A collection of API endpoints for company-related actions.
 * @namespace companyAPI
 */
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

/**
 * A collection of API endpoints for admin-related actions.
 * @namespace adminAPI
 */
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
