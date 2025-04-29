
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export const SubheadlineSection = () => {
  const { themeConfig } = useTheme();
  
  return (
    <section 
      className="py-16 relative overflow-hidden"
      style={{
        backgroundColor: `${themeConfig.primaryColor}40`,
      }}
    >
      {/* Elementos de fundo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">
            Uma plataforma completa que integra automação inteligente, análise de dados em tempo real e sugestões 
            estratégicas personalizadas para impulsionar seus resultados.
          </h2>
          
          <div className="flex justify-center space-x-6 mt-12">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-white mb-2">99%</div>
              <div className="text-white/70">Precisão de dados</div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-white mb-2">+45%</div>
              <div className="text-white/70">Aumento em produtividade</div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/70">Suporte ao cliente</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
