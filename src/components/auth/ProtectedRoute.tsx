
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
    }
  }, [isAuthenticated, location.pathname, userRole]);

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    console.log("[ProtectedRoute] Redirecionando para login, rota atual:", location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Se precisar verificar função e usuário não tem permissão
  if (requiredRole && !hasPermission(requiredRole)) {
    console.log("[ProtectedRoute] Usuário não tem permissão para acessar a rota:", location.pathname);
    return <Navigate to="/unauthorized" replace />;
  }

  // Usuário está autenticado e tem as permissões necessárias
  console.log("[ProtectedRoute] Usuário autorizado, renderizando rota protegida:", location.pathname);
  return <Outlet />;
};

export default ProtectedRoute;
