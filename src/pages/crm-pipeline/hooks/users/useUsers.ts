
import { useState } from 'react';
import { useUsersState } from './useUsersState';
import { userService } from './userService';
import type { User } from './types';
import { toast } from '@/components/ui/use-toast';

export const useUsers = () => {
  const { users, setUsers, selectedUser, setSelectedUser } = useUsersState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
      return fetchedUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os usuários',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    setIsLoading(true);
    try {
      const newUser = await userService.addUser(user);
      setUsers([...users, newUser]);
      toast({
        title: 'Sucesso',
        description: 'Usuário adicionado com sucesso',
      });
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o usuário',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, user: Partial<User>) => {
    setIsLoading(true);
    try {
      const updatedUser = await userService.updateUser(id, user);
      setUsers(users.map(u => u.id === id ? { ...u, ...updatedUser } : u));
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser({ ...selectedUser, ...updatedUser });
      }
      toast({
        title: 'Sucesso',
        description: 'Usuário atualizado com sucesso',
      });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o usuário',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setIsLoading(true);
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser(null);
      }
      toast({
        title: 'Sucesso',
        description: 'Usuário removido com sucesso',
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o usuário',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const selectUser = (user: User | null) => {
    setSelectedUser(user);
  };

  return {
    users,
    selectedUser,
    isLoading,
    fetchUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    selectUser
  };
};
