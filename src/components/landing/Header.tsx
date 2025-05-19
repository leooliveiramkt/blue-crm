
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

export const Header = () => {
  const navigate = useNavigate();
  const { themeConfig } = useTheme();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center">
        {themeConfig.logo ? (
          <div className="logo-animated h-10 relative">
            <div className="absolute -inset-1 rounded-lg bg-white/10 blur-lg"></div>
            <img 
              src={themeConfig.logo} 
              alt={themeConfig.companyName} 
              className="h-full w-auto object-contain relative brightness-125 filter" 
            />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-white/10 blur"></div>
            <span className="text-2xl font-bold relative text-white">
              {themeConfig.companyName || "Blue CRM"}
            </span>
          </div>
        )}
      </div>
      <Button 
        variant="outline" 
        onClick={handleNavigateToLogin}
        className="bg-transparent text-white hover:bg-white/10 border-white border-opacity-30 backdrop-blur-sm"
      >
        Entrar
      </Button>
    </header>
  );
};
