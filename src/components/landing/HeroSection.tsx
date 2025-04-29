
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ThemeConfig } from '@/config/theme';

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartFreeDemo = () => {
    navigate('/login');
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Transforme sua gestão com <span style={{ color: ThemeConfig.primaryColor }}>Inteligência Artificial</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Otimize processos, aumente a produtividade e tome decisões estratégicas com o CRM da Bela Blue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={handleStartFreeDemo}
              className="text-lg px-8"
              style={{ 
                backgroundColor: ThemeConfig.primaryColor || 'hsl(var(--primary))',
                color: ThemeConfig.primaryForeground || 'hsl(var(--primary-foreground))'
              }}
            >
              Experimente Agora
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8"
              style={{ borderColor: ThemeConfig.primaryColor, color: ThemeConfig.primaryColor }}
            >
              Saiba Mais
            </Button>
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden shadow-xl hidden md:block">
          <div className="aspect-video bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <img
              src="/lovable-uploads/d26651de-acd9-4751-833d-885496a264ea.png"
              alt="Bela Blue CRM Dashboard"
              className="w-3/4 mx-auto rounded-lg shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
