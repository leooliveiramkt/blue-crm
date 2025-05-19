
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "./core";

/**
 * Serviço para gerenciar produtos da Wbuy
 */
export class WbuyProductsService {
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
      
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.products}${queryParams}`);
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
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.product_detail}/${productId}`);
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
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.categories}`);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return null;
    }
  }
}

export const wbuyProductsService = new WbuyProductsService();
