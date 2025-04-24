
export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  ownerId?: string;
  logo?: string;
  settings?: TenantSettings;
}

export interface TenantSettings {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
  features?: {
    [featureKey: string]: boolean;
  };
  integrations?: {
    [integrationId: string]: boolean;
  };
  customFields?: Record<string, any>;
}

export interface TenantUser {
  userId: string;
  tenantId: string;
  role: 'owner' | 'admin' | 'manager' | 'member' | 'guest';
  status: 'active' | 'inactive' | 'invited' | 'suspended';
  permissions?: string[];
  joinedAt: string;
  invitedBy?: string;
  metadata?: Record<string, any>;
}
