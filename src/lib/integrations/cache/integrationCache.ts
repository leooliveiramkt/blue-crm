
import { IntegrationType, IntegrationData } from '../types';

/**
 * Cache em memória para integrações
 */
class IntegrationCache {
  private cache: Map<string, Map<IntegrationType, IntegrationData>> = new Map();

  /**
   * Verifica se uma integração existe no cache
   */
  public has(tenantId: string, integrationId: IntegrationType): boolean {
    const tenantCache = this.cache.get(tenantId);
    return tenantCache ? tenantCache.has(integrationId) : false;
  }

  /**
   * Obtém uma integração do cache
   */
  public get(tenantId: string, integrationId: IntegrationType): IntegrationData | undefined {
    const tenantCache = this.cache.get(tenantId);
    return tenantCache ? tenantCache.get(integrationId) : undefined;
  }

  /**
   * Define ou atualiza uma integração no cache
   */
  public set(tenantId: string, integration: IntegrationData): void {
    if (!this.cache.has(tenantId)) {
      this.cache.set(tenantId, new Map());
    }
    
    const tenantCache = this.cache.get(tenantId)!;
    console.log(`[IntegrationCache] Armazenando ${integration.id} no cache para tenant ${tenantId}`);
    tenantCache.set(integration.id, {...integration});
  }

  /**
   * Remove uma integração do cache
   */
  public delete(tenantId: string, integrationId: IntegrationType): boolean {
    const tenantCache = this.cache.get(tenantId);
    return tenantCache ? tenantCache.delete(integrationId) : false;
  }

  /**
   * Limpa todo o cache para um tenant específico
   */
  public clearTenant(tenantId: string): boolean {
    return this.cache.delete(tenantId);
  }

  /**
   * Limpa todo o cache
   */
  public clear(): void {
    this.cache.clear();
  }
  
  /**
   * Armazena múltiplas integrações no cache
   */
  public setMany(tenantId: string, integrations: IntegrationData[]): void {
    integrations.forEach(integration => this.set(tenantId, integration));
  }
  
  /**
   * Retorna todas as integrações de um tenant
   */
  public getAllForTenant(tenantId: string): IntegrationData[] {
    const tenantCache = this.cache.get(tenantId);
    return tenantCache ? Array.from(tenantCache.values()) : [];
  }
}

export const integrationCache = new IntegrationCache();
