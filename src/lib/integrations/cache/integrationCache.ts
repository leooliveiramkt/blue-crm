
import { IntegrationType, IntegrationData } from '../types';

/**
 * Classe para gerenciar o cache de integrações
 */
export class IntegrationCache {
  private cache: Map<string, IntegrationData> = new Map();

  /**
   * Obter uma integração do cache
   */
  public get(tenantId: string, integrationId: IntegrationType): IntegrationData | undefined {
    return this.cache.get(this.getCacheKey(tenantId, integrationId));
  }

  /**
   * Verificar se uma integração existe no cache
   */
  public has(tenantId: string, integrationId: IntegrationType): boolean {
    return this.cache.has(this.getCacheKey(tenantId, integrationId));
  }

  /**
   * Adicionar uma integração ao cache
   */
  public set(tenantId: string, integrationData: IntegrationData): void {
    this.cache.set(this.getCacheKey(tenantId, integrationData.id), integrationData);
  }

  /**
   * Adicionar múltiplas integrações ao cache
   */
  public setMany(tenantId: string, integrations: IntegrationData[]): void {
    integrations.forEach(integration => {
      this.set(tenantId, integration);
    });
  }

  /**
   * Remover uma integração do cache
   */
  public delete(tenantId: string, integrationId: IntegrationType): void {
    this.cache.delete(this.getCacheKey(tenantId, integrationId));
  }

  /**
   * Limpar todo o cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Gerar chave única para o cache
   */
  private getCacheKey(tenantId: string, integrationId: IntegrationType): string {
    return `${tenantId}_${integrationId}`;
  }
}

export const integrationCache = new IntegrationCache();
