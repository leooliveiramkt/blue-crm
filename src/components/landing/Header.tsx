
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ThemeConfig } from '@/config/theme';

export const Header = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center">
        {ThemeConfig.logo ? (
          <img 
            src={ThemeConfig.logo} 
            alt={ThemeConfig.companyName} 
            className="h-10 w-auto object-contain" 
          />
        ) : (
          <span className="text-2xl font-bold" style={{ color: ThemeConfig.primaryColor }}>
            {ThemeConfig.companyName || "Bela Blue"}
          </span>
        )}
      </div>
      <Button 
        variant="outline" 
        onClick={handleNavigateToLogin}
        style={{ borderColor: ThemeConfig.primaryColor, color: ThemeConfig.primaryColor }}
      >
        Entrar
      </Button>
    </header>
  );
};
