import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { ArrowRight, BarChart, Database, Layers } from 'lucide-react';

export const HeroSection = () => {
  const navigate = useNavigate();
  const { themeConfig } = useTheme();

  const handleStartFreeDemo = () => {
    navigate('/login');
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div 
            className="inline-block px-4 py-1 rounded-full text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white"
          >
            Novo CRM da Bela Blue Beauty
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            Gerencie todos os dados e relatórios com <span style={{ color: themeConfig.accentColor || '#ddcdc0' }}>Inteligência Artificial</span>
          </h1>
          <p className="text-xl text-white/70">
            Otimize processos, aumente a produtividade e tome decisões estratégicas com o CRM da Bela Blue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={handleStartFreeDemo}
              className="text-lg px-8 gap-2 group relative overflow-hidden"
              style={{ 
                backgroundColor: themeConfig.accentColor || '#ddcdc0',
                color: themeConfig.primaryColor || '#001440'
              }}
            >
              <span>Experimente Agora</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -z-10 bg-white/20 blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 bg-white/20 border-white/50 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              Saiba Mais
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex items-center space-x-2 text-white/70">
              <Database className="h-5 w-5 text-white" />
              <span>Dados seguros</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <BarChart className="h-5 w-5 text-white" />
              <span>Análise em tempo real</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <Layers className="h-5 w-5 text-white" />
              <span>Integração completa</span>
            </div>
          </div>
        </div>
        
        <div className="relative rounded-lg overflow-hidden shadow-2xl hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10"></div>
          <div className="relative z-10 aspect-video p-2">
            <img
              src={
                window.location.origin + '/lovable-uploads/d26651de-acd9-4751-833d-885496a264ea.png'
              }
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/logo.svg';
              }}
              alt="Bela Blue CRM Dashboard"
              className="w-full rounded-lg shadow-xl transform hover:scale-[1.02] transition-all duration-500 ease-out hover:rotate-1"
            />
            
            {/* Elementos flutuantes no dashboard */}
            <div className="absolute top-[20%] right-[20%] h-16 w-16 bg-blue-500/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-[30%] left-[10%] h-12 w-12 bg-purple-500/20 rounded-full blur-lg animate-pulse"></div>
            
            {/* Linhas de dados simuladas */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 border border-white/5 rounded-lg" style={{background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.1) 40%, transparent 70%)'}}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
