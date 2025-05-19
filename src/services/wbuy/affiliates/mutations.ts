
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "../core";
import { AffiliateData } from "./types";

/**
 * Funções para criar e atualizar afiliados
 */
export class AffiliateMutationsService {
  /**
   * Cria um novo afiliado
   * @param affiliateData Dados do afiliado
   * @returns Resultado da operação ou null em caso de erro
   */
  async createAffiliate(affiliateData: AffiliateData) {
    try {
      // Validação de dados do afiliado conforme documentação
      if (!affiliateData || typeof affiliateData !== 'object') {
        throw new Error('Dados do afiliado inválidos');
      }

      // Campos obrigatórios conforme documentação Wbuy
      const requiredFields = ['name', 'email'];
      const missingFields = requiredFields.filter(field => !affiliateData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
      }

      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.affiliates}`,
        'POST',
        affiliateData
      );
    } catch (error) {
      console.error('Erro ao criar afiliado:', error);
      throw error;
    }
  }

  /**
   * Atualiza um afiliado existente
   * @param affiliateId ID do afiliado
   * @param affiliateData Dados atualizados do afiliado
   * @returns Resultado da operação ou null em caso de erro
   */
  async updateAffiliate(affiliateId: string, affiliateData: AffiliateData) {
    try {
      if (!affiliateId) {
        throw new Error('ID do afiliado não fornecido');
      }

      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.affiliates}/${affiliateId}`,
        'PUT',
        affiliateData
      );
    } catch (error) {
      console.error('Erro ao atualizar afiliado:', error);
      throw error;
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
      if (!affiliateId || !attributeName) {
        throw new Error('ID do afiliado ou nome do atributo não fornecido');
      }

      return await wbuyApiCore.callApi(
        `/${wbuyConfig.endpoints.affiliates}/${affiliateId}/attributes`,
        'PUT',
        { name: attributeName, value: attributeValue }
      );
    } catch (error) {
      console.error('Erro ao atualizar atributo do afiliado:', error);
      throw error;
    }
  }
}

export const affiliateMutationsService = new AffiliateMutationsService();
