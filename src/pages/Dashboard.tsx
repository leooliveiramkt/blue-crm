
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import DashboardHeader from './dashboard/components/DashboardHeader';
import StatsSection from './dashboard/components/StatsSection';
import ChartsSection from './dashboard/components/ChartsSection';
import CardsSection from './dashboard/components/CardsSection';

const Dashboard = () => {
  const { userRole, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("Dashboard renderizado");
    console.log("Papel do usuário:", userRole);
    console.log("Estado de autenticação:", isAuthenticated);
    
    // Log para depuração
    document.getElementById('dashboard-debug')?.setAttribute(
      'data-info', 
      `Dashboard carregado: ${new Date().toLocaleTimeString()}, Auth: ${isAuthenticated}, Role: ${userRole}`
    );
  }, [userRole, isAuthenticated]);

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Elemento de debug invisível */}
      <div id="dashboard-debug" className="sr-only"></div>
      
      <DashboardHeader />
      <StatsSection />
      <ChartsSection />
      <CardsSection />
    </div>
  );
};

export default Dashboard;
