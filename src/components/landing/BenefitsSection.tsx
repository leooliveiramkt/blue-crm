
import React from 'react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';

export const BenefitsSection = () => {
  const { themeConfig } = useTheme();
  
  const benefits = [
    {
      title: "Automação Inteligente de Processos",
      description: "Reduza tarefas manuais com fluxos de trabalho automatizados, liberando sua equipe para focar no que realmente importa.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M14 13.341C14 14.810 10 14.810 10 13.341" />
          <path d="M10 10.341C10 8.872 14 8.872 14 10.341" />
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <path d="M12 18h.01" />
        </svg>
      )
    },
    {
      title: "Análise de Dados em Tempo Real",
      description: "Monitore indicadores-chave instantaneamente e obtenha insights valiosos para decisões mais assertivas.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      )
    },
    {
      title: "Sugestões Estratégicas com IA",
      description: "Receba recomendações adaptadas ao seu negócio para otimizar campanhas, melhorar o atendimento ao cliente e aumentar as vendas.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M12 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      )
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-3xl font-bold text-center mb-12 text-white">Benefícios-Chave</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <Card key={index} className="backdrop-blur-md bg-white/5 border-none shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-300 group overflow-hidden relative">
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-6 relative z-10">
              <div className="rounded-full w-14 h-14 flex items-center justify-center mb-6 bg-gradient-to-br from-white/10 to-transparent border border-white/10">
                <div className="text-white">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
              <p className="text-white/70">
                {benefit.description}
              </p>
            </div>
            
            <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-500 ease-out"></div>
          </Card>
        ))}
      </div>
      
      {/* Seção de estatísticas */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl"></div>
          
          <h3 className="text-2xl font-bold mb-6 text-white">Análise de Dados Revolucionária</h3>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Visualização de dados</span>
                <span className="text-white">90%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" style={{width: '90%'}}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Integração de sistemas</span>
                <span className="text-white">85%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Automação de processos</span>
                <span className="text-white">95%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" style={{width: '95%'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-gradient-to-tl from-white/5 to-transparent rounded-full blur-2xl"></div>
          
          <h3 className="text-2xl font-bold mb-6 text-white">Tecnologias Integradas</h3>
          
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center text-center hover:bg-white/15 transition-colors">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400/30 to-transparent flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"></path>
                </svg>
              </div>
              <span className="text-white font-medium">IA Avançada</span>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center text-center hover:bg-white/15 transition-colors">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400/30 to-transparent flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6" y2="6"></line>
                  <line x1="6" y1="18" x2="6" y2="18"></line>
                </svg>
              </div>
              <span className="text-white font-medium">Armazenamento Seguro</span>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center text-center hover:bg-white/15 transition-colors">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400/30 to-transparent flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span className="text-white font-medium">Análises Avançadas</span>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center text-center hover:bg-white/15 transition-colors">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400/30 to-transparent flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="text-white font-medium">Personalização</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
