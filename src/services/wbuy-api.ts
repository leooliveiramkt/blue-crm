
import { integrationManager } from "@/lib/integrations/integrationManager";

/**
 * Gerencia as chamadas à API da Wbuy
 */
export class WbuyApiService {
  /**
   * Obtém as credenciais de integração Wbuy do tenant atual
   * @returns Credenciais da API Wbuy ou null se não configurado
   */
  async getCredentials(): Promise<{ apiKey: string; domain: string } | null> {
    try {
      const integration = await integrationManager.getIntegration('wbuy');
      
      if (!integration || integration.status !== 'connected') {
        console.error('Integração Wbuy não configurada ou desconectada');
        return null;
      }

      const apiKey = integration.credentials.apiKey;
      const domain = integration.credentials.domain;

      if (!apiKey || !domain) {
        console.error('Credenciais Wbuy incompletas');
        return null;
      }

      return { apiKey, domain };
    } catch (error) {
      console.error('Erro ao obter credenciais Wbuy:', error);
      return null;
    }
  }

  /**
   * Faz uma chamada à API Wbuy
   * @param endpoint Endpoint da API (ex: /orders, /affiliates)
   * @param method Método HTTP
   * @param body Corpo da requisição (opcional)
   * @returns Dados da resposta ou null em caso de erro
   */
  async callApi<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any): Promise<T | null> {
    const credentials = await this.getCredentials();
    
    if (!credentials) {
      throw new Error('Credenciais Wbuy não disponíveis');
    }

    const { apiKey, domain } = credentials;
    const url = `${domain}${endpoint}`;

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      };

      const options: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      };

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Erro na API Wbuy: ${response.status} ${response.statusText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`Erro na chamada à API Wbuy (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Busca dados de um pedido específico
   * @param orderCode Código do pedido
   * @returns Dados do pedido ou null em caso de erro
   */
  async getOrderData(orderCode: string) {
    try {
      return await this.callApi(`/api/orders/${orderCode}`);
    } catch (error) {
      console.error('Erro ao buscar dados do pedido:', error);
      return null;
    }
  }

  /**
   * Busca lista de afiliados
   * @param searchTerm Termo de busca (opcional)
   * @returns Lista de afiliados ou null em caso de erro
   */
  async getAffiliates(searchTerm?: string) {
    try {
      const endpoint = searchTerm 
        ? `/api/affiliates?search=${encodeURIComponent(searchTerm)}` 
        : '/api/affiliates';
      
      return await this.callApi(endpoint);
    } catch (error) {
      console.error('Erro ao buscar afiliados:', error);
      return null;
    }
  }

  /**
   * Atualiza atributo de um afiliado
   * @param affiliateId ID do afiliado
   * @param attributeName Nome do atributo
   * @param attributeValue Novo valor do atributo
   * @returns Resultado da operação ou null em caso de erro
   */
  async updateAffiliateAttribute(affiliateId: string, attributeName: string, attributeValue: string) {
    try {
      return await this.callApi(
        `/api/affiliates/${affiliateId}/attributes`,
        'PUT',
        { name: attributeName, value: attributeValue }
      );
    } catch (error) {
      console.error('Erro ao atualizar atributo do afiliado:', error);
      return null;
    }
  }
}

export const wbuyApiService = new WbuyApiService();
