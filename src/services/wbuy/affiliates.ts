
import { wbuyConfig } from "@/config/wbuy";
import { wbuyApiCore } from "./core";

/**
 * Serviço para gerenciar afiliados da Wbuy
 * Implementado conforme documentação: https://documenter.getpostman.com/view/4141833/RWTsquyN
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
        `/${wbuyConfig.endpoints.affiliateDetail}/${affiliateId}`
      );
    } catch (error) {
      console.error('Erro ao buscar detalhes do afiliado:', error);
      throw error;
    }
  }

  /**
   * Cria um novo afiliado
   * @param affiliateData Dados do afiliado
   * @returns Resultado da operação ou null em caso de erro
   */
  async createAffiliate(affiliateData: any) {
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
  async updateAffiliate(affiliateId: string, affiliateData: any) {
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

  /**
   * Busca comissões de um afiliado
   * @param affiliateId ID do afiliado
   * @param startDate Data inicial (formato YYYY-MM-DD)
   * @param endDate Data final (formato YYYY-MM-DD)
   * @param page Número da página
   * @param limit Itens por página
   * @returns Lista de comissões ou null em caso de erro
   */
  async getAffiliateCommissions(
    affiliateId: string, 
    startDate?: string, 
    endDate?: string,
    page = 1,
    limit = 20
  ) {
    try {
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
        `/${wbuyConfig.endpoints.affiliateCommissions}/${affiliateId}`,
        'GET',
        undefined,
        queryParams
      );
    } catch (error) {
      console.error('Erro ao buscar comissões do afiliado:', error);
      throw error;
    }
  }
  
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

export const wbuyAffiliatesService = new WbuyAffiliatesService();
