
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ThemeConfig } from '@/config/theme'; // Mantendo a compatibilidade
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { DemoCredentials } from '@/components/auth/DemoCredentials';
import { LoginHero } from '@/components/auth/LoginHero';
import { useSupabaseConnection } from '@/hooks/useSupabaseConnection';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { debugInfo } = useSupabaseConnection();

  // Redirecionar para o dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Login: Usuário já autenticado, redirecionando para o dashboard");
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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
      <LoginHero />

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
            <LoginForm 
              debugInfo={debugInfo} 
            />
          </Card>

          <DemoCredentials setDemoCredentials={setDemoCredentials} />
        </div>
      </div>
    </div>
  );
};

export default Login;
