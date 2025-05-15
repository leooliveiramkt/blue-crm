
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketing from './pages/Marketing';
import Commercial from './pages/Commercial';
import Affiliates from './pages/Affiliates';
import CrmPipeline from './pages/CrmPipeline';
import AIAnalytics from './pages/AIAnalytics';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import Settings from './pages/Settings';
import Shipping from './pages/Shipping';
import OrderTracking from './pages/OrderTracking';
import WbuyAffiliation from './pages/wbuy-affiliation/WbuyAffiliation';
import ApiIntegrations from './pages/ApiIntegrations';
import MainLayout from './components/layout/MainLayout';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Rotas protegidas usando o MainLayout para garantir que o menu esteja presente */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketing/*" element={<Marketing />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/affiliates" element={<Affiliates />} />
          <Route path="/crm-pipeline" element={<CrmPipeline />} />
          <Route path="/ai-analytics" element={<AIAnalytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/wbuy-affiliation" element={<WbuyAffiliation />} />
          <Route path="/api-integrations" element={<ApiIntegrations />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
