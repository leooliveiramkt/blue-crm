
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ThemeConfig } from '@/config/theme';

export const CTASection = () => {
  const navigate = useNavigate();

  const handleStartFreeDemo = () => {
    navigate('/login');
  };

  return (
    <section className="bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/30 dark:to-purple-900/30 py-16">
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
            backgroundColor: ThemeConfig.primaryColor || 'hsl(var(--primary))',
            color: ThemeConfig.primaryForeground || 'hsl(var(--primary-foreground))'
          }}
        >
          Começar Demonstração
        </Button>
      </div>
    </section>
  );
};
