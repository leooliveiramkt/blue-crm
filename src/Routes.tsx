
import { Route, Routes as RouterRoutes, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import Marketing from "@/pages/Marketing";
import Reports from "@/pages/Reports";
import AIAnalytics from "@/pages/AIAnalytics";
import Affiliates from "@/pages/Affiliates";
import ApiIntegrations from "@/pages/ApiIntegrations";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import WbuyAffiliation from "@/pages/wbuy-affiliation/WbuyAffiliation";
import { useAuth } from "@/context/AuthContext";

export const Routes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <RouterRoutes>
      {/* Rota inicial - redireciona para dashboard se autenticado */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Index />
        } 
      />
      
      {/* Rota de login - redireciona para dashboard se autenticado */}
      <Route 
        path="/login" 
        element={<Login />} 
      />
      
      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/affiliates" element={<Affiliates />} />
          <Route path="/analytics" element={<AIAnalytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/integrations" element={<ApiIntegrations />} />
          <Route path="/wbuy-affiliation" element={<WbuyAffiliation />} />
        </Route>
      </Route>

      {/* Rotas com restrições de acesso */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};
