
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { tenantManager } from '@/lib/tenancy/tenantManager';
import { useToast } from '@/components/ui/use-toast';
import { Profile, UserRole } from '@/types/auth';

export function useAuthService() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const updateUserState = (session: Session | null) => {
    setSession(session);
    setIsAuthenticated(!!session);
    setUserId(session?.user?.id || null);

    if (!session?.user) {
      setProfile(null);
      setUserName(null);
      setUserRole(null);
      return;
    }
  };

  const processUserProfile = (profile: Profile | null) => {
    if (profile) {
      setProfile(profile);
      setUserName(profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Usuário');
      // Por enquanto, vamos manter o userRole como 'admin' para desenvolvimento
      setUserRole('admin');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Tentando login com:", email);
      
      // Usuários de demonstração para fins de desenvolvimento
      if (email === 'admin@example.com' && password === 'admin') {
        console.log("Login com usuário de demonstração (admin)");
        setIsAuthenticated(true);
        setUserRole('admin');
        setUserName('Admin');
        setUserId('demo-admin-id');
        
        toast({
          title: "Login de demonstração",
          description: "Você entrou como administrador de demonstração.",
        });
        
        // Pequeno delay para garantir que o estado seja atualizado
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
        
        return true;
      }
      
      if (email === 'director@example.com' && password === 'director') {
        console.log("Login com usuário de demonstração (diretor)");
        setIsAuthenticated(true);
        setUserRole('director');
        setUserName('Diretor');
        setUserId('demo-director-id');
        
        toast({
          title: "Login de demonstração",
          description: "Você entrou como diretor de demonstração.",
        });
        
        // Pequeno delay para garantir que o estado seja atualizado
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
        
        return true;
      }
      
      if (email === 'consultant@example.com' && password === 'consultant') {
        console.log("Login com usuário de demonstração (consultor)");
        setIsAuthenticated(true);
        setUserRole('consultant');
        setUserName('Consultor');
        setUserId('demo-consultant-id');
        
        toast({
          title: "Login de demonstração",
          description: "Você entrou como consultor de demonstração.",
        });
        
        // Pequeno delay para garantir que o estado seja atualizado
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
        
        return true;
      }
      
      // Login real com Supabase se não for um usuário de demonstração
      console.log("Verificando conexão com Supabase...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Erro de login:", error.message);
        console.error("Código de erro:", error.status);
        
        let mensagemErro = "Ocorreu um erro ao fazer login.";

        // Mapear mensagens de erro comuns para português
        if (error.message.includes("Invalid login credentials")) {
          mensagemErro = "Credenciais inválidas. Por favor, verifique seu email e senha.";
          console.log("Debug: Usuários demo disponíveis: admin@example.com/admin, director@example.com/director, consultant@example.com/consultant");
        } else if (error.message.includes("Email not confirmed")) {
          mensagemErro = "Email não confirmado. Por favor, verifique sua caixa de entrada.";
        } else if (error.message.includes("Too many requests")) {
          mensagemErro = "Muitas tentativas de login. Por favor, tente novamente mais tarde.";
        }

        toast({
          title: "Erro ao fazer login",
          description: mensagemErro,
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
        // Não vamos falhar o login se o tenant não carregar
      }
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta!",
      });
      
      navigate('/dashboard');
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
      
      // Se for um usuário de demonstração
      if (userId && userId.startsWith('demo-')) {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName(null);
        setUserId(null);
        setProfile(null);
        setSession(null);
        localStorage.removeItem('currentTenantId');
        
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
        
        navigate('/login');
        return;
      }
      
      // Caso contrário, faz logout no Supabase
      await supabase.auth.signOut();
      localStorage.removeItem('currentTenantId');
      
      // Atualiza o estado após o logout
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName(null);
      setUserId(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
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
