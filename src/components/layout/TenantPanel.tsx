import { Tenant } from '@/lib/tenants/tenantManager';
import { useTenant } from '@/hooks/useTenant';
import { TenantSelector } from '@/components/tenant/TenantSelector';
import { Badge } from '@/components/ui/badge';
import { Building } from 'lucide-react';

export const TenantPanel = () => {
  const { currentTenant } = useTenant();

  if (!currentTenant) {
    return null;
  }

  // Determina a badge do plano
  const getPlanBadge = (plan: Tenant['plan']) => {
    switch (plan) {
      case 'enterprise':
        return <Badge variant="default" className="bg-purple-500">Enterprise</Badge>;
      case 'pro':
        return <Badge variant="default" className="bg-blue-500">Pro</Badge>;
      case 'basic':
        return <Badge variant="default" className="bg-green-500">Basic</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-2 p-4 border-b">
      <div className="flex items-center gap-3">
        <Building className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="font-medium">{currentTenant.name}</p>
          <p className="text-xs text-muted-foreground">
            {getPlanBadge(currentTenant.plan)}
          </p>
        </div>
      </div>
      <TenantSelector />
    </div>
  );
};

export default TenantPanel;
