import React, { createContext, useState, useContext, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch their profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = { uid: firebaseUser.uid, ...userDoc.data() };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (userData) => {
    setError(null);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Create user profile in Firestore
      const userProfile = {
        email: userData.email,
        name: userData.profileData?.name || userData.name || "",
        phone: userData.profileData?.phone || userData.phone || "",
        role: userData.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userProfile);

      // Set user state
      const fullUserData = { uid: userCredential.user.uid, ...userProfile };
      setUser(fullUserData);
      localStorage.setItem("user", JSON.stringify(fullUserData));

      return { user: fullUserData };
    } catch (err) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async (credentials) => {
    setError(null);
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (!userDoc.exists()) {
        throw new Error("User profile not found");
      }

      const fullUserData = { uid: userCredential.user.uid, ...userDoc.data() };
      setUser(fullUserData);
      localStorage.setItem("user", JSON.stringify(fullUserData));

      return { user: fullUserData };
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout error:", err);
      throw err;
    }
  };

  const signInWithGoogle = async (defaultRole = "student") => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Check if user already exists in Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      let fullUserData;

      if (userDoc.exists()) {
        // User exists, use existing profile
        fullUserData = { uid: firebaseUser.uid, ...userDoc.data() };
      } else {
        // New user, create profile
        const userProfile = {
          email: firebaseUser.email,
          name: firebaseUser.displayName || "",
          phone: firebaseUser.phoneNumber || "",
          role: defaultRole,
          photoURL: firebaseUser.photoURL || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, userProfile);
        fullUserData = { uid: firebaseUser.uid, ...userProfile };
      }

      setUser(fullUserData);
      localStorage.setItem("user", JSON.stringify(fullUserData));

      return { user: fullUserData, isNewUser: !userDoc.exists() };
    } catch (err) {
      const errorMessage = err.message || "Google sign-in failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    signInWithGoogle,
    isAuthenticated: !!user,
    isStudent: user?.role === "student",
    isInstitute: user?.role === "institute",
    isCompany: user?.role === "company",
    isAdmin: user?.role === "admin",
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
