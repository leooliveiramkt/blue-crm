import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TenantProvider } from "@/hooks/useTenant";
import Routes from './Routes';
import "./App.css";

function App() {
  // Verificar se o cliente está conectando com a API
  console.log("[App] App iniciado - Verificando ambiente");
  
  // Verificar se há usuários de demonstração
  const demoType = localStorage.getItem('demo_user_type');
  if (demoType) {
    console.log("[App] Usuário de demonstração detectado:", demoType);
  }

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <TenantProvider>
            <div className="min-h-screen bg-background">
              <Routes />
              <Toaster />
            </div>
          </TenantProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
