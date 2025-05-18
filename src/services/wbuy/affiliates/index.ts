
import { affiliateSearchService } from "./search";
import { affiliateMutationsService } from "./mutations";
import { affiliateCommissionsService } from "./commissions";
import { affiliateStatusService } from "./status";

/**
 * Serviço para gerenciar afiliados da Wbuy
 * Implementado conforme documentação: https://documenter.getpostman.com/view/4141833/RWTsquyN
 */
export class WbuyAffiliatesService {
  // Funções de busca
  getAffiliates = affiliateSearchService.getAffiliates.bind(affiliateSearchService);
  getAffiliateDetails = affiliateSearchService.getAffiliateDetails.bind(affiliateSearchService);
  
  // Funções de mutação
  createAffiliate = affiliateMutationsService.createAffiliate.bind(affiliateMutationsService);
  updateAffiliate = affiliateMutationsService.updateAffiliate.bind(affiliateMutationsService);
  updateAffiliateAttribute = affiliateMutationsService.updateAffiliateAttribute.bind(affiliateMutationsService);
  
  // Funções de comissões
  getAffiliateCommissions = affiliateCommissionsService.getAffiliateCommissions.bind(affiliateCommissionsService);
  
  // Funções de status
  activateAffiliate = affiliateStatusService.activateAffiliate.bind(affiliateStatusService);
  deactivateAffiliate = affiliateStatusService.deactivateAffiliate.bind(affiliateStatusService);
}

export const wbuyAffiliatesService = new WbuyAffiliatesService();

// Re-exportar tipos para facilitar o uso
export * from "./types";
