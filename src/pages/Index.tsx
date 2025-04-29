
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ThemeConfig } from '@/config/theme';

const Index = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleStartFreeDemo = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/50 dark:to-blue-950/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          {ThemeConfig.logo ? (
            <img 
              src={ThemeConfig.logo} 
              alt={ThemeConfig.companyName} 
              className="h-10 w-auto object-contain" 
            />
          ) : (
            <span className="text-2xl font-bold" style={{ color: ThemeConfig.primaryColor }}>
              {ThemeConfig.companyName || "Bela Blue"}
            </span>
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={handleNavigateToLogin}
          style={{ borderColor: ThemeConfig.primaryColor, color: ThemeConfig.primaryColor }}
        >
          Entrar
        </Button>
      </header>

      {/* Hero Section */}
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

      {/* Subheadline Section */}
      <section className="bg-blue-50 dark:bg-blue-950/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Uma plataforma completa que integra automação inteligente, análise de dados em tempo real e sugestões 
              estratégicas personalizadas para impulsionar seus resultados.
            </h2>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Benefícios-Chave</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-t-4" style={{ borderTopColor: ThemeConfig.primaryColor }}>
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 flex items-center justify-center mb-4" 
                style={{ backgroundColor: `${ThemeConfig.primaryColor}20` }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"
                  style={{ color: ThemeConfig.primaryColor }}>
                  <path d="M14 13.341C14 14.810 10 14.810 10 13.341" />
                  <path d="M10 10.341C10 8.872 14 8.872 14 10.341" />
                  <rect width="16" height="20" x="4" y="2" rx="2" />
                  <path d="M12 18h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Automação Inteligente de Processos</h3>
              <p className="text-muted-foreground">
                Reduza tarefas manuais com fluxos de trabalho automatizados, liberando sua equipe para focar no que realmente importa.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4" style={{ borderTopColor: ThemeConfig.primaryColor }}>
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 flex items-center justify-center mb-4" 
                style={{ backgroundColor: `${ThemeConfig.primaryColor}20` }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"
                  style={{ color: ThemeConfig.primaryColor }}>
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Análise de Dados em Tempo Real</h3>
              <p className="text-muted-foreground">
                Monitore indicadores-chave instantaneamente e obtenha insights valiosos para decisões mais assertivas.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4" style={{ borderTopColor: ThemeConfig.primaryColor }}>
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 flex items-center justify-center mb-4" 
                style={{ backgroundColor: `${ThemeConfig.primaryColor}20` }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"
                  style={{ color: ThemeConfig.primaryColor }}>
                  <path d="M12 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Sugestões Estratégicas com IA</h3>
              <p className="text-muted-foreground">
                Receba recomendações adaptadas ao seu negócio para otimizar campanhas, melhorar o atendimento ao cliente e aumentar as vendas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
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
    </div>
  );
};

export default Index;
