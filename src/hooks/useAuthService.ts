
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
    console.log("useAuthService: Configurando listener de autenticação");
    
    // Verificar primeiro se é um usuário de demonstração
    const demoType = localStorage.getItem('demo_user_type');
    if (demoType) {
      console.log("useAuthService: Detectado usuário de demonstração:", demoType);
      
      // Configura dados do usuário para demonstração
      switch (demoType) {
        case 'admin':
          setIsAuthenticated(true);
          setUserRole('admin');
          setUserName('Admin');
          setUserId('demo-admin-id');
          break;
        case 'director':
          setIsAuthenticated(true);
          setUserRole('director');
          setUserName('Diretor');
          setUserId('demo-director-id');
          break;
        case 'consultant':
          setIsAuthenticated(true);
          setUserRole('consultant');
          setUserName('Consultor');
          setUserId('demo-consultant-id');
          break;
      }
      
      // Para usuários de demonstração, não precisamos do listener
      return;
    }
    
    // Configura o listener de mudança de estado de autenticação para usuários reais
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

    // Verifica sessão atual para usuários reais
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
      // Se não for usuário demo, faz cleanup da subscription
      if (!demoType && subscription) {
        subscription.unsubscribe();
      }
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
