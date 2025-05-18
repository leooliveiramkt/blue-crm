
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "../core";
import { AffiliateCommissionParams } from "./types";

/**
 * Funções para gerenciar comissões de afiliados
 */
export class AffiliateCommissionsService {
  /**
   * Busca comissões de um afiliado
   * @param params Parâmetros da consulta
   * @returns Lista de comissões ou null em caso de erro
   */
  async getAffiliateCommissions(params: AffiliateCommissionParams) {
    try {
      const { affiliateId, startDate, endDate, page = 1, limit = 20 } = params;
      
      if (!affiliateId) {
        throw new Error('ID do afiliado não fornecido');
      }

      const queryParams: Record<string, string | number> = {
        page,
        limit
      };
      
      if (startDate) {
        queryParams.start_date = startDate;
      }
      
      if (endDate) {
        queryParams.end_date = endDate;
      }
      
      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.affiliate_commissions}/${affiliateId}`,
        'GET',
        undefined,
        queryParams
      );
    } catch (error) {
      console.error('Erro ao buscar comissões do afiliado:', error);
      throw error;
    }
  }
}

export const affiliateCommissionsService = new AffiliateCommissionsService();
