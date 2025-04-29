
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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  // Redirecionar para o dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Iniciando processo de login...");
      const success = await login(email, password);
      
      if (success) {
        console.log("Login bem-sucedido, redirecionando...");
        navigate('/dashboard');
      } else {
        console.log("Login falhou");
        toast({
          title: "Login falhou",
          description: "Email ou senha inválidos. Tente novamente.",
          variant: "destructive",
        });
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
            <div className="text-xs mt-1 space-y-1">
              <p>Admin: admin@example.com / admin</p>
              <p>Diretor: director@example.com / director</p>
              <p>Consulta: consultant@example.com / consultant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
