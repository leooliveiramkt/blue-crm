
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '../../types';
import { useUsersState } from './useUsersState';
import { userService } from './userService';
import { UserCreateData, UserUpdateData, initialUsers } from './types';

export const useUsers = () => {
  const {
    users,
    loading, 
    setLoading,
    error, 
    setError,
    updateUsers,
    addUserToState,
    updateUserInState,
    removeUserFromState
  } = useUsersState();
  
  const { toast } = useToast();

  // Carrega todos os usuários
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Tentamos buscar usuários do Supabase
      const fetchedUsers = await userService.fetchUsers();
      
      if (fetchedUsers.length > 0) {
        updateUsers(fetchedUsers);
      } else {
        // Se não houver dados, usamos os dados simulados
        console.log('Nenhum usuário encontrado no Supabase, usando dados simulados');
        updateUsers(initialUsers);
      }
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError('Não foi possível carregar os usuários');
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários. Usando dados locais.",
        variant: "destructive",
      });
      
      // Em caso de erro, garantimos que temos pelo menos os dados simulados
      updateUsers(initialUsers);
    } finally {
      setLoading(false);
    }
  };

  // Cria um novo usuário
  const createUser = async (userData: UserCreateData) => {
    setLoading(true);
    setError(null);

    try {
      // Tenta criar no Supabase
      const { success, user, error: serviceError } = await userService.createUser(userData);
      
      if (success && user) {
        // Adiciona o novo usuário ao estado local
        addUserToState(user);
        
        toast({
          title: "Usuário criado",
          description: `${userData.name} foi adicionado com sucesso.`,
          variant: "default",
        });
        
        return { success: true, user };
      } else {
        throw serviceError || new Error('Falha ao criar usuário');
      }
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      setError('Não foi possível criar o usuário');
      
      // Se falhar no Supabase, criamos localmente com ID gerado
      const newUserId = `user-${Date.now()}`;
      const newUser: User = {
        id: newUserId,
        name: userData.name,
        role: userData.role
      };
      
      addUserToState(newUser);
      
      toast({
        title: "Erro ao criar usuário no servidor",
        description: "Usuário foi criado localmente.",
        variant: "warning",
      });
      
      return { success: false, user: newUser, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Atualiza um usuário existente
  const updateUser = async (id: string, userData: UserUpdateData) => {
    setLoading(true);
    setError(null);

    try {
      // Verifica se o usuário existe no estado local
      const userExists = users.some(user => user.id === id);
      if (!userExists) {
        throw new Error('Usuário não encontrado');
      }
      
      // Tenta atualizar no Supabase
      const { success, error: serviceError } = await userService.updateUser(id, userData);
      
      // Atualiza no estado local
      updateUserInState(id, userData);
      
      toast({
        title: "Usuário atualizado",
        description: "As informações foram atualizadas com sucesso.",
        variant: success ? "default" : "warning",
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
      const { success, error: serviceError } = await userService.deleteUser(id);
      
      // Remove do estado local
      removeUserFromState(id);
      
      toast({
        title: "Usuário removido",
        description: "O usuário foi excluído com sucesso.",
        variant: success ? "default" : "warning",
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

