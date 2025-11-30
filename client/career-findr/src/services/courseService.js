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
  limit,
} from "firebase/firestore";
import { searchCourses as algoliaSearchCourses, isAlgoliaConfigured } from "./algoliaService";

// Helper function to remove undefined values from an object
const removeUndefined = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
};

// Create a new course
export const createCourse = async (courseData, institutionId, institutionName) => {
  try {
    const coursesRef = collection(db, "courses");
    const newCourse = removeUndefined({
      ...courseData,
      institutionId,
      institutionName: institutionName || courseData.institutionName || null,
      status: courseData.status || "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const docRef = await addDoc(coursesRef, newCourse);
    return { id: docRef.id, ...newCourse };
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Update a course
export const updateCourse = async (courseId, courseData) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    const updatedData = removeUndefined({
      ...courseData,
      updatedAt: serverTimestamp(),
    });

    await updateDoc(courseRef, updatedData);
    return { id: courseId, ...updatedData };
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Get a single course
export const getCourse = async (courseId) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);

    if (courseSnap.exists()) {
      return { id: courseSnap.id, ...courseSnap.data() };
    } else {
      throw new Error("Course not found");
    }
  } catch (error) {
    console.error("Error getting course:", error);
    throw error;
  }
};

// Get all courses for an institution
export const getInstitutionCourses = async (institutionId) => {
  try {
    const coursesRef = collection(db, "courses");
    const q = query(
      coursesRef,
      where("institutionId", "==", institutionId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    return courses;
  } catch (error) {
    console.error("Error getting institution courses:", error);
    throw error;
  }
};

// Get all courses (for students to browse)
export const getAllCourses = async (filters = {}) => {
  try {
    const coursesRef = collection(db, "courses");
    const constraints = [where("status", "==", "active")];

    // Add filters if provided
    if (filters.field) {
      constraints.push(where("field", "==", filters.field));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(coursesRef, ...constraints);

    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    return courses;
  } catch (error) {
    console.error("Error getting courses:", error);
    throw error;
  }
};

// Search courses with full-text search (Algolia) or Firebase fallback
export const searchCourses = async (searchQuery = '', filters = {}, page = 0, pageSize = 20) => {
  try {
    // Try Algolia first if configured
    if (isAlgoliaConfigured()) {
      const algoliaResults = await algoliaSearchCourses(searchQuery, filters, page, pageSize);
      if (!algoliaResults.fallback && !algoliaResults.error) {
        return {
          courses: algoliaResults.hits,
          totalCount: algoliaResults.nbHits,
          totalPages: algoliaResults.nbPages,
          currentPage: algoliaResults.page,
          source: 'algolia',
        };
      }
    }

    // Fallback to Firebase
    const coursesRef = collection(db, "courses");
    const constraints = [where("status", "==", "active")];

    if (filters.field) {
      constraints.push(where("field", "==", filters.field));
    }
    if (filters.level) {
      constraints.push(where("level", "==", filters.level));
    }
    if (filters.location) {
      constraints.push(where("location", "==", filters.location));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(coursesRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    let courses = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    // Client-side text search if query provided
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      courses = courses.filter(course =>
        course.name?.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower) ||
        course.institutionName?.toLowerCase().includes(searchLower) ||
        course.field?.toLowerCase().includes(searchLower)
      );
    }

    return {
      courses,
      totalCount: courses.length,
      totalPages: Math.ceil(courses.length / pageSize),
      currentPage: page,
      source: 'firebase',
    };
  } catch (error) {
    console.error("Error searching courses:", error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (courseId) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    await deleteDoc(courseRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};
