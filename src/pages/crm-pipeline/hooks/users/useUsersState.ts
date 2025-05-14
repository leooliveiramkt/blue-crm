
import { useState } from 'react';
import { User } from '../../types';
import { initialUsers } from './types';

export const useUsersState = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const updateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
  };

  const addUserToState = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const updateUserInState = (id: string, userData: Partial<Omit<User, 'id'>>) => {
    setUsers(prev => prev.map(user => {
      if (user.id === id) {
        return { ...user, ...userData };
      }
      return user;
    }));
  };

  const removeUserFromState = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return {
    users,
    setUsers,
    loading,
    setLoading,
    error,
    setError,
    selectedUser,
    setSelectedUser,
    updateUsers,
    addUserToState,
    updateUserInState,
    removeUserFromState
  };
};
