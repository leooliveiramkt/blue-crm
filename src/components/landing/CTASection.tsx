
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

export const CTASection = () => {
  const navigate = useNavigate();
  const { themeConfig } = useTheme();

  const handleStartFreeDemo = () => {
    navigate('/login');
  };

  return (
    <section className="py-16"
      style={{
        background: `linear-gradient(to right, ${themeConfig.primaryColor}20, ${themeConfig.accentColor}30)`,
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Pronto para revolucionar seu negócio?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Experimente agora e descubra como a Inteligência Artificial pode revolucionar a gestão do seu negócio.
        </p>
        <Button 
          size="lg" 
          onClick={handleStartFreeDemo}
          className="text-lg px-10"
          style={{ 
            backgroundColor: themeConfig.primaryColor || 'hsl(var(--primary))',
            color: themeConfig.primaryForeground || 'hsl(var(--primary-foreground))'
          }}
        >
          Começar Demonstração
        </Button>
      </div>
    </section>
  );
};
