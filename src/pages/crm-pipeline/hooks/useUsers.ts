
import { useState } from 'react';
import { User } from '../types';

// Dados iniciais simulados
const initialUsers: User[] = [
  { id: 'user-1', name: 'Ana Silva', role: 'Vendedor' },
  { id: 'user-2', name: 'Roberto Almeida', role: 'Consultor' },
  { id: 'user-3', name: 'Carlos Eduardo', role: 'Gerente' },
];

export const useUsers = () => {
  const [users] = useState<User[]>(initialUsers);
  
  return {
    users
  };
};
