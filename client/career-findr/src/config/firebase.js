import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase configuration from your backend
const firebaseConfig = {
  apiKey: "AIzaSyBZidAMJf1B2Qh3-GI1bfPBg84E_iyQNGk",
  authDomain: "career-findr.firebaseapp.com",
  databaseURL: "https://career-findr-default-rtdb.firebaseio.com",
  projectId: "career-findr",
  storageBucket: "career-findr.firebasestorage.app",
  messagingSenderId: "1015446452587",
  appId: "1:1015446452587:web:bea0fc936ac4eccf53342e",
  measurementId: "G-L9P1818ZKS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === "true") {
  console.log("🔧 Connecting to Firebase Emulators...");
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
  console.log("✅ Connected to Firebase Emulators");
}

export default app;
