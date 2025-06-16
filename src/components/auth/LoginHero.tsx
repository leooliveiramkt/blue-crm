import React from 'react';
import { ThemeConfig } from '@/config/theme';

export const LoginHero: React.FC = () => {
  // Detecta se é cor ou imagem
  const isColor = ThemeConfig.loginBackground?.startsWith('#');
  return (
    <div 
      className="hidden md:flex md:w-1/2 items-center justify-center p-12"
      style={{
        background: isColor
          ? ThemeConfig.loginBackground
          : ThemeConfig.loginBackground
            ? `url(${ThemeConfig.loginBackground})`
            : '#0a1124',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-md text-white">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
          <h1 className="text-3xl font-bold mb-6">
            {ThemeConfig.tagline || "Gerencie seus negócios com eficiência"}
          </h1>
          <p className="text-lg opacity-90 mb-4">
            {ThemeConfig.description || "Plataforma completa de gestão para aumentar sua produtividade e acelerar resultados."}
          </p>
          
          {ThemeConfig.philosophicalQuote && (
            <blockquote className="border-l-4 border-white/30 pl-4 mt-6 italic opacity-90">
              {ThemeConfig.philosophicalQuote}
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
};
