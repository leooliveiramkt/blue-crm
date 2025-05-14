
import { useState } from 'react';
import { wbuyAffiliatesService } from '@/services/wbuy';
import { useWbuyIntegration } from './use-integration';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para gerenciar afiliados da Wbuy
 */
export const useWbuyAffiliates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkIntegration, handleError } = useWbuyIntegration();
  const { toast } = useToast();

  /**
   * Busca lista de afiliados
   */
  const getAffiliates = async (searchTerm?: string, page = 1, limit = 20, filters?: Record<string, any>) => {
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

  /**
   * Cria um novo afiliado
   */
  const createAffiliate = async (affiliateData: any) => {
    if (!affiliateData) {
      handleError(new Error('Dados do afiliado não informados'), 'Erro ao criar afiliado');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyAffiliatesService.createAffiliate(affiliateData);
      
      if (data) {
        toast({
          title: "Afiliado criado",
          description: "Afiliado criado com sucesso"
        });
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao criar afiliado');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Atualiza um afiliado existente
   */
  const updateAffiliate = async (affiliateId: string, affiliateData: any) => {
    if (!affiliateId || !affiliateData) {
      handleError(new Error('Dados do afiliado incompletos'), 'Erro ao atualizar afiliado');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyAffiliatesService.updateAffiliate(affiliateId, affiliateData);
      
      if (data) {
        toast({
          title: "Afiliado atualizado",
          description: "Afiliado atualizado com sucesso"
        });
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao atualizar afiliado');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Atualiza atributo de um afiliado
   */
  const updateAffiliateAttribute = async (affiliateId: string, attributeName: string, attributeValue: string) => {
    if (!affiliateId || !attributeName) {
      handleError(new Error('Dados incompletos para atualização'), 'Erro ao atualizar atributo');
      return false;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return false;
      }
      
      const result = await wbuyAffiliatesService.updateAffiliateAttribute(
        affiliateId, 
        attributeName, 
        attributeValue
      );
      
      if (result) {
        toast({
          title: "Atualização concluída",
          description: `Atributo ${attributeName} atualizado com sucesso.`
        });
        return true;
      } else {
        handleError(new Error('Falha na atualização do atributo'), 'Erro ao atualizar atributo');
        return false;
      }
    } catch (err: any) {
      handleError(err, 'Erro ao atualizar atributo');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

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
    getAffiliates,
    getAffiliateDetails,
    createAffiliate,
    updateAffiliate,
    updateAffiliateAttribute,
    getAffiliateCommissions
  };
};
