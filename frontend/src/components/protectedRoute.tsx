import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: JSX.Element;
  adminRequired?: boolean;
  isAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  children,
  adminRequired = false,
  isAdmin = false
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminRequired && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;