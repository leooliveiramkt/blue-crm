
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeConfig } from '@/config/theme';

export const Footer = () => {
  return (
    <footer className="bg-[#001020] text-white py-16 relative overflow-hidden">
      {/* Elementos de fundo */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/grid-pattern.png')] bg-repeat opacity-5"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center">
              {ThemeConfig.logo ? (
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-white/5 blur"></div>
                  <img 
                    src={ThemeConfig.logo} 
                    alt={ThemeConfig.companyName} 
                    className="h-8 w-auto object-contain relative brightness-125" 
                  />
                </div>
              ) : (
                <span className="text-xl font-bold text-white">
                  {ThemeConfig.companyName || "Bela Blue"}
                </span>
              )}
            </div>
            <p className="text-white/70 text-sm max-w-xs">
              Transformando a gestão de negócios com soluções avançadas de IA e análise de dados em tempo real.
            </p>
            <p className="mt-2 text-white/40 text-sm">
              © {new Date().getFullYear()} Todos os direitos reservados.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Produtos</h3>
            <ul className="space-y-2">
              <li><Button variant="link" className="text-white/70 hover:text-white p-0 h-auto">CRM Avançado</Button></li>
              <li><Button variant="link" className="text-white/70 hover:text-white p-0 h-auto">Análise de Dados</Button></li>
              <li><Button variant="link" className="text-white/70 hover:text-white p-0 h-auto">Marketing IA</Button></li>
              <li><Button variant="link" className="text-white/70 hover:text-white p-0 h-auto">Atendimento ao Cliente</Button></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Empresa</h3>
            <ul className="space-y-2">
              <li><Button variant="link" className="text-white/70 hover:text-white p-0 h-auto">Sobre Nós</Button></li>
              <li><Button variant="link" className="text-white/70 hover:text-white p-0 h-auto">Carreiras</Button></li>
              <li><Button variant="link" className="text-white/70 hover:text-white p-0 h-auto">Blog</Button></li>
              <li><Button variant="link" className="text-white/70 hover:text-white p-0 h-auto">Contato</Button></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Siga-nos</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
            
            <div className="pt-4">
              <h3 className="text-lg font-medium text-white mb-3">Inscreva-se</h3>
              <div className="flex gap-2">
                <input type="email" placeholder="Seu email" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white/30" />
                <Button className="bg-white text-[#001440] hover:bg-white/90 font-medium">
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
