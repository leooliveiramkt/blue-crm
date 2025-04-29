
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ThemeConfig } from '@/config/theme';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  // Redirecionar para o dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Verificar a conexão do Supabase
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error) {
          console.error("Erro ao verificar conexão com Supabase:", error);
          setDebugInfo(`Erro Supabase: ${error.message} (Código ${error.code})`);
        } else {
          console.log("Conexão com Supabase OK:", data);
          setDebugInfo(null);
        }
      } catch (error) {
        console.error("Exceção ao verificar Supabase:", error);
        setDebugInfo(`Exceção Supabase: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    };
    
    checkSupabaseConnection();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!email.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe seu email.",
        variant: "destructive",
      });
      return;
    }
    
    if (!password) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe sua senha.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setDebugInfo(null);

    try {
      console.log("Iniciando processo de login com:", email);
      const success = await login(email, password);
      
      if (success) {
        console.log("Login bem-sucedido, redirecionando...");
        // O redirecionamento será tratado pelo useEffect que observa isAuthenticated
      } else {
        console.log("Login falhou");
        // O toast é exibido dentro da função login em caso de erro
      }
    } catch (error) {
      console.error("Erro durante o login:", error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setDebugInfo(`Erro no login: ${errorMessage}`);
      toast({
        title: "Erro de login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Adiciona teste de credenciais para login
  const setDemoCredentials = (type: string) => {
    switch(type) {
      case 'admin':
        setEmail('admin@example.com');
        setPassword('admin');
        break;
      case 'director':
        setEmail('director@example.com');
        setPassword('director');
        break;
      case 'consultant':
        setEmail('consultant@example.com');
        setPassword('consultant');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel with image or gradient background */}
      <div 
        className="hidden md:flex md:w-1/2 bg-sidebar items-center justify-center p-12"
        style={{
          backgroundImage: ThemeConfig.loginBackground ? `url(${ThemeConfig.loginBackground})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-md text-white">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <h1 className="text-3xl font-bold mb-6">
              {ThemeConfig.tagline || "Gerencie seus negócios com eficiência"}
            </h1>
            <p className="text-lg opacity-90 mb-4">
              {ThemeConfig.description || "Plataforma completa de gestão para aumentar sua produtividade e acelerar resultados."}
            </p>
            
            {ThemeConfig.philosophicalQuote && (
              <blockquote className="border-l-4 border-white/30 pl-4 mt-6 italic opacity-90">
                {ThemeConfig.philosophicalQuote}
              </blockquote>
            )}
          </div>
        </div>
      </div>

      {/* Right panel with login form */}
      <div className="flex flex-1 items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            {ThemeConfig.logo ? (
              <img 
                src={ThemeConfig.logo} 
                alt={ThemeConfig.companyName} 
                className="h-16 mx-auto mb-4 object-contain"
              />
            ) : (
              <div className="h-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold" style={{ color: ThemeConfig.primaryColor }}>
                  {ThemeConfig.companyName}
                </span>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
              <CardDescription>
                Entre com seus dados para acessar o sistema
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Senha</Label>
                    <a 
                      href="#" 
                      className="text-xs text-muted-foreground hover:text-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Funcionalidade de recuperação de senha será implementada em breve');
                      }}
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {debugInfo && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300">
                    <p className="font-semibold mb-1">Informação de diagnóstico (apenas para desenvolvimento):</p>
                    <code className="block whitespace-pre-wrap">{debugInfo}</code>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full hover:opacity-90" 
                  disabled={isLoading}
                  style={{ 
                    backgroundColor: ThemeConfig.primaryColor || 'hsl(var(--primary))',
                    color: ThemeConfig.primaryForeground || 'hsl(var(--primary-foreground))'
                  }}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Níveis de acesso de demonstração:</p>
            <div className="text-xs mt-1 space-y-1 flex flex-col">
              <button 
                className="hover:underline hover:text-primary transition-colors"
                onClick={() => setDemoCredentials('admin')}
              >
                Admin: admin@example.com / admin
              </button>
              <button
                className="hover:underline hover:text-primary transition-colors"
                onClick={() => setDemoCredentials('director')}
              >
                Diretor: director@example.com / director
              </button>
              <button
                className="hover:underline hover:text-primary transition-colors"
                onClick={() => setDemoCredentials('consultant')}
              >
                Consulta: consultant@example.com / consultant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
