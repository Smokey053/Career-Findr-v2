import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";

dotenv.config();

let app;

// Try to initialize with service account credentials first
if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  console.log("🔐 Initializing Firebase with service account credentials...");

  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID || "career-findr",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  };

  app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://career-findr-default-rtdb.firebaseio.com",
  });
} else {
  // Use Application Default Credentials (works with Firebase CLI login)
  console.log(
    "🔑 Using Firebase Application Default Credentials (via Firebase CLI)..."
  );
  console.log("💡 Make sure you're logged in with: firebase login");

  app = initializeApp({
    credential: applicationDefault(),
    projectId: "career-findr",
    databaseURL: "https://career-findr-default-rtdb.firebaseio.com",
  });
}

// Get Firestore and Auth instances
export const db = getFirestore(app);
export const auth = getAuth(app);

// Connect to emulators only if explicitly enabled
if (process.env.USE_EMULATOR === "true") {
  console.log("🔧 Connecting to Firebase Emulators...");

  // Set Firestore emulator
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });

  console.log("✅ Firestore Emulator: localhost:8080");
  console.log("✅ Auth Emulator: localhost:9099");
  console.log("✅ Database Emulator: localhost:9000");
  console.log("✅ Emulator UI: http://localhost:4000");
} else {
  console.log("✅ Connected to production Firebase");
}

// Firebase Client SDK configuration (for frontend - export this to client if needed)
export const firebaseClientConfig = {
  apiKey: "AIzaSyBZidAMJf1B2Qh3-GI1bfPBg84E_iyQNGk",
  authDomain: "career-findr.firebaseapp.com",
  databaseURL: "https://career-findr-default-rtdb.firebaseio.com",
  projectId: "career-findr",
  storageBucket: "career-findr.firebasestorage.app",
  messagingSenderId: "1015446452587",
  appId: "1:1015446452587:web:bea0fc936ac4eccf53342e",
  measurementId: "G-L9P1818ZKS",
};

export default app;
