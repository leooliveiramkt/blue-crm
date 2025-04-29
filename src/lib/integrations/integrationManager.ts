
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { IntegrationType, IntegrationData, IntegrationConfig, IntegrationStatus } from './types';
import { getIntegrationConfig } from './integrationConfigs';

/**
 * Gerenciador centralizado de integrações API
 */
class IntegrationManager {
  private static instance: IntegrationManager;

  // Cache para reduzir consultas ao Supabase
  private integrationsCache: Map<string, IntegrationData> = new Map();
  private tenantId: string = '';

  private constructor() {}

  public static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager();
    }
    return IntegrationManager.instance;
  }

  /**
   * Define o tenant ID atual para operações
   */
  public setTenantId(tenantId: string): void {
    this.tenantId = tenantId;
  }

  /**
   * Retorna o ID do tenant atual
   */
  public getTenantId(): string {
    return this.tenantId;
  }

  /**
   * Carrega todas as integrações para um tenant específico
   */
  public async loadIntegrations(tenantId?: string): Promise<IntegrationData[]> {
    const tid = tenantId || this.tenantId;
    
    if (!tid) {
      throw new Error('Tenant ID não especificado');
    }

    if (!isSupabaseConfigured) {
      // Fallback para localStorage quando o Supabase não estiver configurado
      const savedIntegrations = localStorage.getItem(`integrations_${tid}`);
      if (savedIntegrations) {
        const integrations = JSON.parse(savedIntegrations) as IntegrationData[];
        // Atualiza o cache
        integrations.forEach(integration => {
          this.integrationsCache.set(`${tid}_${integration.id}`, integration);
        });
        return integrations;
      }
      return [];
    }

    try {
      // Consulta Supabase para obter todas as integrações do tenant
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('tenant_id', tid);

      if (error) throw error;

      if (data && data.length > 0) {
        // Converte os dados para o formato IntegrationData
        const integrations: IntegrationData[] = data.map(item => ({
          id: item.id as IntegrationType,
          tenantId: item.tenant_id,
          status: item.status as IntegrationStatus,
          credentials: item.credentials as Record<string, string>,
          metadata: item.metadata as Record<string, any> || {},
          lastSync: item.last_sync,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
        
        // Atualiza o cache
        integrations.forEach(integration => {
          this.integrationsCache.set(`${tid}_${integration.id}`, integration);
        });
        
        return integrations;
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
  public async getIntegration(integrationId: IntegrationType, tenantId?: string): Promise<IntegrationData | null> {
    const tid = tenantId || this.tenantId;
    
    if (!tid) {
      throw new Error('Tenant ID não especificado');
    }

    // Verifica o cache primeiro
    const cacheKey = `${tid}_${integrationId}`;
    if (this.integrationsCache.has(cacheKey)) {
      return this.integrationsCache.get(cacheKey) || null;
    }

    if (!isSupabaseConfigured) {
      const savedIntegrations = localStorage.getItem(`integrations_${tid}`);
      if (savedIntegrations) {
        const integrations = JSON.parse(savedIntegrations) as IntegrationData[];
        const integration = integrations.find(i => i.id === integrationId);
        if (integration) {
          this.integrationsCache.set(cacheKey, integration);
          return integration;
        }
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('tenant_id', tid)
        .eq('id', integrationId)
        .single();

      if (error) throw error;

      if (data) {
        // Converte para o formato IntegrationData
        const integration: IntegrationData = {
          id: data.id as IntegrationType,
          tenantId: data.tenant_id,
          status: data.status as IntegrationStatus,
          credentials: data.credentials as Record<string, string>,
          metadata: data.metadata as Record<string, any> || {},
          lastSync: data.last_sync,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        this.integrationsCache.set(cacheKey, integration);
        return integration;
      }
      
      return null;
    } catch (error) {
      console.error(`Erro ao buscar integração ${integrationId}:`, error);
      return null;
    }
  }

  /**
   * Atualiza ou cria uma integração
   */
  public async saveIntegration(integration: Partial<IntegrationData>, tenantId?: string): Promise<IntegrationData | null> {
    const tid = tenantId || this.tenantId;
    
    if (!tid) {
      throw new Error('Tenant ID não especificado');
    }

    if (!integration.id) {
      throw new Error('ID da integração não especificado');
    }

    // Cria o objeto de integração completo
    const now = new Date().toISOString();
    const completeIntegration: IntegrationData = {
      id: integration.id,
      tenantId: tid,
      status: integration.status || 'disconnected',
      credentials: integration.credentials || {},
      metadata: integration.metadata || {},
      lastSync: integration.lastSync || undefined,
      createdAt: integration.createdAt || now,
      updatedAt: now
    };

    if (!isSupabaseConfigured) {
      // Salva no localStorage
      const savedIntegrations = localStorage.getItem(`integrations_${tid}`);
      let integrations = savedIntegrations ? JSON.parse(savedIntegrations) as IntegrationData[] : [];
      
      const existingIndex = integrations.findIndex(i => i.id === integration.id);
      
      if (existingIndex >= 0) {
        // Atualiza integração existente
        integrations[existingIndex] = completeIntegration;
      } else {
        // Adiciona nova integração
        integrations.push(completeIntegration);
      }
      
      localStorage.setItem(`integrations_${tid}`, JSON.stringify(integrations));
      this.integrationsCache.set(`${tid}_${integration.id}`, completeIntegration);
      return completeIntegration;
    }

    try {
      // Preparando dados para o formato da tabela
      const dbData = {
        id: completeIntegration.id,
        tenant_id: completeIntegration.tenantId,
        status: completeIntegration.status,
        credentials: completeIntegration.credentials,
        metadata: completeIntegration.metadata,
        last_sync: completeIntegration.lastSync,
        created_at: completeIntegration.createdAt,
        updated_at: completeIntegration.updatedAt
      };

      const { data, error } = await supabase
        .from('integrations')
        .upsert(dbData)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Converte de volta para o formato IntegrationData
        const savedIntegration: IntegrationData = {
          id: data.id as IntegrationType,
          tenantId: data.tenant_id,
          status: data.status as IntegrationStatus,
          credentials: data.credentials as Record<string, string>,
          metadata: data.metadata as Record<string, any> || {},
          lastSync: data.last_sync,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        this.integrationsCache.set(`${tid}_${integration.id}`, savedIntegration);
        return savedIntegration;
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
  public async deleteIntegration(integrationId: IntegrationType, tenantId?: string): Promise<boolean> {
    const tid = tenantId || this.tenantId;
    
    if (!tid) {
      throw new Error('Tenant ID não especificado');
    }

    if (!isSupabaseConfigured) {
      // Remove do localStorage
      const savedIntegrations = localStorage.getItem(`integrations_${tid}`);
      if (savedIntegrations) {
        let integrations = JSON.parse(savedIntegrations) as IntegrationData[];
        integrations = integrations.filter(i => i.id !== integrationId);
        localStorage.setItem(`integrations_${tid}`, JSON.stringify(integrations));
      }
      this.integrationsCache.delete(`${tid}_${integrationId}`);
      return true;
    }

    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('tenant_id', tid)
        .eq('id', integrationId);

      if (error) throw error;

      this.integrationsCache.delete(`${tid}_${integrationId}`);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir integração ${integrationId}:`, error);
      return false;
    }
  }

  /**
   * Verifica e atualiza o status de uma integração
   */
  public async updateIntegrationStatus(integrationId: IntegrationType, status: IntegrationStatus, tenantId?: string): Promise<boolean> {
    const tid = tenantId || this.tenantId;
    
    if (!tid) {
      throw new Error('Tenant ID não especificado');
    }

    const integration = await this.getIntegration(integrationId, tid);
    if (!integration) return false;

    integration.status = status;
    integration.updatedAt = new Date().toISOString();
    
    const result = await this.saveIntegration(integration, tid);
    return result !== null;
  }

  /**
   * Testa uma conexão de API com base nas credenciais fornecidas
   */
  public async testConnection(integrationId: IntegrationType, credentials: Record<string, string>): Promise<boolean> {
    const config = getIntegrationConfig(integrationId);
    if (!config) return false;

    // Implementação simulada - em produção, isso faria uma chamada real à API
    // baseada na configuração da integração
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simula sucesso se todas as credenciais necessárias estiverem presentes
        const allFieldsFilled = config.requiredFields.every(
          field => field.required ? !!credentials[field.name] : true
        );
        resolve(allFieldsFilled);
      }, 1000);
    });
  }

  /**
   * Retorna a configuração de uma integração
   */
  public getIntegrationConfig(integrationId: IntegrationType): IntegrationConfig | null {
    return getIntegrationConfig(integrationId);
  }
}

export const integrationManager = IntegrationManager.getInstance();
