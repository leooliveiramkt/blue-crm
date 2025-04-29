
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
          <div className="logo-animated">
            <img 
              src={themeConfig.logo} 
              alt={themeConfig.companyName} 
              className="h-10 w-auto object-contain" 
            />
          </div>
        ) : (
          <span className="text-2xl font-bold" style={{ color: themeConfig.primaryColor }}>
            {themeConfig.companyName || "Blue CRM"}
          </span>
        )}
      </div>
      <Button 
        variant="outline" 
        onClick={handleNavigateToLogin}
        style={{ borderColor: themeConfig.primaryColor, color: themeConfig.primaryColor }}
      >
        Entrar
      </Button>
    </header>
  );
};
