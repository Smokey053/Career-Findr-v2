import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/common/LoadingScreen";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user has no role defined, redirect to login
  if (!user.role) {
    console.warn("User has no role defined:", user);
    return <Navigate to="/login" replace />;
  }

  // Normalize role for comparison (case-insensitive)
  const userRole = user.role.toLowerCase().trim();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase().trim());

  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on user's role
    if (userRole === "student")
      return <Navigate to="/dashboard/student" replace />;
    if (userRole === "institute")
      return <Navigate to="/dashboard/institute" replace />;
    if (userRole === "company")
      return <Navigate to="/dashboard/company" replace />;
    if (userRole === "admin")
      return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
