
import { useState } from 'react';

interface Product {
  name: string;
  quantity: number;
  value: number;
  percentage: number;
  daysSinceLastSale?: number;
}

interface CategoryProduct {
  name: string;
  value: number;
  percentage: number;
}

interface AbcProduct {
  name: string;
  value: number;
  accumPercentage: number;
  classification: 'A' | 'B' | 'C';
}

export const useProductsData = () => {
  const [topProducts, setTopProducts] = useState<Product[]>([
    { name: 'Curso Avançado de Marketing', quantity: 45, value: 67500, percentage: 22.5 },
    { name: 'Formação Completa em Vendas', quantity: 38, value: 57000, percentage: 19 },
    { name: 'E-book Estratégias Digitais', quantity: 120, value: 36000, percentage: 12 },
    { name: 'Consultoria Personalizada', quantity: 15, value: 30000, percentage: 10 },
    { name: 'Workshop de Liderança', quantity: 25, value: 25000, percentage: 8.3 }
  ]);

  const [lowProducts, setLowProducts] = useState<Product[]>([
    { name: 'Curso Básico de Vendas', quantity: 5, value: 5000, percentage: 1.7, daysSinceLastSale: 45 },
    { name: 'Manual de Processos', quantity: 8, value: 4800, percentage: 1.6, daysSinceLastSale: 38 },
    { name: 'Assinatura Mensal', quantity: 3, value: 3000, percentage: 1, daysSinceLastSale: 30 },
    { name: 'Planilhas de Gestão', quantity: 12, value: 3600, percentage: 1.2, daysSinceLastSale: 28 },
    { name: 'Guia de Negociação', quantity: 10, value: 3000, percentage: 1, daysSinceLastSale: 25 }
  ]);

  const [productCategories, setProductCategories] = useState<CategoryProduct[]>([
    { name: 'Cursos Online', value: 150000, percentage: 50 },
    { name: 'Consultorias', value: 60000, percentage: 20 },
    { name: 'E-books', value: 45000, percentage: 15 },
    { name: 'Planilhas', value: 18000, percentage: 6 },
    { name: 'Assinaturas', value: 27000, percentage: 9 }
  ]);

  const [abcAnalysis, setAbcAnalysis] = useState<AbcProduct[]>([
    { name: 'Curso Avançado de Marketing', value: 67500, accumPercentage: 22.5, classification: 'A' },
    { name: 'Formação Completa em Vendas', value: 57000, accumPercentage: 41.5, classification: 'A' },
    { name: 'E-book Estratégias Digitais', value: 36000, accumPercentage: 53.5, classification: 'A' },
    { name: 'Consultoria Personalizada', value: 30000, accumPercentage: 63.5, classification: 'A' },
    { name: 'Workshop de Liderança', value: 25000, accumPercentage: 71.8, classification: 'B' },
    { name: 'Mentoria em Gestão', value: 22000, accumPercentage: 79.2, classification: 'B' },
    { name: 'Treinamento de Equipes', value: 18000, accumPercentage: 85.2, classification: 'B' },
    { name: 'Curso Básico de Vendas', value: 15000, accumPercentage: 90.2, classification: 'C' },
    { name: 'Manual de Processos', value: 12000, accumPercentage: 94.2, classification: 'C' },
    { name: 'Assinatura Mensal', value: 9000, accumPercentage: 97.2, classification: 'C' }
  ]);

  return {
    topProducts,
    lowProducts,
    productCategories,
    abcAnalysis
  };
};
