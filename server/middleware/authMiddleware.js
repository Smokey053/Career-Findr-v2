import { verifyToken } from "../utils/jwtUtils.js";
import { db } from "../config/firebaseConfig.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required. Please login.",
      });
    }

    const decoded = verifyToken(token);

    // Verify user exists in database
    const userDoc = await db.collection("users").doc(decoded.uid).get();

    if (!userDoc.exists) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please register or login again.",
      });
    }

    const userData = userDoc.data();

    // Check if user is verified
    if (!userData.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before accessing this resource.",
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
          "Your account is pending admin approval. You will be notified via email once approved.",
      });
    }

    // Attach user info to request
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role,
      userData: userData,
    };

    next();
  } catch (error) {
    if (error.message === "Invalid or expired token") {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired authentication token. Please login again.",
      });
    }
    next(error);
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This resource requires ${allowedRoles.join(
          " or "
        )} role.`,
        userRole: userRole,
      });
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = verifyToken(token);
      const userDoc = await db.collection("users").doc(decoded.uid).get();

      if (userDoc.exists) {
        req.user = {
          uid: decoded.uid,
          email: decoded.email,
          role: decoded.role,
          userData: userDoc.data(),
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};
