import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import '../styles/home/layout.shared.css'; // Contiene el .loader-container

type Props = {
  requiredRole?: 'admin' | 'cliente';
};

export const ProtectedRoute: React.FC<Props> = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Verificando sesión...
      </div>
    );
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