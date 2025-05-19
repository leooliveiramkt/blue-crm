
import { useState, useEffect } from 'react';

interface SalesPerson {
  id: string;
  name: string;
  sales: number;
  totalValue: number;
  goalPercentage: number;
}

export const useSalesTeamData = () => {
  const [salespeople, setSalespeople] = useState<SalesPerson[]>([
    {
      id: '1',
      name: 'Ana Silva',
      sales: 42,
      totalValue: 78500,
      goalPercentage: 110
    },
    {
      id: '2',
      name: 'Roberto Almeida',
      sales: 38,
      totalValue: 65200,
      goalPercentage: 95
    },
    {
      id: '3',
      name: 'Carlos Eduardo',
      sales: 35,
      totalValue: 61800,
      goalPercentage: 90
    },
    {
      id: '4',
      name: 'Juliana Costa',
      sales: 30,
      totalValue: 45600,
      goalPercentage: 76
    },
    {
      id: '5',
      name: 'Marcos Oliveira',
      sales: 28,
      totalValue: 42300,
      goalPercentage: 70
    },
    {
      id: '6',
      name: 'Patrícia Santos',
      sales: 26,
      totalValue: 39800,
      goalPercentage: 65
    },
    {
      id: '7',
      name: 'Luiz Fernando',
      sales: 22,
      totalValue: 34500,
      goalPercentage: 58
    }
  ]);

  return { salespeople };
};
