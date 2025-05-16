
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "../core";
import { AffiliateFilters } from "./types";

/**
 * Funções para buscar afiliados e suas informações
 */
export class AffiliateSearchService {
  /**
   * Busca lista de afiliados
   * @param searchTerm Termo de busca (opcional)
   * @param page Número da página
   * @param limit Itens por página
   * @param filters Filtros adicionais
   * @returns Lista de afiliados ou null em caso de erro
   */
  async getAffiliates(searchTerm?: string, page = 1, limit = 20, filters?: AffiliateFilters) {
    try {
      const queryParams: Record<string, string | number> = {
        page,
        limit
      };
      
      if (searchTerm) {
        queryParams.search = searchTerm;
      }
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams[key] = String(value);
          }
        });
      }
      
      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.affiliates}`,
        'GET',
        undefined,
        queryParams
      );
    } catch (error) {
      console.error('Erro ao buscar afiliados:', error);
      throw error;
    }
  }

  /**
   * Busca detalhes de um afiliado específico
   * @param affiliateId ID do afiliado
   * @returns Detalhes do afiliado ou null em caso de erro
   */
  async getAffiliateDetails(affiliateId: string) {
    try {
      if (!affiliateId) {
        throw new Error('ID do afiliado não fornecido');
      }

      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.affiliate_detail}/${affiliateId}`
      );
    } catch (error) {
      console.error('Erro ao buscar detalhes do afiliado:', error);
      throw error;
    }
  }
}

export const affiliateSearchService = new AffiliateSearchService();
