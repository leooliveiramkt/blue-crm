
import { useState, useEffect } from 'react';
import { useUsersState } from './useUsersState';
import { userService } from './userService';
import { useWbuyApi } from '@/hooks/useWbuyApi';
import { User } from '../../types';

export const useUsers = () => {
  const { users, setUsers } = useUsersState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getUsers: fetchWbuyUsers } = useWbuyApi();

  // Carregar usuários ao inicializar
  useEffect(() => {
    loadUsers();
  }, []);

  // Carrega usuários de múltiplas fontes
  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Primeiro tenta carregar da API Wbuy
      const wbuyUsers = await fetchWbuyUsers();

      if (wbuyUsers && typeof wbuyUsers === 'object' && 'data' in wbuyUsers && Array.isArray(wbuyUsers.data)) {
        // Mapeia usuários da Wbuy para o formato interno
        const mappedUsers = wbuyUsers.data.map((user: any) => ({
          id: user.id || `wbuy-${Date.now()}`,
          name: user.name || 'Usuário Wbuy',
          role: user.role || 'Usuário',
        }));
        
        setUsers(mappedUsers);
      } else {
        // Se não conseguir da Wbuy, carrega do serviço local
        const localUsers = await userService.fetchUsers();
        setUsers(localUsers);
      }
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Falha ao carregar usuários');
      
      // Em caso de falha, carrega dados locais
      const localUsers = await userService.fetchUsers();
      setUsers(localUsers);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    error,
    refreshUsers: loadUsers
  };
};
