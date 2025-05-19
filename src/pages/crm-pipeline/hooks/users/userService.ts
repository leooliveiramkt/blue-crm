
import { supabase } from '@/integrations/supabase/client';
import { User } from '../../types';
import { UserCreateData, UserUpdateData, UserOperationResult } from './types';

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role')
      .order('first_name', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      // Mapeia os dados do Supabase para o formato esperado pelo aplicativo
      return data.map(user => ({
        id: user.id,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        role: user.role || 'Consultor' // Valor padrão se não houver role
      }));
    }
    
    return [];
  },

  async addUser(userData: UserCreateData): Promise<User> {
    try {
      // Separando o nome completo em primeiro nome e sobrenome
      const nameParts = userData.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      // Importante: O Supabase Auth cria automaticamente registros na tabela profile
      // Para inserir diretamente, precisamos gerar um UUID
      const generatedUuid = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: generatedUuid, // Fornecemos um UUID válido
          first_name: firstName,
          last_name: lastName,
          role: userData.role
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      if (data) {
        const newUser: User = {
          id: data.id,
          name: userData.name,
          role: userData.role
        };
        
        return newUser;
      }
      
      throw new Error('Falha ao criar usuário: nenhum dado retornado');
    } catch (err) {
      console.error('Erro no serviço ao criar usuário:', err);
      throw err;
    }
  },

  async updateUser(id: string, userData: UserUpdateData): Promise<User> {
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

      // Retorna o usuário atualizado
      return {
        id,
        name: userData.name || '', // Este valor deve ser preenchido pelo chamador se necessário
        role: userData.role || '' // Este valor deve ser preenchido pelo chamador se necessário
      };
    } catch (err) {
      console.error('Erro no serviço ao atualizar usuário:', err);
      throw err;
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Erro no serviço ao excluir usuário:', err);
      throw err;
    }
  },
  
  // Mantemos os métodos antigos para compatibilidade
  fetchUsers: function() { return this.getUsers(); },
  createUser: async function(userData: UserCreateData) {
    try {
      const user = await this.addUser(userData);
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }
};
