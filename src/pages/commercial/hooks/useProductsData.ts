
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
    { name: 'Detox Slim Caps', quantity: 145, value: 58000, percentage: 21.5 },
    { name: 'Colágeno Hidrolisado', quantity: 128, value: 51200, percentage: 19 },
    { name: 'Mentoria Premium 90 dias', quantity: 32, value: 48000, percentage: 17.8 },
    { name: 'Thermogenics Plus', quantity: 94, value: 32900, percentage: 12.2 },
    { name: 'Curso Online Emagrecimento Saudável', quantity: 45, value: 22500, percentage: 8.3 }
  ]);

  const [lowProducts, setLowProducts] = useState<Product[]>([
    { name: 'Shake Proteico Baunilha', quantity: 12, value: 4800, percentage: 1.8, daysSinceLastSale: 35 },
    { name: 'Fibras Naturais Mix', quantity: 8, value: 3200, percentage: 1.2, daysSinceLastSale: 28 },
    { name: 'Chá Verde em Cápsulas', quantity: 15, value: 3000, percentage: 1.1, daysSinceLastSale: 22 },
    { name: 'Guia de Receitas Saudáveis', quantity: 5, value: 1000, percentage: 0.4, daysSinceLastSale: 42 },
    { name: 'Berinjela em Cápsulas', quantity: 7, value: 1400, percentage: 0.5, daysSinceLastSale: 25 }
  ]);

  const [productCategories, setProductCategories] = useState<CategoryProduct[]>([
    { name: 'Suplementos Termogênicos', value: 120000, percentage: 38 },
    { name: 'Suplementos Naturais', value: 85000, percentage: 27 },
    { name: 'Cursos e Mentorias', value: 70000, percentage: 22 },
    { name: 'Shakes e Bebidas', value: 28000, percentage: 9 },
    { name: 'Materiais Digitais', value: 12000, percentage: 4 }
  ]);

  const [abcAnalysis, setAbcAnalysis] = useState<AbcProduct[]>([
    { name: 'Detox Slim Caps', value: 58000, accumPercentage: 21.5, classification: 'A' },
    { name: 'Colágeno Hidrolisado', value: 51200, accumPercentage: 40.5, classification: 'A' },
    { name: 'Mentoria Premium 90 dias', value: 48000, accumPercentage: 58.3, classification: 'A' },
    { name: 'Thermogenics Plus', value: 32900, accumPercentage: 70.5, classification: 'A' },
    { name: 'Curso Online Emagrecimento Saudável', value: 22500, accumPercentage: 78.8, classification: 'B' },
    { name: 'Kit Completo Emagrecimento', value: 18000, accumPercentage: 85.5, classification: 'B' },
    { name: 'Ômega 3 Premium', value: 12000, accumPercentage: 90.0, classification: 'B' },
    { name: 'Shake Proteico Chocolate', value: 9500, accumPercentage: 93.5, classification: 'C' },
    { name: 'Fibras Naturais Mix', value: 8200, accumPercentage: 96.5, classification: 'C' },
    { name: 'Chá Verde em Cápsulas', value: 7500, accumPercentage: 99.0, classification: 'C' }
  ]);

  return {
    topProducts,
    lowProducts,
    productCategories,
    abcAnalysis
  };
};
