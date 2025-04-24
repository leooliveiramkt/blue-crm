
export type IntegrationType = 
  | 'wbuy' 
  | 'facebook' 
  | 'activecampaign' 
  | 'google' 
  | 'stape' 
  | 'tiny' 
  | 'airtable';

export type IntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error';

export interface IntegrationConfig {
  id: IntegrationType;
  name: string;
  description: string;
  color: string;
  iconName: string;
  requiredFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'password' | 'email' | 'url';
    placeholder?: string;
    required: boolean;
  }>;
  endpoints?: Record<string, string>;
}

export interface IntegrationData {
  id: IntegrationType;
  tenantId: string;
  status: IntegrationStatus;
  credentials: Record<string, string>;
  metadata?: Record<string, any>;
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationAdapter {
  config: IntegrationConfig;
  connect: (credentials: Record<string, string>, tenantId: string) => Promise<boolean>;
  disconnect: (tenantId: string) => Promise<boolean>;
  test: (credentials: Record<string, string>) => Promise<boolean>;
  getStatus: (tenantId: string) => Promise<IntegrationStatus>;
}
