import { supabase } from './supabase';

export interface TenantApiConfig {
  id: string;
  tenant_id: string;
  integration_id: string;
  api_key: string;
  api_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getTenantApiConfigs(tenantId: string): Promise<TenantApiConfig[]> {
  const { data, error } = await supabase
    .from('tenant_api_configs')
    .select('*')
    .eq('tenant_id', tenantId);

  if (error) throw error;
  return data || [];
}

export async function saveTenantApiConfig(config: Omit<TenantApiConfig, 'id' | 'created_at' | 'updated_at'>): Promise<TenantApiConfig> {
  const { data, error } = await supabase
    .from('tenant_api_configs')
    .upsert({
      ...config,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTenantApiConfig(id: string): Promise<void> {
  const { error } = await supabase
    .from('tenant_api_configs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function testTenantApiConnection(config: TenantApiConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(config.api_url || '', {
      headers: {
        'Authorization': `Bearer ${config.api_key}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API retornou status ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
} 