
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ApiIntegrations from "./pages/ApiIntegrations";
import NotFound from "./pages/NotFound";
import AIAnalytics from "./pages/AIAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="api-integrations" element={<ApiIntegrations />} />
            <Route path="ai-analytics" element={<AIAnalytics />} />
            {/* Placeholder routes for future implementation */}
            <Route path="affiliates" element={<ComingSoon title="Afiliados" />} />
            <Route path="tracking" element={<ComingSoon title="Rastreamento" />} />
            <Route path="orders" element={<ComingSoon title="Pedidos" />} />
            <Route path="settings" element={<ComingSoon title="Configurações" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
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
