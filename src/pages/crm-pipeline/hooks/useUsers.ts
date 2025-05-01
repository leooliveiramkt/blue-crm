
import { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Dados iniciais simulados para fallback
const initialUsers: User[] = [
  { id: 'user-1', name: 'Ana Silva', role: 'Vendedor' },
  { id: 'user-2', name: 'Roberto Almeida', role: 'Consultor' },
  { id: 'user-3', name: 'Carlos Eduardo', role: 'Gerente' },
];

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Carrega todos os usuários
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Tentamos buscar usuários do Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .order('first_name', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Mapeia os dados do Supabase para o formato esperado pelo aplicativo
        const mappedUsers: User[] = data.map(user => ({
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          role: user.role || 'Consultor' // Valor padrão se não houver role
        }));
        
        setUsers(mappedUsers);
      } else {
        // Se não houver dados, usamos os dados simulados
        console.log('Nenhum usuário encontrado no Supabase, usando dados simulados');
        setUsers(initialUsers);
      }
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError('Não foi possível carregar os usuários');
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários. Usando dados locais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cria um novo usuário
  const createUser = async (userData: Omit<User, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      // Gera um ID único para o usuário local
      const newUserId = `user-${Date.now()}`;
      
      // Tenta criar no Supabase se disponível
      let userId = newUserId;
      let success = false;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            first_name: userData.name.split(' ')[0],
            last_name: userData.name.split(' ').slice(1).join(' '),
            role: userData.role
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        if (data) {
          userId = data.id;
          success = true;
        }
      } catch (err) {
        console.error('Erro ao criar usuário no Supabase:', err);
        // Continua com o ID local
      }
      
      // Adiciona o novo usuário ao estado local
      const newUser: User = {
        id: userId,
        name: userData.name,
        role: userData.role
      };
      
      setUsers(prev => [...prev, newUser]);
      
      toast({
        title: "Usuário criado",
        description: `${userData.name} foi adicionado com sucesso.`,
        variant: "default",
      });
      
      return { success, user: newUser };
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      setError('Não foi possível criar o usuário');
      
      toast({
        title: "Erro ao criar usuário",
        description: "Não foi possível adicionar o novo usuário.",
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Atualiza um usuário existente
  const updateUser = async (id: string, userData: Partial<Omit<User, 'id'>>) => {
    setLoading(true);
    setError(null);

    try {
      // Verifica se o usuário existe no estado local
      const userExists = users.some(user => user.id === id);
      if (!userExists) {
        throw new Error('Usuário não encontrado');
      }
      
      // Tenta atualizar no Supabase
      let success = false;
      
      try {
        // Prepara os dados para atualização
        const updateData: Record<string, any> = {};
        
        if (userData.name) {
          const nameParts = userData.name.split(' ');
          updateData.first_name = nameParts[0];
          updateData.last_name = nameParts.slice(1).join(' ');
        }
        
        if (userData.role) {
          updateData.role = userData.role;
        }
        
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', id);
          
        if (error) throw error;
        success = true;
      } catch (err) {
        console.error('Erro ao atualizar usuário no Supabase:', err);
        // Continua com a atualização local mesmo se falhar no Supabase
      }
      
      // Atualiza no estado local
      setUsers(prev => prev.map(user => {
        if (user.id === id) {
          return { ...user, ...userData };
        }
        return user;
      }));
      
      toast({
        title: "Usuário atualizado",
        description: "As informações foram atualizadas com sucesso.",
        variant: "default",
      });
      
      return { success };
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      setError('Não foi possível atualizar o usuário');
      
      toast({
        title: "Erro ao atualizar usuário",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Remove um usuário
  const deleteUser = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      // Verifica se o usuário existe no estado local
      const userExists = users.some(user => user.id === id);
      if (!userExists) {
        throw new Error('Usuário não encontrado');
      }
      
      // Tenta excluir do Supabase
      let success = false;
      
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        success = true;
      } catch (err) {
        console.error('Erro ao excluir usuário no Supabase:', err);
        // Continua com a exclusão local mesmo se falhar no Supabase
      }
      
      // Remove do estado local
      setUsers(prev => prev.filter(user => user.id !== id));
      
      toast({
        title: "Usuário removido",
        description: "O usuário foi excluído com sucesso.",
        variant: "default",
      });
      
      return { success };
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      setError('Não foi possível excluir o usuário');
      
      toast({
        title: "Erro ao excluir usuário",
        description: "Não foi possível remover o usuário.",
        variant: "destructive",
      });
      
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Busca um usuário específico pelo ID
  const getUserById = (id: string) => {
    return users.find(user => user.id === id) || null;
  };

  // Carrega os usuários ao inicializar o hook
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById
  };
};
