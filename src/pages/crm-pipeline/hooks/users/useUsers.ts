
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { wbuyApiService } from '@/services/wbuy-api';
import { useIntegrationCheck } from '../useIntegrationCheck';
import { User } from '../../types';

export type WbuyUser = {
  id: string;
  name: string;
  email?: string;
  role?: string;
  status?: string;
  created_at?: string;
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkIntegration } = useIntegrationCheck();

  /**
   * Busca usuários da plataforma Wbuy
   * @param page Número da página (padrão: 1)
   * @param limit Limite de usuários por página (padrão: 20)
   */
  const fetchUsers = async (page = 1, limit = 20) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar se a integração está disponível
      const isIntegrationAvailable = await checkIntegration('wbuy');
      
      if (!isIntegrationAvailable) {
        console.log('Integração Wbuy não disponível, usando dados simulados');
        await simulateUsersFetch();
        return;
      }
      
      // Buscar usuários reais da API Wbuy
      const response = await wbuyApiService.getUsers(page, limit);
      
      if (response && Array.isArray(response)) {
        // Formatar dados da API para o formato esperado
        const formattedUsers: User[] = response.map((user: any) => ({
          id: user.id || String(Math.random()),
          name: user.name || user.full_name || 'Nome não disponível',
          role: user.role || user.user_type || 'Usuário', // Garantindo que role sempre exista
          email: user.email || undefined // Adicionando email como opcional
        }));
        
        setUsers(formattedUsers);
        console.log('Usuários carregados da API Wbuy:', formattedUsers);
      } else {
        // Em caso de erro ou resposta inesperada, usar dados simulados
        console.log('Resposta da API inválida, usando dados simulados');
        await simulateUsersFetch();
      }
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      setError(err.message || 'Falha ao carregar usuários da Wbuy');
      toast({
        title: "Erro ao carregar usuários",
        description: err.message || "Não foi possível buscar os usuários da Wbuy",
        variant: "destructive"
      });
      
      // Em caso de erro, usar dados simulados
      await simulateUsersFetch();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Função para simular busca de usuários (fallback)
   * Útil para testes ou quando a API não está disponível
   */
  const simulateUsersFetch = async () => {
    // Simula tempo de resposta da API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'João Silva',
        role: 'Administrador',
        email: 'joao@wbuy.com.br'
      },
      {
        id: '2',
        name: 'Maria Souza',
        role: 'Suporte',
        email: 'maria@wbuy.com.br'
      },
      {
        id: '3',
        name: 'Carlos Mendes',
        role: 'Financeiro',
        email: 'carlos@wbuy.com.br'
      }
    ];
    
    setUsers(mockUsers);
    console.log('Dados simulados de usuários carregados:', mockUsers);
    
    toast({
      title: "Dados simulados",
      description: "Exibindo dados simulados de usuários (API Wbuy indisponível)",
      variant: "warning"
    });
  };

  return {
    users,
    isLoading,
    error,
    fetchUsers
  };
};
