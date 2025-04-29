
import React from 'react';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { SubheadlineSection } from '@/components/landing/SubheadlineSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { useTheme } from '@/context/ThemeContext';

const Index = () => {
  const { themeConfig } = useTheme();
  
  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${themeConfig.primaryColor}10 0%, ${themeConfig.accentColor}30 100%)`,
      }}
    >
      <Header />
      <HeroSection />
      <SubheadlineSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
