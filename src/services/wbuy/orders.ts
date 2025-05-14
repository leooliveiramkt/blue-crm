
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "./core";

/**
 * Serviço para gerenciar pedidos da Wbuy
 */
export class WbuyOrdersService {
  /**
   * Busca dados de um pedido específico
   * @param orderCode Código do pedido
   * @returns Dados do pedido ou null em caso de erro
   */
  async getOrderData(orderCode: string) {
    try {
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.order_detail}/${orderCode}`);
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
      
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.orders}${queryParams}`);
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
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.create_order}`, 'POST', orderData);
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
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.update_order}/${orderId}`, 'PUT', orderData);
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      return null;
    }
  }
}

export const wbuyOrdersService = new WbuyOrdersService();
