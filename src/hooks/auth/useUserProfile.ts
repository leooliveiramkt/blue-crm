
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/auth';

export function useUserProfile() {
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Buscando perfil do usuário:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Erro ao buscar perfil:", error);
        return null;
      }

      console.log("Perfil do usuário encontrado:", profile);
      return profile;
    } catch (error) {
      console.error("Erro ao processar perfil do usuário:", error);
      return null;
    }
  };

  return {
    fetchUserProfile
  };
}
