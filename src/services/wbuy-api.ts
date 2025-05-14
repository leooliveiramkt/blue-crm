
import { wbuyConfig } from "@/config/wbuy";
import { integrationManager } from "@/lib/integrations/integrationManager";

/**
 * Gerencia as chamadas à API da Wbuy
 */
export class WbuyApiService {
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

  /**
   * Busca dados de um pedido específico
   * @param orderCode Código do pedido
   * @returns Dados do pedido ou null em caso de erro
   */
  async getOrderData(orderCode: string) {
    try {
      return await this.callApi(`/orders/${orderCode}`);
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
        ? `/affiliates?search=${encodeURIComponent(searchTerm)}` 
        : '/affiliates';
      
      return await this.callApi(endpoint);
    } catch (error) {
      console.error('Erro ao buscar afiliados:', error);
      return null;
    }
  }

  /**
   * Busca lista de produtos
   * @param page Número da página
   * @param limit Itens por página
   * @returns Lista de produtos ou null em caso de erro
   */
  async getProducts(page = 1, limit = 20) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.products}?page=${page}&limit=${limit}`);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return null;
    }
  }

  /**
   * Busca detalhes de um produto específico
   * @param productId ID do produto
   * @returns Detalhes do produto ou null em caso de erro
   */
  async getProductDetails(productId: string) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.product_detail}/${productId}`);
    } catch (error) {
      console.error('Erro ao buscar detalhes do produto:', error);
      return null;
    }
  }

  /**
   * Busca categorias de produtos
   * @returns Lista de categorias ou null em caso de erro
   */
  async getCategories() {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.categories}`);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
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
        `/affiliates/${affiliateId}/attributes`,
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
