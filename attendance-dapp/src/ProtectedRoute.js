import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, requiredRole, children }) => {
  if (role !== requiredRole) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
