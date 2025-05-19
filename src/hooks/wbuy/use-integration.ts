
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { integrationManager } from '@/lib/integrations/integrationManager';

/**
 * Hook para verificar e gerenciar a integração com a Wbuy
 */
export const useWbuyIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Verifica se a integração com a Wbuy está configurada
   * @returns true se estiver configurada, false caso contrário
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
   * Função auxiliar para tratamento de erros
   */
  const handleError = (err: any, defaultMessage: string) => {
    const errorMessage = err.message || defaultMessage;
    setError(errorMessage);
    toast({
      title: "Erro na requisição",
      description: errorMessage,
      variant: "destructive"
    });
  };

  return {
    isLoading,
    error,
    checkIntegration,
    handleError
  };
};
