
import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '@/types/auth';
import { useAuthService } from '@/hooks/useAuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
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
  } = useAuthService();

  useEffect(() => {
    // Configura o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event, "Session:", !!session);
        updateUserState(session);

        if (session?.user) {
          // Busca o perfil do usuário
          const profile = await fetchUserProfile(session.user.id);
          processUserProfile(profile);
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
        console.log("Detalhes da sessão:", session);
        
        updateUserState(session);

        if (session?.user) {
          console.log("Usuário autenticado:", session.user);
          // Busca o perfil do usuário
          const profile = await fetchUserProfile(session.user.id);
          processUserProfile(profile);
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

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      userName, 
      userId,
      profile,
      login, 
      logout, 
      hasPermission 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
