import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface TenantApiConfig {
  id: string;
  tenant_id: string;
  integration_id: string;
  api_key: string;
  api_url?: string;
  additional_config?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getTenantApiConfigs(tenantId: string) {
  const { data, error } = await supabase
    .from('tenant_api_configs')
    .select('*')
    .eq('tenant_id', tenantId);

  if (error) throw error;
  return data as TenantApiConfig[];
}

export async function saveTenantApiConfig(config: Omit<TenantApiConfig, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tenant_api_configs')
    .upsert({
      ...config,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data as TenantApiConfig;
}

export async function deleteTenantApiConfig(id: string) {
  const { error } = await supabase
    .from('tenant_api_configs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function testTenantApiConnection(config: TenantApiConfig) {
  try {
    const response = await fetch(`${config.api_url || getDefaultApiUrl(config.integration_id)}`, {
      headers: {
        'Authorization': `Bearer ${config.api_key}`,
        ...getDefaultHeaders(config.integration_id)
      }
    });

    if (!response.ok) throw new Error(`API returned ${response.status}`);
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function getDefaultApiUrl(integrationId: string): string {
  const urls = {
    wbuy: 'https://api.wbuy.com.br/v1/products',
    facebook: 'https://graph.facebook.com/v18.0/me/adaccounts',
    activecampaign: 'https://api.activecampaign.com/api/3/contacts',
    google: 'https://analyticsdata.googleapis.com/v1beta/properties',
    stape: 'https://api.stape.io/v1/calls',
    tiny: 'https://api.tiny.com.br/v2/produtos'
  };
  return urls[integrationId] || '';
}

function getDefaultHeaders(integrationId: string): Record<string, string> {
  const headers = {
    wbuy: { 'Content-Type': 'application/json' },
    facebook: { 'Content-Type': 'application/json' },
    activecampaign: { 'Api-Token': '' },
    google: { 'Content-Type': 'application/json' },
    stape: { 'Content-Type': 'application/json' },
    tiny: { 'Content-Type': 'application/json' }
  };
  return headers[integrationId] || {};
} 