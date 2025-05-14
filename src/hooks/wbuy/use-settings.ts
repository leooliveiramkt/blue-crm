
import { useState } from 'react';
import { wbuySettingsService } from '@/services/wbuy';
import { useWbuyIntegration } from './use-integration';

/**
 * Hook para gerenciar configurações da Wbuy
 */
export const useWbuySettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkIntegration, handleError } = useWbuyIntegration();

  /**
   * Busca configurações do sistema
   */
  const getSettings = async () => {
    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuySettingsService.getSettings();
    } catch (err: any) {
      handleError(err, 'Erro ao buscar configurações');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca notificações
   */
  const getNotifications = async (page = 1, limit = 20) => {
    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuySettingsService.getNotifications(page, limit);
    } catch (err: any) {
      handleError(err, 'Erro ao buscar notificações');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getSettings,
    getNotifications
  };
};
