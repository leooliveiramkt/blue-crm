
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export const SubheadlineSection = () => {
  const { themeConfig } = useTheme();
  
  return (
    <section 
      className="py-16"
      style={{
        backgroundColor: `${themeConfig.primaryColor}10`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Uma plataforma completa que integra automação inteligente, análise de dados em tempo real e sugestões 
            estratégicas personalizadas para impulsionar seus resultados.
          </h2>
        </div>
      </div>
    </section>
  );
};
