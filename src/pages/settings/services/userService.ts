
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/auth';
import { UserFormValues } from '../components/user-management/UserForm';

export const createUser = async (values: UserFormValues): Promise<{ data: any; error: any }> => {
  try {
    console.log("userService: Tentando criar usuário com email:", values.email);
    
    // Verificar se é o usuário específico solicitado
    const isSpecialAdmin = values.email.toLowerCase() === 'leooliveiramktd@gmail.com';
    
    // Para o usuário específico, garantir que seja criado como admin
    const userRole = isSpecialAdmin ? 'admin' : values.role;
    
    console.log("userService: Configurando role como:", userRole);
    
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
    
    console.log("userService: Resposta do Supabase:", response);
    
    return response;
  } catch (error) {
    console.error('userService: Erro ao criar usuário:', error);
    return { data: null, error };
  }
};
