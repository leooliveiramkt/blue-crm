
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'director' | 'consultant' | ('admin' | 'director' | 'consultant')[];
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute verificando autenticação:", isAuthenticated);
    if (!isAuthenticated) {
      console.log("Usuário não autenticado, redirecionando para login...");
    }
  }, [isAuthenticated]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Redirecionando para login, rota atual:", location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If role check is required and user doesn't have permission
  if (requiredRole && !hasPermission(requiredRole)) {
    console.log("Usuário não tem permissão para acessar a rota:", location.pathname);
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required permission
  return <Outlet />;
};

export default ProtectedRoute;
