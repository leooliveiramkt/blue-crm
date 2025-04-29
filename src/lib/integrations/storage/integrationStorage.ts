
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { IntegrationType, IntegrationData } from '../types';

/**
 * Classe para gerenciar o armazenamento de dados das integrações
 */
export class IntegrationStorage {
  /**
   * Carrega todas as integrações para um tenant específico
   */
  public async loadIntegrations(tenantId: string): Promise<IntegrationData[]> {
    if (!isSupabaseConfigured) {
      // Fallback para localStorage
      const savedIntegrations = localStorage.getItem(`integrations_${tenantId}`);
      if (savedIntegrations) {
        return JSON.parse(savedIntegrations) as IntegrationData[];
      }
      return [];
    }

    try {
      // Consulta Supabase para obter todas as integrações do tenant
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('tenant_id', tenantId);

      if (error) throw error;

      if (data && data.length > 0) {
        // Converte os dados para o formato IntegrationData
        return data.map(item => ({
          id: item.id as IntegrationType,
          tenantId: item.tenant_id,
          status: item.status,
          credentials: item.credentials,
          metadata: item.metadata || {},
          lastSync: item.last_sync,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
      return [];
    }
  }

  /**
   * Busca uma integração específica
   */
  public async getIntegration(integrationId: IntegrationType, tenantId: string): Promise<IntegrationData | null> {
    if (!isSupabaseConfigured) {
      const savedIntegrations = localStorage.getItem(`integrations_${tenantId}`);
      if (savedIntegrations) {
        const integrations = JSON.parse(savedIntegrations) as IntegrationData[];
        return integrations.find(i => i.id === integrationId) || null;
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('id', integrationId)
        .single();

      if (error) throw error;

      if (data) {
        // Converte para o formato IntegrationData
        return {
          id: data.id as IntegrationType,
          tenantId: data.tenant_id,
          status: data.status,
          credentials: data.credentials,
          metadata: data.metadata || {},
          lastSync: data.last_sync,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Erro ao buscar integração ${integrationId}:`, error);
      return null;
    }
  }

  /**
   * Salva ou atualiza uma integração
   */
  public async saveIntegration(integration: IntegrationData): Promise<IntegrationData | null> {
    if (!isSupabaseConfigured) {
      // Salva no localStorage
      const savedIntegrations = localStorage.getItem(`integrations_${integration.tenantId}`);
      let integrations = savedIntegrations ? JSON.parse(savedIntegrations) as IntegrationData[] : [];
      
      const existingIndex = integrations.findIndex(i => i.id === integration.id);
      
      if (existingIndex >= 0) {
        // Atualiza integração existente
        integrations[existingIndex] = integration;
      } else {
        // Adiciona nova integração
        integrations.push(integration);
      }
      
      localStorage.setItem(`integrations_${integration.tenantId}`, JSON.stringify(integrations));
      return integration;
    }

    try {
      // Preparando dados para o formato da tabela
      const dbData = {
        id: integration.id,
        tenant_id: integration.tenantId,
        status: integration.status,
        credentials: integration.credentials,
        metadata: integration.metadata,
        last_sync: integration.lastSync,
        created_at: integration.createdAt,
        updated_at: integration.updatedAt
      };

      const { data, error } = await supabase
        .from('integrations')
        .upsert(dbData)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Converte de volta para o formato IntegrationData
        return {
          id: data.id as IntegrationType,
          tenantId: data.tenant_id,
          status: data.status,
          credentials: data.credentials,
          metadata: data.metadata || {},
          lastSync: data.last_sync,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao salvar integração:', error);
      return null;
    }
  }

  /**
   * Exclui uma integração
   */
  public async deleteIntegration(integrationId: IntegrationType, tenantId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      // Remove do localStorage
      const savedIntegrations = localStorage.getItem(`integrations_${tenantId}`);
      if (savedIntegrations) {
        let integrations = JSON.parse(savedIntegrations) as IntegrationData[];
        integrations = integrations.filter(i => i.id !== integrationId);
        localStorage.setItem(`integrations_${tenantId}`, JSON.stringify(integrations));
      }
      return true;
    }

    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('tenant_id', tenantId)
        .eq('id', integrationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir integração ${integrationId}:`, error);
      return false;
    }
  }
}

export const integrationStorage = new IntegrationStorage();
