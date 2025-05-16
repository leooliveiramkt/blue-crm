
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/auth';
import { UserFormValues } from '../components/user-management/UserForm';

export const createUser = async (values: UserFormValues): Promise<{ data: any; error: any }> => {
  try {
    // Verificar se é o usuário específico solicitado
    const isSpecialAdmin = values.email.toLowerCase() === 'leooliveiramktd@gmail.com';
    
    // Para o usuário específico, garantir que seja criado como admin
    const userRole = isSpecialAdmin ? 'admin' : values.role;
    
    console.log("Tentando criar usuário com email:", values.email, "e função:", userRole);
    
    // Criar usuário no Supabase Auth
    const response = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          first_name: values.name.split(' ')[0],
          last_name: values.name.split(' ').slice(1).join(' '),
          role: userRole
        }
      }
    });
    
    console.log("Resposta do Supabase:", response.data, response.error);
    
    return response;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return { data: null, error };
  }
};
