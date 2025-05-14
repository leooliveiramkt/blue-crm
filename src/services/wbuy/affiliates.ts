
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "./core";

/**
 * Serviço para gerenciar afiliados da Wbuy
 */
export class WbuyAffiliatesService {
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
      
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.affiliates}${queryParams}`);
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
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.affiliate_detail}/${affiliateId}`);
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
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.create_affiliate}`, 'POST', affiliateData);
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
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.update_affiliate}/${affiliateId}`, 'PUT', affiliateData);
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
      return await wbuyApiCore.callApi(
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
      
      return await wbuyApiCore.callApi(`/${wbuyConfig.endpoints.affiliate_commissions}/${affiliateId}${queryParams}`);
    } catch (error) {
      console.error('Erro ao buscar comissões do afiliado:', error);
      return null;
    }
  }
}

export const wbuyAffiliatesService = new WbuyAffiliatesService();
