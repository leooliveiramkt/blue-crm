
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './auth/useAuthState';
import { useUserProfile } from './auth/useUserProfile';
import { useAuthActions } from './auth/useAuthActions';
import { usePermissions } from './auth/usePermissions';

export function useAuthService() {
  const {
    isAuthenticated,
    userRole,
    userName,
    userId,
    profile,
    session,
    updateUserState,
    processUserProfile,
    setIsAuthenticated,
    setUserRole,
    setUserName,
    setUserId,
    setProfile,
    setSession
  } = useAuthState();

  const { fetchUserProfile } = useUserProfile();
  
  const { login, logout } = useAuthActions(
    setIsAuthenticated,
    setUserRole,
    setUserName,
    setUserId,
    setProfile,
    setSession
  );
  
  const { hasPermission } = usePermissions(isAuthenticated, userRole);

  // Efeito para configurar o listener de alteração de estado da autenticação
  useEffect(() => {
    // Configura o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event, "Session:", !!session);
        
        updateUserState(session);

        if (session?.user) {
          setTimeout(async () => {
            // Busca o perfil do usuário
            const profile = await fetchUserProfile(session.user.id);
            processUserProfile(profile);
          }, 0);
        }
      }
    );

    // Verifica sessão atual
    const checkSession = async () => {
      try {
        console.log("Verificando sessão atual...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
        }
        
        console.log("Sessão atual:", !!session);
        if (session?.user) {
          console.log("Usuário autenticado:", session.user);
          
          updateUserState(session);
          
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            processUserProfile(profile);
          }, 0);
        } else {
          console.log("Nenhuma sessão ativa encontrada");
        }
      } catch (error) {
        console.error("Erro ao verificar sessão atual:", error);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    isAuthenticated,
    userRole,
    userName,
    userId,
    profile,
    session,
    updateUserState,
    processUserProfile,
    fetchUserProfile,
    login,
    logout,
    hasPermission
  };
}
