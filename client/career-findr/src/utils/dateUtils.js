/**
 * Utility functions for handling dates, especially Firestore Timestamps
 */

/**
 * Convert a Firestore Timestamp or date string to a JavaScript Date object
 * @param {any} dateValue - Firestore Timestamp, Date object, string, or number
 * @returns {Date|null} - JavaScript Date object or null if invalid
 */
export const toDate = (dateValue) => {
  if (!dateValue) return null;
  
  // If it's already a Date object
  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? null : dateValue;
  }
  
  // If it's a Firestore Timestamp (has toDate method)
  if (dateValue && typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  
  // If it's a Firestore Timestamp-like object with seconds
  if (dateValue && typeof dateValue.seconds === 'number') {
    return new Date(dateValue.seconds * 1000);
  }
  
  // If it's a string or number, try to parse it
  if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  return null;
};

/**
 * Format a date value to a localized date string
 * @param {any} dateValue - Firestore Timestamp, Date object, string, or number
 * @param {string} locale - Locale string (default: 'en-US')
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string or 'N/A' if invalid
 */
export const formatDate = (dateValue, locale = 'en-US', options = {}) => {
  const date = toDate(dateValue);
  if (!date) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  try {
    return date.toLocaleDateString(locale, defaultOptions);
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Format a date value to a full localized date string
 * @param {any} dateValue - Firestore Timestamp, Date object, string, or number
 * @returns {string} - Formatted date string or 'N/A' if invalid
 */
export const formatFullDate = (dateValue) => {
  return formatDate(dateValue, 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format a date value to a short localized date string
 * @param {any} dateValue - Firestore Timestamp, Date object, string, or number
 * @returns {string} - Formatted date string or 'N/A' if invalid
 */
export const formatShortDate = (dateValue) => {
  return formatDate(dateValue, 'en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
};

/**
 * Format a date value to ISO string for form inputs
 * @param {any} dateValue - Firestore Timestamp, Date object, string, or number
 * @returns {string} - ISO date string (YYYY-MM-DD) or empty string if invalid
 */
export const toISODateString = (dateValue) => {
  const date = toDate(dateValue);
  if (!date) return '';
  
  try {
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};
