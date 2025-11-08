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

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's role
    if (user.role === "student")
      return <Navigate to="/dashboard/student" replace />;
    if (user.role === "institute")
      return <Navigate to="/dashboard/institute" replace />;
    if (user.role === "company")
      return <Navigate to="/dashboard/company" replace />;
    if (user.role === "admin")
      return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
