export type IntegrationType = 'wbuy' | 'facebook' | 'activecampaign' | 'google' | 'stape' | 'tiny' | 'airtable';

export interface IntegrationCredentials {
  [key: string]: any;
}

export interface Integration {
  id: string;
  user_id: string;
  integration_id: IntegrationType;
  credentials: IntegrationCredentials;
  status: 'connected' | 'disconnected' | 'pending';
  metadata?: any;
  lastSync?: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationConfigField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
}

export interface IntegrationConfig {
  name: string;
  description: string;
  requiredFields: IntegrationConfigField[];
} 