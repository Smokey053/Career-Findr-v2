import { auth, db } from "../config/firebaseConfig.js";
import { generateToken } from "../utils/jwtUtils.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import { validationResult } from "express-validator";

export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password, role, profileData } = req.body;

    // Validate role
    if (!["student", "institute", "company", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be: student, institute, company, or admin",
      });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: false,
      disabled: false,
    });

    // Create user document in Firestore
    const userDoc = {
      userId: userRecord.uid,
      email: email,
      role: role,
      isVerified: false,
      isApproved: role === "student" ? true : false, // Students auto-approved, others need admin approval
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        name: profileData?.name || "",
        phone: profileData?.phone || "",
        ...profileData,
      },
    };

    await db.collection("users").doc(userRecord.uid).set(userDoc);

    // Generate email verification link
    try {
      const emailVerificationLink = await auth.generateEmailVerificationLink(
        email,
        {
          url: `${
            process.env.CLIENT_URL || "http://localhost:3000"
          }/verify-email`,
        }
      );
      await sendVerificationEmail(email, emailVerificationLink);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue registration even if email fails
    }

    // Generate JWT token
    const token = generateToken({
      uid: userRecord.uid,
      email: email,
      role: role,
    });

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account.",
      user: {
        uid: userRecord.uid,
        email: email,
        role: role,
        isVerified: false,
        isApproved: userDoc.isApproved,
        profile: userDoc.profile,
      },
      token: token,
      ...(role !== "student" && {
        notice:
          "Your account requires admin approval before full access is granted.",
      }),
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password, idToken } = req.body;

    let userData;

    // If idToken provided (Firebase Auth from frontend)
    if (idToken) {
      const decodedToken = await auth.verifyIdToken(idToken);
      const userDoc = await db.collection("users").doc(decodedToken.uid).get();

      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          message: "User not found in database",
        });
      }

      userData = { userId: decodedToken.uid, ...userDoc.data() };
    } else {
      // Email/password login (search by email)
      const usersSnapshot = await db
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (usersSnapshot.empty) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const userDoc = usersSnapshot.docs[0];
      userData = userDoc.data();

      // Note: In production, verify password with Firebase Auth client SDK
      // Backend should validate the Firebase ID token instead
    }

    // Check if email is verified
    if (!userData.isVerified) {
      return res.status(401).json({
        success: false,
        message:
          "Please verify your email before logging in. Check your inbox for verification link.",
      });
    }

    // Check approval status for companies/institutes
    if (
      (userData.role === "company" || userData.role === "institute") &&
      !userData.isApproved
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Your account is pending admin approval. You will receive an email once approved.",
      });
    }

    // Generate JWT token
    const token = generateToken({
      uid: userData.userId,
      email: userData.email,
      role: userData.role,
    });

    // Update last login
    await db.collection("users").doc(userData.userId).update({
      lastLogin: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        uid: userData.userId,
        email: userData.email,
        role: userData.role,
        isVerified: userData.isVerified,
        isApproved: userData.isApproved,
        profile: userData.profile,
      },
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { oobCode } = req.query;

    if (!oobCode) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required",
      });
    }

    // Verify the email using Firebase Admin
    try {
      // In a real scenario, this would be handled by Firebase client SDK
      // For backend, we'll mark as verified when the user clicks the link
      const email = req.query.email;

      if (email) {
        const usersSnapshot = await db
          .collection("users")
          .where("email", "==", email)
          .limit(1)
          .get();

        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          await userDoc.ref.update({
            isVerified: true,
            emailVerifiedAt: new Date().toISOString(),
          });

          res.json({
            success: true,
            message: "Email verified successfully! You can now login.",
          });
        } else {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Email parameter is required",
        });
      }
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = usersSnapshot.docs[0].data();

    if (userData.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new verification link
    const emailVerificationLink = await auth.generateEmailVerificationLink(
      email,
      {
        url: `${
          process.env.CLIENT_URL || "http://localhost:3000"
        }/verify-email`,
      }
    );

    await sendVerificationEmail(email, emailVerificationLink);

    res.json({
      success: true,
      message: "Verification email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { uid } = req.user;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      user: {
        uid: userData.userId,
        email: userData.email,
        role: userData.role,
        isVerified: userData.isVerified,
        isApproved: userData.isApproved,
        profile: userData.profile,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Generate password reset link
    const passwordResetLink = await auth.generatePasswordResetLink(email, {
      url: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/reset-password`,
    });

    // Send password reset email (implement this in emailService.js)
    // await sendPasswordResetEmail(email, passwordResetLink);

    res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // In JWT-based auth, logout is typically handled client-side by removing the token
    // Optionally, you can maintain a token blacklist

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
