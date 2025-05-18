
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "../core";

/**
 * Funções para gerenciar status de afiliados
 */
export class AffiliateStatusService {
  /**
   * Desativa um afiliado
   * @param affiliateId ID do afiliado
   * @returns Resultado da operação ou null em caso de erro
   */
  async deactivateAffiliate(affiliateId: string) {
    try {
      if (!affiliateId) {
        throw new Error('ID do afiliado não fornecido');
      }

      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.affiliates}/${affiliateId}/deactivate`,
        'POST'
      );
    } catch (error) {
      console.error('Erro ao desativar afiliado:', error);
      throw error;
    }
  }
  
  /**
   * Ativa um afiliado
   * @param affiliateId ID do afiliado
   * @returns Resultado da operação ou null em caso de erro
   */
  async activateAffiliate(affiliateId: string) {
    try {
      if (!affiliateId) {
        throw new Error('ID do afiliado não fornecido');
      }

      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.affiliates}/${affiliateId}/activate`,
        'POST'
      );
    } catch (error) {
      console.error('Erro ao ativar afiliado:', error);
      throw error;
    }
  }
}

export const affiliateStatusService = new AffiliateStatusService();
