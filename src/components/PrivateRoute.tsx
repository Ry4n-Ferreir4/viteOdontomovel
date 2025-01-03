import React from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>; // Substitua por um spinner ou componente de carregamento
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};