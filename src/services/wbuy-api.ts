
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

  // ====== PRODUTOS ======

  /**
   * Busca lista de produtos
   * @param page Número da página
   * @param limit Itens por página
   * @param filters Filtros adicionais
   * @returns Lista de produtos ou null em caso de erro
   */
  async getProducts(page = 1, limit = 20, filters?: Record<string, any>) {
    try {
      let queryParams = `?page=${page}&limit=${limit}`;
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams += `&${key}=${encodeURIComponent(String(value))}`;
          }
        });
      }
      
      return await this.callApi(`/${wbuyConfig.endpoints.products}${queryParams}`);
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

  // ====== PEDIDOS ======

  /**
   * Busca dados de um pedido específico
   * @param orderCode Código do pedido
   * @returns Dados do pedido ou null em caso de erro
   */
  async getOrderData(orderCode: string) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.order_detail}/${orderCode}`);
    } catch (error) {
      console.error('Erro ao buscar dados do pedido:', error);
      return null;
    }
  }

  /**
   * Busca lista de pedidos
   * @param page Número da página
   * @param limit Itens por página
   * @param filters Filtros adicionais (status, data, etc)
   * @returns Lista de pedidos ou null em caso de erro
   */
  async getOrders(page = 1, limit = 20, filters?: Record<string, any>) {
    try {
      let queryParams = `?page=${page}&limit=${limit}`;
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams += `&${key}=${encodeURIComponent(String(value))}`;
          }
        });
      }
      
      return await this.callApi(`/${wbuyConfig.endpoints.orders}${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return null;
    }
  }

  /**
   * Cria um novo pedido
   * @param orderData Dados do pedido
   * @returns Resultado da operação ou null em caso de erro
   */
  async createOrder(orderData: any) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.create_order}`, 'POST', orderData);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return null;
    }
  }

  /**
   * Atualiza um pedido existente
   * @param orderId ID do pedido
   * @param orderData Dados atualizados do pedido
   * @returns Resultado da operação ou null em caso de erro
   */
  async updateOrder(orderId: string, orderData: any) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.update_order}/${orderId}`, 'PUT', orderData);
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      return null;
    }
  }

  // ====== AFILIADOS ======

  /**
   * Busca lista de afiliados
   * @param searchTerm Termo de busca (opcional)
   * @param page Número da página
   * @param limit Itens por página
   * @param filters Filtros adicionais
   * @returns Lista de afiliados ou null em caso de erro
   */
  async getAffiliates(searchTerm?: string, page = 1, limit = 20, filters?: Record<string, any>) {
    try {
      let queryParams = `?page=${page}&limit=${limit}`;
      
      if (searchTerm) {
        queryParams += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams += `&${key}=${encodeURIComponent(String(value))}`;
          }
        });
      }
      
      return await this.callApi(`/${wbuyConfig.endpoints.affiliates}${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar afiliados:', error);
      return null;
    }
  }

  /**
   * Busca detalhes de um afiliado específico
   * @param affiliateId ID do afiliado
   * @returns Detalhes do afiliado ou null em caso de erro
   */
  async getAffiliateDetails(affiliateId: string) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.affiliate_detail}/${affiliateId}`);
    } catch (error) {
      console.error('Erro ao buscar detalhes do afiliado:', error);
      return null;
    }
  }

  /**
   * Cria um novo afiliado
   * @param affiliateData Dados do afiliado
   * @returns Resultado da operação ou null em caso de erro
   */
  async createAffiliate(affiliateData: any) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.create_affiliate}`, 'POST', affiliateData);
    } catch (error) {
      console.error('Erro ao criar afiliado:', error);
      return null;
    }
  }

  /**
   * Atualiza um afiliado existente
   * @param affiliateId ID do afiliado
   * @param affiliateData Dados atualizados do afiliado
   * @returns Resultado da operação ou null em caso de erro
   */
  async updateAffiliate(affiliateId: string, affiliateData: any) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.update_affiliate}/${affiliateId}`, 'PUT', affiliateData);
    } catch (error) {
      console.error('Erro ao atualizar afiliado:', error);
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
        `/${wbuyConfig.endpoints.affiliates}/${affiliateId}/attributes`,
        'PUT',
        { name: attributeName, value: attributeValue }
      );
    } catch (error) {
      console.error('Erro ao atualizar atributo do afiliado:', error);
      return null;
    }
  }

  /**
   * Busca comissões de um afiliado
   * @param affiliateId ID do afiliado
   * @param startDate Data inicial
   * @param endDate Data final
   * @returns Lista de comissões ou null em caso de erro
   */
  async getAffiliateCommissions(affiliateId: string, startDate?: string, endDate?: string) {
    try {
      let queryParams = '';
      
      if (startDate || endDate) {
        queryParams = '?';
        if (startDate) queryParams += `start_date=${encodeURIComponent(startDate)}`;
        if (endDate) {
          queryParams += startDate ? `&end_date=${encodeURIComponent(endDate)}` : `end_date=${encodeURIComponent(endDate)}`;
        }
      }
      
      return await this.callApi(`/${wbuyConfig.endpoints.affiliate_commissions}/${affiliateId}${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar comissões do afiliado:', error);
      return null;
    }
  }

  // ====== LEADS ======

  /**
   * Busca lista de leads
   * @param page Número da página
   * @param limit Itens por página
   * @param filters Filtros adicionais
   * @returns Lista de leads ou null em caso de erro
   */
  async getLeads(page = 1, limit = 20, filters?: Record<string, any>) {
    try {
      let queryParams = `?page=${page}&limit=${limit}`;
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams += `&${key}=${encodeURIComponent(String(value))}`;
          }
        });
      }
      
      return await this.callApi(`/${wbuyConfig.endpoints.leads}${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      return null;
    }
  }

  /**
   * Busca detalhes de um lead específico
   * @param leadId ID do lead
   * @returns Detalhes do lead ou null em caso de erro
   */
  async getLeadDetails(leadId: string) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.lead_detail}/${leadId}`);
    } catch (error) {
      console.error('Erro ao buscar detalhes do lead:', error);
      return null;
    }
  }

  /**
   * Cria um novo lead
   * @param leadData Dados do lead
   * @returns Resultado da operação ou null em caso de erro
   */
  async createLead(leadData: any) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.create_lead}`, 'POST', leadData);
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      return null;
    }
  }

  /**
   * Atualiza um lead existente
   * @param leadId ID do lead
   * @param leadData Dados atualizados do lead
   * @returns Resultado da operação ou null em caso de erro
   */
  async updateLead(leadId: string, leadData: any) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.update_lead}/${leadId}`, 'PUT', leadData);
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      return null;
    }
  }

  // ====== USUÁRIOS ======

  /**
   * Busca lista de usuários
   * @param page Número da página
   * @param limit Itens por página
   * @returns Lista de usuários ou null em caso de erro
   */
  async getUsers(page = 1, limit = 20) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.users}?page=${page}&limit=${limit}`);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return null;
    }
  }

  /**
   * Busca detalhes de um usuário específico
   * @param userId ID do usuário
   * @returns Detalhes do usuário ou null em caso de erro
   */
  async getUserDetails(userId: string) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.user_detail}/${userId}`);
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
      return null;
    }
  }

  // ====== RELATÓRIOS ======

  /**
   * Busca relatório de vendas
   * @param startDate Data inicial
   * @param endDate Data final
   * @param filters Filtros adicionais
   * @returns Dados do relatório ou null em caso de erro
   */
  async getSalesReport(startDate: string, endDate: string, filters?: Record<string, any>) {
    try {
      let queryParams = `?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`;
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams += `&${key}=${encodeURIComponent(String(value))}`;
          }
        });
      }
      
      return await this.callApi(`/${wbuyConfig.endpoints.sales_report}${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar relatório de vendas:', error);
      return null;
    }
  }

  /**
   * Busca relatório de afiliados
   * @param startDate Data inicial
   * @param endDate Data final
   * @param filters Filtros adicionais
   * @returns Dados do relatório ou null em caso de erro
   */
  async getAffiliatesReport(startDate: string, endDate: string, filters?: Record<string, any>) {
    try {
      let queryParams = `?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`;
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams += `&${key}=${encodeURIComponent(String(value))}`;
          }
        });
      }
      
      return await this.callApi(`/${wbuyConfig.endpoints.affiliates_report}${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar relatório de afiliados:', error);
      return null;
    }
  }

  // ====== CONFIGURAÇÕES ======

  /**
   * Busca configurações do sistema
   * @returns Configurações ou null em caso de erro
   */
  async getSettings() {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.settings}`);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return null;
    }
  }

  // ====== NOTIFICAÇÕES ======

  /**
   * Busca notificações
   * @param page Número da página
   * @param limit Itens por página
   * @returns Lista de notificações ou null em caso de erro
   */
  async getNotifications(page = 1, limit = 20) {
    try {
      return await this.callApi(`/${wbuyConfig.endpoints.notifications}?page=${page}&limit=${limit}`);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return null;
    }
  }
}

export const wbuyApiService = new WbuyApiService();
