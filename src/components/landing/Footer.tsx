
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeConfig } from '@/config/theme';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              {ThemeConfig.logo ? (
                <img 
                  src={ThemeConfig.logo} 
                  alt={ThemeConfig.companyName} 
                  className="h-8 w-auto object-contain invert-[0.8]" 
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {ThemeConfig.companyName || "Bela Blue"}
                </span>
              )}
            </div>
            <p className="mt-2 text-slate-400 text-sm">
              © {new Date().getFullYear()} Todos os direitos reservados.
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Sobre
            </Button>
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Blog
            </Button>
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Contato
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
