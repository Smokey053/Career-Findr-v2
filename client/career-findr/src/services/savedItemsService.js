import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

const mapTimestamp = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "number") {
    return new Date(value);
  }
  return null;
};

export const getSavedItems = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to load saved items");
  }

  const savedRef = collection(db, "savedItems");
  const savedQuery = query(savedRef, where("userId", "==", userId));
  const snapshot = await getDocs(savedQuery);

  const jobs = [];
  const courses = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const item = {
      id: docSnap.id,
      ...data,
      savedAt: mapTimestamp(data.savedAt),
    };

    if (data.type === "job") {
      jobs.push(item);
    } else if (data.type === "course") {
      courses.push(item);
    }
  });

  const sortDescending = (a, b) => {
    const aTime = a.savedAt ? a.savedAt.getTime() : 0;
    const bTime = b.savedAt ? b.savedAt.getTime() : 0;
    return bTime - aTime;
  };

  jobs.sort(sortDescending);
  courses.sort(sortDescending);

  return { jobs, courses };
};

export const removeSavedItem = async (userId, type, itemId) => {
  if (!userId || !type || !itemId) {
    throw new Error("Missing required parameters to remove saved item");
  }

  const savedRef = collection(db, "savedItems");
  const savedQuery = query(
    savedRef,
    where("userId", "==", userId),
    where("type", "==", type),
    where("itemId", "==", itemId)
  );

  const snapshot = await getDocs(savedQuery);

  if (!snapshot.empty) {
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
    return;
  }

  // Fallback: try deleting by document id if itemId was stored as document key
  const docRef = doc(savedRef, itemId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await deleteDoc(docRef);
  }
};
