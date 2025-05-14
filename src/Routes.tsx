
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
import WbuySync from './pages/WbuySync';
import ApiIntegrations from './pages/ApiIntegrations';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas usando o padrão outlet do React Router */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/marketing/*" element={<Marketing />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/commercial" element={<Commercial />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/affiliates" element={<Affiliates />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/crm-pipeline" element={<CrmPipeline />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/ai-analytics" element={<AIAnalytics />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/reports" element={<Reports />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/shipping" element={<Shipping />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/order-tracking" element={<OrderTracking />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/wbuy-affiliation" element={<WbuyAffiliation />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/wbuy-sync" element={<WbuySync />} />
      </Route>
      
      <Route element={<ProtectedRoute />}>
        <Route path="/api-integrations" element={<ApiIntegrations />} />
      </Route>
      
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
