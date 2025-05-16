
import { IntegrationType, IntegrationData } from '../types';

/**
 * Cache em memória para integrações
 */
class IntegrationCache {
  private cache: Map<string, Map<IntegrationType, IntegrationData>> = new Map();
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutos em milisegundos
  private cacheTimestamps: Map<string, Map<IntegrationType, number>> = new Map();

  /**
   * Verifica se uma integração existe no cache e se ainda é válida
   */
  public has(tenantId: string, integrationId: IntegrationType): boolean {
    const tenantCache = this.cache.get(tenantId);
    if (!tenantCache) return false;
    
    // Verificar se integração existe no cache
    const hasIntegration = tenantCache.has(integrationId);
    if (!hasIntegration) return false;
    
    // Verificar se o cache está expirado
    const timestamps = this.cacheTimestamps.get(tenantId);
    if (!timestamps) return false;
    
    const timestamp = timestamps.get(integrationId);
    if (!timestamp) return false;
    
    const now = Date.now();
    const isExpired = now - timestamp > this.cacheTTL;
    
    if (isExpired) {
      console.log(`[IntegrationCache] Cache expirado para ${integrationId} do tenant ${tenantId}`);
      // Remover integração expirada do cache
      tenantCache.delete(integrationId);
      timestamps.delete(integrationId);
      return false;
    }
    
    return true;
  }

  /**
   * Obtém uma integração do cache
   */
  public get(tenantId: string, integrationId: IntegrationType): IntegrationData | undefined {
    if (!this.has(tenantId, integrationId)) return undefined;
    
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
    
    if (!this.cacheTimestamps.has(tenantId)) {
      this.cacheTimestamps.set(tenantId, new Map());
    }
    
    const tenantCache = this.cache.get(tenantId)!;
    const timestamps = this.cacheTimestamps.get(tenantId)!;
    
    console.log(`[IntegrationCache] Armazenando ${integration.id} no cache para tenant ${tenantId}`);
    tenantCache.set(integration.id, {...integration});
    timestamps.set(integration.id, Date.now());
  }

  /**
   * Remove uma integração do cache
   */
  public delete(tenantId: string, integrationId: IntegrationType): boolean {
    const tenantCache = this.cache.get(tenantId);
    const timestamps = this.cacheTimestamps.get(tenantId);
    
    let deleted = false;
    if (tenantCache) {
      deleted = tenantCache.delete(integrationId);
    }
    
    if (timestamps) {
      timestamps.delete(integrationId);
    }
    
    return deleted;
  }

  /**
   * Limpa todo o cache para um tenant específico
   */
  public clearTenant(tenantId: string): boolean {
    const deleted = this.cache.delete(tenantId);
    this.cacheTimestamps.delete(tenantId);
    return deleted;
  }

  /**
   * Limpa todo o cache
   */
  public clear(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
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
    if (!tenantCache) return [];
    
    // Filtrar integrações expiradas
    const validIntegrations: IntegrationData[] = [];
    const timestamps = this.cacheTimestamps.get(tenantId);
    
    if (!timestamps) return [];
    
    const now = Date.now();
    
    for (const [integrationId, integration] of tenantCache.entries()) {
      const timestamp = timestamps.get(integrationId as IntegrationType);
      if (!timestamp) continue;
      
      const isExpired = now - timestamp > this.cacheTTL;
      if (!isExpired) {
        validIntegrations.push(integration);
      } else {
        // Remover integração expirada do cache
        tenantCache.delete(integrationId as IntegrationType);
        timestamps.delete(integrationId as IntegrationType);
      }
    }
    
    return validIntegrations;
  }
  
  /**
   * Configura o tempo de vida (TTL) do cache
   * @param ttlMs Tempo de vida em milisegundos
   */
  public setTTL(ttlMs: number): void {
    if (ttlMs > 0) {
      this.cacheTTL = ttlMs;
    }
  }
}

export const integrationCache = new IntegrationCache();
