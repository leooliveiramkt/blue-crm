
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { tenantManager } from '@/lib/tenancy/tenantManager';
import { toast } from '@/components/ui/use-toast';

type UserRole = 'admin' | 'director' | 'consultant';

interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userName: string | null;
  userId: string | null;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Configura o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event, "Session:", !!session);
        setSession(session);
        setIsAuthenticated(!!session);
        setUserId(session?.user?.id || null);

        if (session?.user) {
          // Busca o perfil do usuário
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error("Erro ao buscar perfil:", error);
            }

            setProfile(profile);
            setUserName(profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Usuário');
            
            // Por enquanto, vamos manter o userRole como 'admin' para desenvolvimento
            setUserRole('admin');
          } catch (error) {
            console.error("Erro ao processar perfil do usuário:", error);
          }
        } else {
          setProfile(null);
          setUserName(null);
          setUserRole(null);
        }
      }
    );

    // Verifica sessão atual
    const checkSession = async () => {
      try {
        console.log("Verificando sessão atual...");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Sessão atual:", !!session);
        setSession(session);
        setIsAuthenticated(!!session);
        setUserId(session?.user?.id || null);

        if (session?.user) {
          // Busca o perfil do usuário
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error("Erro ao buscar perfil na inicialização:", error);
            }
            
            setProfile(profile);
            setUserName(profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Usuário');
            // Por enquanto, vamos manter o userRole como 'admin' para desenvolvimento
            setUserRole('admin');
          } catch (error) {
            console.error("Erro ao buscar perfil do usuário:", error);
          }
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Tentando login com:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Erro de login:", error.message);
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      console.log("Login bem-sucedido:", !!data.session);
      // Inicializa o tenant para o usuário após o login
      try {
        await tenantManager.loadCurrentTenant();
      } catch (tenantError) {
        console.error("Erro ao carregar tenant:", tenantError);
      }
      return true;
    } catch (error) {
      console.error("Erro inesperado durante login:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log("Realizando logout...");
      await supabase.auth.signOut();
      localStorage.removeItem('currentTenantId');
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!isAuthenticated || !userRole) return false;
    
    // Role hierarchy: admin > director > consultant
    if (userRole === 'admin') return true;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    
    if (requiredRole === 'director') {
      return userRole === 'director';
    }
    
    if (requiredRole === 'consultant') {
      return ['consultant', 'director'].includes(userRole);
    }
    
    return false;
  };

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
