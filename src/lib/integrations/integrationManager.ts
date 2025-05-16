import { IntegrationType, IntegrationData, IntegrationStatus, IntegrationConfig } from './types';
import { getIntegrationConfig } from './integrationConfigs';
import { integrationStorage } from './storage/integrationStorage';
import { connectionService } from './services/connectionService';
import { integrationCache } from './cache/integrationCache';

/**
 * Gerenciador centralizado de integrações API
 */
class IntegrationManager {
  private static instance: IntegrationManager;
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

    try {
      const integrations = await integrationStorage.loadIntegrations(tid);
      // Atualiza o cache com as integrações carregadas
      integrationCache.setMany(tid, integrations);
      return integrations;
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
    if (integrationCache.has(tid, integrationId)) {
      return integrationCache.get(tid, integrationId) || null;
    }

    try {
      const integration = await integrationStorage.getIntegration(integrationId, tid);
      if (integration) {
        integrationCache.set(tid, integration);
      }
      return integration;
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
      console.error('[IntegrationManager] Erro: Tenant ID não especificado');
      throw new Error('Tenant ID não especificado');
    }

    if (!integration.id) {
      console.error('[IntegrationManager] Erro: ID da integração não especificado');
      throw new Error('ID da integração não especificado');
    }

    console.log(`[IntegrationManager] Salvando integração ${integration.id} para tenant ${tid}`);

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

    try {
      console.log(`[IntegrationManager] Iniciando salvamento da integração ${integration.id}`);
      const savedIntegration = await integrationStorage.saveIntegration(completeIntegration);
      
      if (savedIntegration) {
        console.log(`[IntegrationManager] Integração ${integration.id} salva com sucesso`);
        integrationCache.set(tid, savedIntegration);
      } else {
        console.error(`[IntegrationManager] Falha ao salvar integração ${integration.id}`);
      }
      
      return savedIntegration;
    } catch (error) {
      console.error(`[IntegrationManager] Erro ao salvar integração ${integration.id}:`, error);
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

    try {
      const result = await integrationStorage.deleteIntegration(integrationId, tid);
      if (result) {
        integrationCache.delete(tid, integrationId);
      }
      return result;
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
    return connectionService.testConnection(integrationId, credentials);
  }

  /**
   * Retorna a configuração de uma integração
   */
  public getIntegrationConfig(integrationId: IntegrationType): IntegrationConfig | null {
    return getIntegrationConfig(integrationId);
  }
}

export const integrationManager = IntegrationManager.getInstance();
