
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'director' | 'consultant' | ('admin' | 'director' | 'consultant')[];
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, hasPermission, userRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("[ProtectedRoute] Verificando autenticação:", isAuthenticated);
    console.log("[ProtectedRoute] Papel do usuário:", userRole);
    console.log("[ProtectedRoute] Rota atual:", location.pathname);
    
    // Verificar se é um usuário de demonstração
    const demoType = localStorage.getItem('demo_user_type');
    if (demoType) {
      console.log("[ProtectedRoute] Demo user type:", demoType);
      console.log("[ProtectedRoute] Permitindo acesso à rota para usuário demo:", location.pathname);
    }
    
    if (!isAuthenticated) {
      console.log("[ProtectedRoute] Usuário não autenticado, redirecionando para login...");
    } else {
      console.log("[ProtectedRoute] Usuário autenticado, permitindo acesso à rota:", location.pathname);
    }
  }, [isAuthenticated, location.pathname, userRole]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("[ProtectedRoute] Redirecionando para login, rota atual:", location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If role check is required and user doesn't have permission
  if (requiredRole && !hasPermission(requiredRole)) {
    console.log("[ProtectedRoute] Usuário não tem permissão para acessar a rota:", location.pathname);
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required permission
  return <Outlet />;
};

export default ProtectedRoute;
