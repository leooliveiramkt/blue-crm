
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { IntegrationType, IntegrationData, IntegrationStatus } from '../types';

/**
 * Classe para gerenciar o armazenamento de dados das integrações
 */
export class IntegrationStorage {
  /**
   * Carrega todas as integrações para um tenant específico
   */
  public async loadIntegrations(tenantId: string): Promise<IntegrationData[]> {
    console.log(`[IntegrationStorage] Carregando integrações para tenant ${tenantId}`);
    console.log(`[IntegrationStorage] Supabase configurado: ${isSupabaseConfigured}`);

    if (!isSupabaseConfigured) {
      // Fallback para localStorage
      console.log(`[IntegrationStorage] Usando localStorage para carregar integrações`);
      const savedIntegrations = localStorage.getItem(`integrations_${tenantId}`);
      if (savedIntegrations) {
        const parsedData = JSON.parse(savedIntegrations) as IntegrationData[];
        console.log(`[IntegrationStorage] Encontradas ${parsedData.length} integrações no localStorage`);
        return parsedData;
      }
      console.log(`[IntegrationStorage] Nenhuma integração encontrada no localStorage`);
      return [];
    }

    try {
      // Consulta Supabase para obter todas as integrações do tenant
      console.log(`[IntegrationStorage] Consultando tabela 'integrations' no Supabase para tenant ${tenantId}`);
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('tenant_id', tenantId);

      if (error) {
        console.error(`[IntegrationStorage] Erro do Supabase ao carregar integrações:`, error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log(`[IntegrationStorage] Encontradas ${data.length} integrações no Supabase`);
        // Converte os dados para o formato IntegrationData com casting adequado
        return data.map(item => ({
          id: item.id as IntegrationType,
          tenantId: item.tenant_id,
          status: item.status as IntegrationStatus,
          credentials: item.credentials as Record<string, string>,
          metadata: item.metadata as Record<string, any> || {},
          lastSync: item.last_sync,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
      }
      
      console.log(`[IntegrationStorage] Nenhuma integração encontrada no Supabase para tenant ${tenantId}`);
      return [];
    } catch (error) {
      console.error('[IntegrationStorage] Erro ao carregar integrações do Supabase:', error);
      return [];
    }
  }

  /**
   * Busca uma integração específica
   */
  public async getIntegration(integrationId: IntegrationType, tenantId: string): Promise<IntegrationData | null> {
    console.log(`[IntegrationStorage] Buscando integração ${integrationId} para tenant ${tenantId}`);
    console.log(`[IntegrationStorage] Supabase configurado: ${isSupabaseConfigured}`);

    if (!isSupabaseConfigured) {
      console.log(`[IntegrationStorage] Usando localStorage para buscar integração ${integrationId}`);
      const savedIntegrations = localStorage.getItem(`integrations_${tenantId}`);
      if (savedIntegrations) {
        const integrations = JSON.parse(savedIntegrations) as IntegrationData[];
        const found = integrations.find(i => i.id === integrationId);
        console.log(`[IntegrationStorage] Integração ${integrationId} ${found ? 'encontrada' : 'não encontrada'} no localStorage`);
        return found || null;
      }
      return null;
    }

    try {
      console.log(`[IntegrationStorage] Consultando Supabase para a integração ${integrationId}`);
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('id', integrationId)
        .single();

      if (error) {
        // Se o erro for devido à ausência de registros, apenas registramos
        if (error.code === 'PGRST116') {
          console.log(`[IntegrationStorage] Integração ${integrationId} não encontrada no Supabase`);
          return null;
        }
        console.error(`[IntegrationStorage] Erro do Supabase ao buscar integração ${integrationId}:`, error);
        throw error;
      }

      if (data) {
        console.log(`[IntegrationStorage] Integração ${integrationId} encontrada no Supabase`);
        // Converte para o formato IntegrationData com casting adequado
        return {
          id: data.id as IntegrationType,
          tenantId: data.tenant_id,
          status: data.status as IntegrationStatus,
          credentials: data.credentials as Record<string, string>,
          metadata: data.metadata as Record<string, any> || {},
          lastSync: data.last_sync,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
      
      console.log(`[IntegrationStorage] Nenhum dado retornado do Supabase para integração ${integrationId}`);
      return null;
    } catch (error) {
      console.error(`[IntegrationStorage] Erro ao buscar integração ${integrationId} do Supabase:`, error);
      return null;
    }
  }

  /**
   * Salva ou atualiza uma integração
   */
  public async saveIntegration(integration: IntegrationData): Promise<IntegrationData | null> {
    console.log(`[IntegrationStorage] Salvando integração ${integration.id} para tenant ${integration.tenantId}`);
    console.log(`[IntegrationStorage] Supabase configurado: ${isSupabaseConfigured}`);
    
    if (!isSupabaseConfigured) {
      console.log(`[IntegrationStorage] Supabase não configurado, salvando no localStorage`);
      // Salva no localStorage
      const savedIntegrations = localStorage.getItem(`integrations_${integration.tenantId}`);
      let integrations = savedIntegrations ? JSON.parse(savedIntegrations) as IntegrationData[] : [];
      
      const existingIndex = integrations.findIndex(i => i.id === integration.id);
      
      if (existingIndex >= 0) {
        // Atualiza integração existente
        integrations[existingIndex] = integration;
        console.log(`[IntegrationStorage] Atualizada integração existente no localStorage: ${integration.id}`);
      } else {
        // Adiciona nova integração
        integrations.push(integration);
        console.log(`[IntegrationStorage] Adicionada nova integração no localStorage: ${integration.id}`);
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

      console.log(`[IntegrationStorage] Enviando requisição para Supabase: ${integration.id}`, {
        temCredenciais: !!integration.credentials,
        credentialsKeys: Object.keys(integration.credentials)
      });

      const { data, error } = await supabase
        .from('integrations')
        .upsert(dbData)
        .select()
        .single();

      if (error) {
        console.error(`[IntegrationStorage] Erro Supabase ao salvar integração:`, error);
        throw error;
      }

      if (data) {
        console.log(`[IntegrationStorage] Integração salva com sucesso no Supabase: ${integration.id}`);
        // Converte de volta para o formato IntegrationData com casting adequado
        return {
          id: data.id as IntegrationType,
          tenantId: data.tenant_id,
          status: data.status as IntegrationStatus,
          credentials: data.credentials as Record<string, string>,
          metadata: data.metadata as Record<string, any> || {},
          lastSync: data.last_sync,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
      
      console.error(`[IntegrationStorage] Nenhum dado retornado do Supabase após salvar integração: ${integration.id}`);
      return null;
    } catch (error) {
      console.error(`[IntegrationStorage] Erro ao salvar integração ${integration.id}:`, error);
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
