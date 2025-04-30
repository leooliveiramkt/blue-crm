
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import TenantPanel from './TenantPanel';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const MainLayout = () => {
  const { isLoading } = useTenant();
  const { userRole, userName, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("MainLayout renderizado");
    console.log("Usuário:", userName);
    console.log("Papel do usuário:", userRole);
    console.log("Estado de autenticação:", isAuthenticated);
    
    // Verificar se o usuário está autenticado
    if (!isAuthenticated) {
      console.log("Usuário não autenticado no MainLayout, redirecionando...");
      toast({
        title: "Sessão expirada",
        description: "Por favor, faça login novamente."
      });
      navigate('/login');
      return;
    }
  }, [userRole, userName, isAuthenticated, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Adicione verificação para garantir que o layout só seja renderizado se estiver autenticado
  if (!isAuthenticated) {
    console.log("MainLayout: Usuário não autenticado, retornando null");
    return null; // Não renderiza nada até que o redirecionamento ocorra
  }

  console.log("MainLayout: Renderizando layout completo");
  
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <TenantPanel />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
