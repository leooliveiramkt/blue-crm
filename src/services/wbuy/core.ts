
import { wbuyConfig } from "@/config/wbuy";
import { integrationManager } from "@/lib/integrations/integrationManager";

/**
 * Funções básicas para acesso à API Wbuy
 */
export class WbuyApiCore {
  /**
   * Obtém as credenciais de integração Wbuy do tenant atual
   * @returns Credenciais da API Wbuy ou credenciais padrão
   */
  async getCredentials(): Promise<{ apiKey: string; domain: string }> {
    try {
      const integration = await integrationManager.getIntegration('wbuy');
      
      if (integration && integration.status === 'connected') {
        const apiKey = integration.credentials.apiKey;
        const domain = integration.credentials.domain;

        if (apiKey && domain) {
          return { apiKey, domain };
        }
      }

      // Retorna as credenciais padrão definidas no config
      console.log('Usando credenciais padrão para Wbuy API');
      return { 
        apiKey: wbuyConfig.api_token, 
        domain: wbuyConfig.api_url 
      };
    } catch (error) {
      console.error('Erro ao obter credenciais Wbuy, usando padrão:', error);
      return { 
        apiKey: wbuyConfig.api_token, 
        domain: wbuyConfig.api_url 
      };
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
    const { apiKey, domain } = credentials;
    const url = `${domain}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

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

      console.log(`Chamando Wbuy API: ${url}`);
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
}

export const wbuyApiCore = new WbuyApiCore();
