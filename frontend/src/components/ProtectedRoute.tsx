// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  requiredRole?: "admin" | "cliente";
};

export const ProtectedRoute: React.FC<Props> = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // small loading placeholder
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    // redirect to home if role mismatch
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
