
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { tenantManager } from '@/lib/tenancy/tenantManager';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/types/auth';

export function useAuthActions(
  setIsAuthenticated: (value: boolean) => void,
  setUserRole: (value: UserRole | null) => void,
  setUserName: (value: string | null) => void,
  setUserId: (value: string | null) => void,
  setProfile: (value: any | null) => void,
  setSession: (value: any | null) => void
) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Tentando login com:", email);
      
      // Usuários de demonstração para fins de desenvolvimento
      if (email === 'admin@example.com' && password === 'admin') {
        console.log("Login com usuário de demonstração (admin)");
        
        // Define o estado de autenticação
        setIsAuthenticated(true);
        setUserRole('admin');
        setUserName('Admin');
        setUserId('demo-admin-id');
        
        // Salva uma marca no localStorage para identificar que é um usuário demo
        localStorage.setItem('demo_user_type', 'admin');
        
        toast({
          title: "Login de demonstração",
          description: "Você entrou como administrador de demonstração.",
        });
        
        // Pequeno delay para garantir que o estado seja atualizado antes do redirecionamento
        setTimeout(() => {
          console.log("Redirecionando para o dashboard após login do admin");
          navigate('/dashboard');
        }, 300);
        
        return true;
      }
      
      if (email === 'director@example.com' && password === 'director') {
        console.log("Login com usuário de demonstração (diretor)");
        setIsAuthenticated(true);
        setUserRole('director');
        setUserName('Diretor');
        setUserId('demo-director-id');
        localStorage.setItem('demo_user_type', 'director');
        
        toast({
          title: "Login de demonstração",
          description: "Você entrou como diretor de demonstração.",
        });
        
        // Pequeno delay para garantir que o estado seja atualizado
        setTimeout(() => {
          navigate('/dashboard');
        }, 300);
        
        return true;
      }
      
      if (email === 'consultant@example.com' && password === 'consultant') {
        console.log("Login com usuário de demonstração (consultor)");
        setIsAuthenticated(true);
        setUserRole('consultant');
        setUserName('Consultor');
        setUserId('demo-consultant-id');
        localStorage.setItem('demo_user_type', 'consultant');
        
        toast({
          title: "Login de demonstração",
          description: "Você entrou como consultor de demonstração.",
        });
        
        // Pequeno delay para garantir que o estado seja atualizado
        setTimeout(() => {
          navigate('/dashboard');
        }, 300);
        
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
      if (localStorage.getItem('demo_user_type')) {
        console.log("Logout de usuário de demonstração");
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName(null);
        setUserId(null);
        setProfile(null);
        setSession(null);
        localStorage.removeItem('demo_user_type');
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

  return {
    login,
    logout
  };
}
