
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

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketing/*"
        element={
          <ProtectedRoute>
            <Marketing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/commercial"
        element={
          <ProtectedRoute>
            <Commercial />
          </ProtectedRoute>
        }
      />
      <Route
        path="/affiliates"
        element={
          <ProtectedRoute>
            <Affiliates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crm-pipeline"
        element={
          <ProtectedRoute>
            <CrmPipeline />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-analytics"
        element={
          <ProtectedRoute>
            <AIAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shipping"
        element={
          <ProtectedRoute>
            <Shipping />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-tracking"
        element={
          <ProtectedRoute>
            <OrderTracking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wbuy-affiliation"
        element={
          <ProtectedRoute>
            <WbuyAffiliation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wbuy-sync"
        element={
          <ProtectedRoute>
            <WbuySync />
          </ProtectedRoute>
        }
      />
      <Route
        path="/api-integrations"
        element={
          <ProtectedRoute>
            <ApiIntegrations />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
