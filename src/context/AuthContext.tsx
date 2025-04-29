
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
    // Verifica sessão atual
    const checkSession = async () => {
      try {
        setIsLoading(true);
        console.log("AuthContext: Verificando sessão atual...");
        
        // Verificar se é um usuário de demonstração primeiro
        const demoType = localStorage.getItem('demo_user_type');
        if (demoType) {
          console.log("AuthContext: Usuário de demonstração encontrado:", demoType);
          // Simula uma sessão para usuários de demonstração
          switch (demoType) {
            case 'admin':
              updateUserState(null);
              processUserProfile({
                first_name: 'Admin',
                last_name: '',
                avatar_url: null
              });
              break;
            case 'director':
              updateUserState(null);
              processUserProfile({
                first_name: 'Diretor',
                last_name: '',
                avatar_url: null
              });
              break;
            case 'consultant':
              updateUserState(null);
              processUserProfile({
                first_name: 'Consultor',
                last_name: '',
                avatar_url: null
              });
              break;
          }
          setIsLoading(false);
          return;
        }
        
        // Se não for demo, verifica sessão no Supabase
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
