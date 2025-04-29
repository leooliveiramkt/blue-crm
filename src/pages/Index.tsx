
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { SubheadlineSection } from '@/components/landing/SubheadlineSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { useTheme } from '@/context/ThemeContext';

const Index = () => {
  const { themeConfig } = useTheme();
  const [showFloatingElements, setShowFloatingElements] = useState(false);

  useEffect(() => {
    // Adiciona um pequeno atraso para que os elementos apareçam com animação
    setTimeout(() => setShowFloatingElements(true), 300);
  }, []);
  
  return (
    <div 
      className="min-h-screen bg-[#001440] relative overflow-hidden"
    >
      {/* Elementos flutuantes decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculos/bolhas flutuantes com animação */}
        <div 
          className={`absolute top-[15%] right-[10%] h-40 w-40 rounded-full bg-opacity-10 bg-white blur-xl 
            transition-all duration-1000 ease-out ${showFloatingElements ? 'opacity-20' : 'opacity-0 translate-y-8'}`}
          style={{ animationDuration: '15s', animationName: 'float', animationIterationCount: 'infinite', animationDirection: 'alternate' }}
        ></div>
        <div 
          className={`absolute top-[70%] left-[5%] h-64 w-64 rounded-full bg-opacity-5 bg-[${themeConfig.accentColor}] blur-xl 
            transition-all duration-1000 delay-300 ease-out ${showFloatingElements ? 'opacity-20' : 'opacity-0 translate-y-8'}`} 
          style={{ animationDuration: '20s', animationName: 'float-reverse', animationIterationCount: 'infinite', animationDirection: 'alternate' }}
        ></div>
        <div 
          className={`absolute top-[40%] right-[30%] h-32 w-32 rounded-full bg-opacity-10 bg-[${themeConfig.accentColor}] blur-lg 
            transition-all duration-1000 delay-500 ease-out ${showFloatingElements ? 'opacity-15' : 'opacity-0 translate-y-8'}`}
          style={{ animationDuration: '12s', animationName: 'pulse', animationIterationCount: 'infinite', animationDirection: 'alternate' }}
        ></div>
        
        {/* Grade/linhas de dados */}
        <div className="absolute inset-0 bg-[url('/lovable-uploads/grid-pattern.png')] bg-repeat opacity-5"></div>
        
        {/* Raio de luz */}
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-b from-blue-400/5 to-transparent rotate-12 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <HeroSection />
        <SubheadlineSection />
        <BenefitsSection />
        <CTASection />
        <Footer />
      </div>
      
      {/* Estilos para as animações */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes float-reverse {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default Index;
