
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "./core";

/**
 * Serviço para gerenciar leads da Wbuy
 */
export class WbuyLeadsService {
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
      
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.leads}${queryParams}`);
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
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.lead_detail}/${leadId}`);
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
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.create_lead}`, 'POST', leadData);
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
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.update_lead}/${leadId}`, 'PUT', leadData);
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      return null;
    }
  }
}

export const wbuyLeadsService = new WbuyLeadsService();
