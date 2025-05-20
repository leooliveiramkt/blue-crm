import { supabase } from '../../lib/supabase';
import { WBuyConfig } from './types';

export interface CompanyWBuyConfig extends WBuyConfig {
  company_id: string;
  is_active: boolean;
}

export class WBuyConfigService {
  // Buscar configuração da WBuy para a empresa atual
  static async getCurrentCompanyConfig(): Promise<CompanyWBuyConfig | null> {
    const { data: userCompanies, error: userError } = await supabase
      .from('company_users')
      .select('company_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (userError || !userCompanies) {
      console.error('Erro ao buscar empresa do usuário:', userError);
      return null;
    }

    const { data: config, error: configError } = await supabase
      .from('wbuy_configs')
      .select('*')
      .eq('company_id', userCompanies.company_id)
      .eq('is_active', true)
      .single();

    if (configError) {
      console.error('Erro ao buscar configuração WBuy:', configError);
      return null;
    }

    return config;
  }

  // Criar nova empresa com configuração WBuy
  static async createCompanyWithConfig(
    companyName: string,
    companySlug: string,
    config: WBuyConfig
  ): Promise<string | null> {
    const { data, error } = await supabase.rpc('create_company_with_wbuy_config', {
      company_name: companyName,
      company_slug: companySlug,
      wbuy_api_url: config.baseURL,
      wbuy_api_key: config.apiKey,
      wbuy_store_id: config.storeId
    });

    if (error) {
      console.error('Erro ao criar empresa com configuração:', error);
      return null;
    }

    return data;
  }

  // Atualizar configuração WBuy da empresa
  static async updateCompanyConfig(
    companyId: string,
    config: Partial<WBuyConfig>
  ): Promise<boolean> {
    const { error } = await supabase
      .from('wbuy_configs')
      .update({
        api_url: config.baseURL,
        api_key: config.apiKey,
        store_id: config.storeId,
        updated_at: new Date().toISOString()
      })
      .eq('company_id', companyId);

    if (error) {
      console.error('Erro ao atualizar configuração WBuy:', error);
      return false;
    }

    return true;
  }

  // Desativar configuração WBuy da empresa
  static async deactivateCompanyConfig(companyId: string): Promise<boolean> {
    const { error } = await supabase
      .from('wbuy_configs')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('company_id', companyId);

    if (error) {
      console.error('Erro ao desativar configuração WBuy:', error);
      return false;
    }

    return true;
  }

  // Listar todas as empresas do usuário com suas configurações
  static async listUserCompanies(): Promise<Array<{
    company: {
      id: string;
      name: string;
      slug: string;
    };
    config: CompanyWBuyConfig | null;
  }>> {
    const { data: userCompanies, error: userError } = await supabase
      .from('company_users')
      .select(`
        company:companies (
          id,
          name,
          slug
        )
      `)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (userError || !userCompanies) {
      console.error('Erro ao buscar empresas do usuário:', userError);
      return [];
    }

    const companiesWithConfig = await Promise.all(
      userCompanies.map(async ({ company }) => {
        const { data: config } = await supabase
          .from('wbuy_configs')
          .select('*')
          .eq('company_id', company.id)
          .eq('is_active', true)
          .single();

        return {
          company,
          config
        };
      })
    );

    return companiesWithConfig;
  }
} 