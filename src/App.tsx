
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TenantProvider } from "./hooks/useTenant";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ApiIntegrations from "./pages/ApiIntegrations";
import AIAnalytics from "./pages/AIAnalytics";
import Settings from "./pages/settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import WbuyAffiliation from "./pages/WbuyAffiliation";
import Marketing from "./pages/Marketing";
import Affiliates from "./pages/Affiliates";
import { BASE_PATH } from "./config/deployment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={BASE_PATH}>
        <AuthProvider>
          <TenantProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="api-integrations" element={<ApiIntegrations />} />
                  <Route path="ai-analytics" element={<AIAnalytics />} />
                  <Route path="marketing" element={<Marketing />} />
                  <Route path="wbuy-affiliation" element={<WbuyAffiliation />} />
                  <Route path="affiliates" element={<Affiliates />} />

                  {/* Admin only routes */}
                  <Route path="settings" element={<Settings />} />
                  
                  {/* Placeholder routes for future implementation */}
                  <Route path="tracking" element={<ComingSoon title="Rastreamento" />} />
                  <Route path="orders" element={<ComingSoon title="Pedidos" />} />
                </Route>
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TenantProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Placeholder component for routes not yet implemented
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
    <p className="text-muted-foreground mb-8">Esta funcionalidade está em desenvolvimento.</p>
    <div className="w-16 h-1 bg-primary mb-8" />
    <p className="text-muted-foreground max-w-md">
      Estamos trabalhando para disponibilizar esta funcionalidade em breve.
    </p>
  </div>
);

export default App;
