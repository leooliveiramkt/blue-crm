
import { useState } from 'react';
import { wbuyApiService } from '@/services/wbuy-api';
import { useToast } from './use-toast';
import { integrationManager } from '@/lib/integrations/integrationManager';

export const useWbuyApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Verifica se a integração com a Wbuy está configurada
   */
  const checkIntegration = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const integration = await integrationManager.getIntegration('wbuy');
      const isConfigured = integration !== null && integration.status === 'connected';
      
      if (!isConfigured) {
        setError('Integração com Wbuy não configurada ou desconectada');
        toast({
          title: "Configuração necessária",
          description: "Integração com Wbuy não está configurada. Acesse as configurações de integração.",
          variant: "destructive"
        });
      }
      
      return isConfigured;
    } catch (err: any) {
      setError(err.message || 'Erro ao verificar integração com Wbuy');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca dados de um pedido específico
   */
  const getOrderData = async (orderCode: string) => {
    if (!orderCode.trim()) {
      setError('Código do pedido não informado');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getOrderData(orderCode);
      return data;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar dados do pedido');
      toast({
        title: "Erro na requisição",
        description: `Falha ao buscar dados do pedido: ${err.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca lista de afiliados
   */
  const getAffiliates = async (searchTerm?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getAffiliates(searchTerm);
      return data;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar afiliados');
      toast({
        title: "Erro na requisição",
        description: `Falha ao buscar afiliados: ${err.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
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
      setError('Dados incompletos para atualização');
      return false;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return false;
      }
      
      const result = await wbuyApiService.updateAffiliateAttribute(
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
        setError('Falha na atualização do atributo');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar atributo');
      toast({
        title: "Erro na atualização",
        description: `Falha ao atualizar atributo: ${err.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    checkIntegration,
    getOrderData,
    getAffiliates,
    updateAffiliateAttribute
  };
};
