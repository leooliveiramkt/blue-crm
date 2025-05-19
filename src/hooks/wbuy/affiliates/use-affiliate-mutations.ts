
import { useState } from 'react';
import { wbuyAffiliatesService } from '@/services/wbuy';
import { useWbuyIntegration } from '../use-integration';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para gerenciar criação e atualização de afiliados Wbuy
 */
export const useAffiliateMutations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkIntegration, handleError } = useWbuyIntegration();
  const { toast } = useToast();

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

  return {
    isLoading,
    createAffiliate,
    updateAffiliate,
    updateAffiliateAttribute
  };
};
