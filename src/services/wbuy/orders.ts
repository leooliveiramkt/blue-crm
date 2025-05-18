
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "./core";

/**
 * Serviço para gerenciar pedidos da Wbuy
 * Implementado conforme documentação: https://documenter.getpostman.com/view/4141833/RWTsquyN
 */
export class WbuyOrdersService {
  /**
   * Busca dados de um pedido específico
   * @param orderCode Código do pedido
   * @returns Dados do pedido ou null em caso de erro
   */
  async getOrderData(orderCode: string) {
    try {
      if (!orderCode) {
        throw new Error('Código do pedido não fornecido');
      }

      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.orders}/${orderCode}`
      );
    } catch (error) {
      console.error('Erro ao buscar dados do pedido:', error);
      throw error;
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
      const queryParams: Record<string, string | number> = {
        page,
        limit
      };
      
      if (filters) {
        // Adicionar filtros à consulta
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'startDate' || key === 'start_date') {
              queryParams['start_date'] = String(value);
            } else if (key === 'endDate' || key === 'end_date') {
              queryParams['end_date'] = String(value);
            } else {
              queryParams[key] = String(value);
            }
          }
        });
      }
      
      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.orders}`,
        'GET',
        undefined,
        queryParams
      );
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }
  }

  /**
   * Cria um novo pedido
   * @param orderData Dados do pedido
   * @returns Resultado da operação ou null em caso de erro
   */
  async createOrder(orderData: any) {
    try {
      // Validação básica dos dados do pedido
      if (!orderData || typeof orderData !== 'object') {
        throw new Error('Dados do pedido inválidos');
      }

      // Campos obrigatórios conforme documentação Wbuy
      const requiredFields = ['customer', 'items', 'payment'];
      const missingFields = requiredFields.filter(field => !orderData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
      }

      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.orders}`,
        'POST',
        orderData
      );
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
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
      if (!orderId) {
        throw new Error('ID do pedido não fornecido');
      }

      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.orders}/${orderId}`,
        'PUT',
        orderData
      );
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw error;
    }
  }
  
  /**
   * Cancela um pedido existente
   * @param orderId ID do pedido
   * @param reason Motivo do cancelamento (opcional)
   * @returns Resultado da operação ou null em caso de erro
   */
  async cancelOrder(orderId: string, reason?: string) {
    try {
      if (!orderId) {
        throw new Error('ID do pedido não fornecido');
      }

      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.orders}/${orderId}/cancel`,
        'POST',
        reason ? { reason } : undefined
      );
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      throw error;
    }
  }
  
  /**
   * Busca histórico de um pedido
   * @param orderId ID do pedido
   * @returns Histórico do pedido ou null em caso de erro
   */
  async getOrderHistory(orderId: string) {
    try {
      if (!orderId) {
        throw new Error('ID do pedido não fornecido');
      }

      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.orders}/${orderId}/history`
      );
    } catch (error) {
      console.error('Erro ao buscar histórico do pedido:', error);
      throw error;
    }
  }
}

export const wbuyOrdersService = new WbuyOrdersService();
