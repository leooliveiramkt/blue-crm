
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import TenantPanel from './TenantPanel';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/context/AuthContext';

const MainLayout = () => {
  const { isLoading } = useTenant();
  const { userRole, userName } = useAuth();

  useEffect(() => {
    console.log("MainLayout renderizado");
    console.log("Usuário:", userName);
    console.log("Papel do usuário:", userRole);
  }, [userRole, userName]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
