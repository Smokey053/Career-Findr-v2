/**
 * @file This file provides a comprehensive service for interacting with Firebase Storage.
 * It includes functions for uploading, deleting, and retrieving files, with specific helpers
 * for common use cases like resumes, profile images, and logos.
 */

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
 * A centralized object for Firebase Storage paths to ensure consistency.
 * @property {string} RESUMES - Path for storing user resumes.
 * @property {string} PROFILE_IMAGES - Path for user profile pictures.
 * @property {string} COURSE_MATERIALS - Path for materials related to courses.
 * @property {string} COMPANY_LOGOS - Path for company logos.
 * @property {string} INSTITUTE_LOGOS - Path for institute logos.
 * @property {string} JOB_ATTACHMENTS - Path for attachments to job postings.
 * @property {string} CHAT_ATTACHMENTS - Path for files sent in chats.
 * @property {string} DOCUMENTS - A general path for other documents.
 */
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
 * @param {string} path - The storage path where files should be uploaded.
 * @param {string} userId - User ID for organizing files.
 * @param {Function} [onProgress=null] - Optional callback for tracking upload progress.
 * @returns {Promise<{url: string, path: string, name: string, size: number, type: string}>} An object containing the file's URL and metadata.
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
 * @param {string} path - The storage path where files should be uploaded.
 * @param {string} userId - The ID of the user uploading the files.
 * @param {Function} [onProgress=null] - Optional callback for tracking total upload progress.
 * @returns {Promise<Array<{url: string, path: string, name: string, size: number, type: string}>>} An array of objects for each uploaded file.
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
 * @param {string} filePath - The full path to the file in Firebase Storage.
 * @returns {Promise<void>} A promise that resolves when the file is deleted.
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
 * @param {string} filePath - The full path to the file in Firebase Storage.
 * @returns {Promise<string>} A promise that resolves with the public download URL.
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
 * @param {string} filePath - The full path to the file in Firebase Storage.
 * @returns {Promise<import("firebase/storage").FullMetadata>} A promise that resolves with the file's metadata.
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
 * @param {string} path - The directory path in Firebase Storage.
 * @param {string} [userId=null] - Optional user ID to scope the listing to a user-specific folder.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of file metadata objects.
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
 * @param {File} file - The image file to upload.
 * @param {string} userId - The ID of the user.
 * @param {Function} [onProgress=null] - Optional progress callback.
 * @returns {Promise<object>} The uploaded file's metadata.
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
 * @param {File} file - The resume file (PDF or Word document).
 * @param {string} userId - The ID of the user.
 * @param {Function} [onProgress=null] - Optional progress callback.
 * @returns {Promise<object>} The uploaded file's metadata.
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
 * @param {File} file - The course material file.
 * @param {string} courseId - The ID of the course.
 * @param {string} userId - The ID of the user uploading the material.
 * @param {Function} [onProgress=null] - Optional progress callback.
 * @returns {Promise<object>} The uploaded file's metadata.
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
 * @param {File} file - The logo image file.
 * @param {string} entityId - The ID of the company or institute.
 * @param {string} [type="company"] - The type of entity ('company' or 'institute').
 * @param {Function} [onProgress=null] - Optional progress callback.
 * @returns {Promise<object>} The uploaded file's metadata.
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
 * @param {File} file - The attachment file.
 * @param {string} chatId - The ID of the chat.
 * @param {string} userId - The ID of the user sending the attachment.
 * @param {Function} [onProgress=null] - Optional progress callback.
 * @returns {Promise<object>} The uploaded file's metadata.
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
 * Formats a file size in bytes into a human-readable string (KB, MB, GB).
 * @param {number} bytes - The file size in bytes.
 * @returns {string} The formatted file size string.
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Extracts the file extension from a filename.
 * @param {string} filename - The full name of the file.
 * @returns {string} The file extension.
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

/**
 * Validates if a file's MIME type is in a list of allowed types.
 * @param {File} file - The file to validate.
 * @param {Array<string>} allowedTypes - An array of allowed MIME types (e.g., ['image/jpeg', 'image/png']).
 * @returns {boolean} True if the file type is allowed, false otherwise.
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
