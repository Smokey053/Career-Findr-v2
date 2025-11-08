import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
} from "firebase/storage";
import { storage } from "../config/firebase";

/**
 * Firebase Storage Service
 * Handles all file upload, download, and management operations
 */

// Storage paths
export const STORAGE_PATHS = {
  RESUMES: "resumes",
  PROFILE_IMAGES: "profile-images",
  COURSE_MATERIALS: "course-materials",
  COMPANY_LOGOS: "company-logos",
  INSTITUTE_LOGOS: "institute-logos",
  JOB_ATTACHMENTS: "job-attachments",
  CHAT_ATTACHMENTS: "chat-attachments",
  DOCUMENTS: "documents",
};

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (use STORAGE_PATHS)
 * @param {string} userId - User ID for organizing files
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<{url: string, path: string, name: string}>}
 */
export const uploadFile = async (file, path, userId, onProgress = null) => {
  if (!file) throw new Error("No file provided");

  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${userId}_${timestamp}_${sanitizedFileName}`;
  const filePath = `${path}/${userId}/${fileName}`;
  const storageRef = ref(storage, filePath);

  try {
    if (onProgress) {
      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url,
              path: filePath,
              name: file.name,
              size: file.size,
              type: file.type,
            });
          }
        );
      });
    } else {
      // Simple upload without progress
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      return {
        url,
        path: filePath,
        name: file.name,
        size: file.size,
        type: file.type,
      };
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Upload multiple files
 * @param {FileList} files - Files to upload
 * @param {string} path - Storage path
 * @param {string} userId - User ID
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<Array>}
 */
export const uploadMultipleFiles = async (
  files,
  path,
  userId,
  onProgress = null
) => {
  const fileArray = Array.from(files);
  const uploadPromises = fileArray.map((file, index) =>
    uploadFile(file, path, userId, (progress) => {
      if (onProgress) {
        const totalProgress =
          ((index + progress / 100) / fileArray.length) * 100;
        onProgress(totalProgress);
      }
    })
  );

  return Promise.all(uploadPromises);
};

/**
 * Delete a file from Firebase Storage
 * @param {string} filePath - Full path to the file in storage
 * @returns {Promise<void>}
 */
export const deleteFile = async (filePath) => {
  if (!filePath) throw new Error("No file path provided");

  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    console.log("File deleted successfully:", filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

/**
 * Get file download URL from storage path
 * @param {string} filePath - Full path to the file in storage
 * @returns {Promise<string>}
 */
export const getFileURL = async (filePath) => {
  if (!filePath) throw new Error("No file path provided");

  try {
    const fileRef = ref(storage, filePath);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw error;
  }
};

/**
 * Get file metadata
 * @param {string} filePath - Full path to the file in storage
 * @returns {Promise<Object>}
 */
export const getFileMetadata = async (filePath) => {
  if (!filePath) throw new Error("No file path provided");

  try {
    const fileRef = ref(storage, filePath);
    return await getMetadata(fileRef);
  } catch (error) {
    console.error("Error getting file metadata:", error);
    throw error;
  }
};

/**
 * List all files in a directory
 * @param {string} path - Directory path
 * @param {string} userId - User ID (optional)
 * @returns {Promise<Array>}
 */
export const listFiles = async (path, userId = null) => {
  const dirPath = userId ? `${path}/${userId}` : path;
  const listRef = ref(storage, dirPath);

  try {
    const result = await listAll(listRef);
    const filesPromises = result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      const metadata = await getMetadata(itemRef);
      return {
        name: itemRef.name,
        path: itemRef.fullPath,
        url,
        size: metadata.size,
        contentType: metadata.contentType,
        created: metadata.timeCreated,
        updated: metadata.updated,
      };
    });

    return Promise.all(filesPromises);
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};

/**
 * Upload profile image with automatic resizing
 * @param {File} file - Image file
 * @param {string} userId - User ID
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadProfileImage = async (file, userId, onProgress = null) => {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size must be less than 5MB");
  }

  return uploadFile(file, STORAGE_PATHS.PROFILE_IMAGES, userId, onProgress);
};

/**
 * Upload resume/CV
 * @param {File} file - Resume file (PDF)
 * @param {string} userId - User ID
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadResume = async (file, userId, onProgress = null) => {
  // Validate file type
  const validTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!validTypes.includes(file.type)) {
    throw new Error("Resume must be PDF or Word document");
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size must be less than 10MB");
  }

  return uploadFile(file, STORAGE_PATHS.RESUMES, userId, onProgress);
};

/**
 * Upload course material
 * @param {File} file - Course material file
 * @param {string} courseId - Course ID
 * @param {string} userId - User ID
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadCourseMaterial = async (
  file,
  courseId,
  userId,
  onProgress = null
) => {
  const filePath = `${STORAGE_PATHS.COURSE_MATERIALS}/${courseId}`;
  return uploadFile(file, filePath, userId, onProgress);
};

/**
 * Upload company/institute logo
 * @param {File} file - Logo image file
 * @param {string} entityId - Company or Institute ID
 * @param {string} type - 'company' or 'institute'
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadLogo = async (
  file,
  entityId,
  type = "company",
  onProgress = null
) => {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Logo must be an image");
  }

  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Logo size must be less than 2MB");
  }

  const path =
    type === "company"
      ? STORAGE_PATHS.COMPANY_LOGOS
      : STORAGE_PATHS.INSTITUTE_LOGOS;
  return uploadFile(file, path, entityId, onProgress);
};

/**
 * Upload chat attachment
 * @param {File} file - Attachment file
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadChatAttachment = async (
  file,
  chatId,
  userId,
  onProgress = null
) => {
  // Validate file size (max 25MB)
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size must be less than 25MB");
  }

  const filePath = `${STORAGE_PATHS.CHAT_ATTACHMENTS}/${chatId}`;
  return uploadFile(file, filePath, userId, onProgress);
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} Extension
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @returns {boolean}
 */
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export default {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFileURL,
  getFileMetadata,
  listFiles,
  uploadProfileImage,
  uploadResume,
  uploadCourseMaterial,
  uploadLogo,
  uploadChatAttachment,
  formatFileSize,
  getFileExtension,
  validateFileType,
  STORAGE_PATHS,
};
