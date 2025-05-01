
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TenantProvider } from "@/hooks/useTenant";
import { Routes } from "./Routes";
import { useSupabaseConnection } from "@/hooks/useSupabaseConnection";
import "./App.css";

function App() {
  // Verificar se o cliente está conectando com a API
  console.log("[App] App iniciado - Verificando ambiente");
  
  // Verificar conexão com Supabase
  const { debugInfo } = useSupabaseConnection();
  if (debugInfo) {
    console.warn("[App] Problema de conexão detectado:", debugInfo);
  }
  
  // Verificar se há usuários de demonstração
  const demoType = localStorage.getItem('demo_user_type');
  if (demoType) {
    console.log("[App] Usuário de demonstração detectado:", demoType);
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TenantProvider>
            <Routes />
            <Toaster />
          </TenantProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
