
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '@/types/auth';
import { useAuthService } from '@/hooks/useAuthService';
import { useToast } from '@/components/ui/use-toast';

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Configura o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event, "Session:", !!session);
        
        // Não chame outras funções do Supabase diretamente no callback
        // Use setTimeout para evitar deadlocks
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
        setIsLoading(true);
        console.log("Verificando sessão atual...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          toast({
            title: "Erro de autenticação",
            description: "Não foi possível verificar sua sessão. Por favor, faça login novamente.",
            variant: "destructive",
          });
        }
        
        console.log("Sessão atual:", !!session);
        if (session?.user) {
          console.log("Usuário autenticado:", session.user);
          console.log("Detalhes da sessão:", session);
          
          updateUserState(session);
          
          setTimeout(async () => {
            // Busca o perfil do usuário
            const profile = await fetchUserProfile(session.user.id);
            processUserProfile(profile);
          }, 0);
        } else {
          console.log("Nenhuma sessão ativa encontrada");
        }
      } catch (error) {
        console.error("Erro ao verificar sessão atual:", error);
        toast({
          title: "Erro de sistema",
          description: "Ocorreu um erro ao verificar sua sessão de usuário.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Renderiza um loader enquanto verifica a sessão
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
