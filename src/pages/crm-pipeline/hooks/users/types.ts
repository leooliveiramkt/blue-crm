
import { User } from '../../types';

export type { User };  // Re-exportação correta do tipo usando 'export type'

export interface UserCreateData extends Omit<User, 'id'> {}
export interface UserUpdateData extends Partial<Omit<User, 'id'>> {}

export interface UserOperationResult {
  success: boolean;
  user?: User;
  error?: unknown;
}

// Dados iniciais simulados para fallback
export const initialUsers: User[] = [
  { id: 'user-1', name: 'Ana Silva', role: 'Vendedor' },
  { id: 'user-2', name: 'Roberto Almeida', role: 'Consultor' },
  { id: 'user-3', name: 'Carlos Eduardo', role: 'Gerente' },
];
