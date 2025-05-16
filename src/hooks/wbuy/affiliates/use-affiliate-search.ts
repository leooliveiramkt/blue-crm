
import { useState } from 'react';
import { wbuyAffiliatesService } from '@/services/wbuy';
import { useWbuyIntegration } from '../use-integration';
import { AffiliateFilters } from './types';

/**
 * Hook para buscar afiliados Wbuy
 */
export const useAffiliateSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkIntegration, handleError } = useWbuyIntegration();

  /**
   * Busca lista de afiliados
   */
  const getAffiliates = async (searchTerm?: string, page = 1, limit = 20, filters?: AffiliateFilters) => {
    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyAffiliatesService.getAffiliates(searchTerm, page, limit, filters);
    } catch (err: any) {
      handleError(err, 'Erro ao buscar afiliados');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca detalhes de um afiliado específico
   */
  const getAffiliateDetails = async (affiliateId: string) => {
    if (!affiliateId) {
      handleError(new Error('ID do afiliado não informado'), 'Erro ao buscar afiliado');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyAffiliatesService.getAffiliateDetails(affiliateId);
    } catch (err: any) {
      handleError(err, 'Erro ao buscar detalhes do afiliado');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getAffiliates,
    getAffiliateDetails
  };
};
