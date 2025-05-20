import { supabase } from '@/lib/supabase';

export interface BelaBlueConfig {
  id: string;
  company_name: string;
  wbuy_api_url: string;
  wbuy_api_key: string;
  wbuy_store_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getBelaBlueConfig(): Promise<BelaBlueConfig | null> {
  const { data, error } = await supabase
    .from('bela_blue_configs')
    .select('*')
    .eq('company_name', 'Bela Blue')
    .single();

  if (error) {
    console.error('Erro ao buscar configuração da Bela Blue:', error);
    return null;
  }

  return data;
}

export async function updateBelaBlueConfig(config: Partial<BelaBlueConfig>): Promise<BelaBlueConfig | null> {
  const { data, error } = await supabase
    .from('bela_blue_configs')
    .update({
      ...config,
      updated_at: new Date().toISOString()
    })
    .eq('company_name', 'Bela Blue')
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar configuração da Bela Blue:', error);
    return null;
  }

  return data;
}

export async function testWBuyConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getBelaBlueConfig();
    if (!config) {
      throw new Error('Configuração da Bela Blue não encontrada');
    }

    const response = await fetch(config.wbuy_api_url, {
      headers: {
        'Authorization': config.wbuy_api_key,
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