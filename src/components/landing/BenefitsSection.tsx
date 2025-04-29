
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeConfig } from '@/config/theme';

export const BenefitsSection = () => {
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
      <h2 className="text-3xl font-bold text-center mb-12">Benefícios-Chave</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <Card key={index} className="border-t-4" style={{ borderTopColor: ThemeConfig.primaryColor }}>
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 flex items-center justify-center mb-4" 
                style={{ backgroundColor: `${ThemeConfig.primaryColor}20` }}>
                <div style={{ color: ThemeConfig.primaryColor }}>
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
