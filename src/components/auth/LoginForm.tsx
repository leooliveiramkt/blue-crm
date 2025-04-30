
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ThemeConfig } from '@/config/theme';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  debugInfo: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ debugInfo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Removido o redirecionamento automático para o dashboard

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

    try {
      console.log("Iniciando processo de login com:", email);
      const success = await login(email, password);
      
      if (success) {
        console.log("Login bem-sucedido, redirecionando...");
        // Após login bem-sucedido, redirecionamos manualmente para o dashboard
        navigate('/dashboard');
      } else {
        console.log("Login falhou");
        // O toast é exibido dentro da função login em caso de erro
      }
    } catch (error) {
      console.error("Erro durante o login:", error);
      toast({
        title: "Erro de login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <CardHeader>
        <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
        <CardDescription>
          Entre com seus dados para acessar o sistema
        </CardDescription>
      </CardHeader>
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
                toast({
                  title: "Funcionalidade em desenvolvimento",
                  description: "A recuperação de senha será implementada em breve.",
                });
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
        
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300">
          <p className="font-semibold mb-1">Usuários de demonstração:</p>
          <code className="block whitespace-pre-wrap">
            - Admin: admin@example.com / admin<br />
            - Diretor: director@example.com / director<br />
            - Consultor: consultant@example.com / consultant
          </code>
        </div>
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
  );
};
