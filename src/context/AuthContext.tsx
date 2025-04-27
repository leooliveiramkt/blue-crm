
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
        setSession(session);
        setIsAuthenticated(!!session);
        setUserId(session?.user?.id || null);

        if (session?.user) {
          // Busca o perfil do usuário
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('id', session.user.id)
            .single();

          setProfile(profile);
          setUserName(profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Usuário');
          
          // Por enquanto, vamos manter o userRole como 'admin' para desenvolvimento
          setUserRole('admin');
        } else {
          setProfile(null);
          setUserName(null);
          setUserRole(null);
        }
      }
    );

    // Verifica sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);

      if (session?.user) {
        // Busca o perfil do usuário
        supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setProfile(profile);
            setUserName(profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Usuário');
            // Por enquanto, vamos manter o userRole como 'admin' para desenvolvimento
            setUserRole('admin');
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Inicializa o tenant para o usuário após o login
      await tenantManager.loadCurrentTenant();
      return true;
    } catch (error) {
      console.error("Erro durante login:", error);
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
