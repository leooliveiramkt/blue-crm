
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "./core";

/**
 * Serviço para gerenciar relatórios da Wbuy
 */
export class WbuyReportsService {
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
      
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.sales_report}${queryParams}`);
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
      
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.affiliates_report}${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar relatório de afiliados:', error);
      return null;
    }
  }
}

export const wbuyReportsService = new WbuyReportsService();
