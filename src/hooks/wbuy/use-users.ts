
import { useState } from 'react';
import { wbuyUsersService } from '@/services/wbuy';
import { useWbuyIntegration } from './use-integration';

/**
 * Hook para gerenciar usuários da Wbuy
 */
export const useWbuyUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkIntegration, handleError } = useWbuyIntegration();

  /**
   * Busca lista de usuários
   */
  const getUsers = async (page = 1, limit = 20) => {
    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyUsersService.getUsers(page, limit);
    } catch (err: any) {
      handleError(err, 'Erro ao buscar usuários');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca detalhes de um usuário específico
   */
  const getUserDetails = async (userId: string) => {
    if (!userId) {
      handleError(new Error('ID do usuário não informado'), 'Erro ao buscar usuário');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyUsersService.getUserDetails(userId);
    } catch (err: any) {
      handleError(err, 'Erro ao buscar detalhes do usuário');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getUsers,
    getUserDetails
  };
};
