
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'director' | 'consultant' | ('admin' | 'director' | 'consultant')[];
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, hasPermission, userRole } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

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
      
      // Mostrar toast informando sobre redirecionamento
      toast({
        title: "Acesso restrito",
        description: "Você precisa fazer login para acessar esta página.",
      });
    } else {
      console.log("[ProtectedRoute] Usuário autenticado, permitindo acesso à rota:", location.pathname);
    }
  }, [isAuthenticated, location.pathname, userRole, toast]);

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
  console.log("[ProtectedRoute] Usuário autorizado, renderizando rota protegida:", location.pathname);
  return <Outlet />;
};

export default ProtectedRoute;
