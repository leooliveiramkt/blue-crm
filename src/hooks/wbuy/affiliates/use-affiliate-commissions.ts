
import { useState } from 'react';
import { wbuyAffiliatesService } from '@/services/wbuy';
import { useWbuyIntegration } from '../use-integration';

/**
 * Hook para gerenciar comissões de afiliados Wbuy
 */
export const useAffiliateCommissions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkIntegration, handleError } = useWbuyIntegration();

  /**
   * Busca comissões de um afiliado
   */
  const getAffiliateCommissions = async (affiliateId: string, startDate?: string, endDate?: string) => {
    if (!affiliateId) {
      handleError(new Error('ID do afiliado não informado'), 'Erro ao buscar comissões');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyAffiliatesService.getAffiliateCommissions(affiliateId, startDate, endDate);
    } catch (err: any) {
      handleError(err, 'Erro ao buscar comissões do afiliado');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getAffiliateCommissions
  };
};
