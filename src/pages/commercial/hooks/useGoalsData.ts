
import { useState } from 'react';

interface TeamGoal {
  name: string;
  description: string;
  target: number;
  current: number;
  progress: number;
}

interface SellerGoal {
  name: string;
  target: number;
  current: number;
  progress: number;
}

interface DailyGoal {
  date: string;
  sales: number;
  value: number;
  progress: number;
}

export const useGoalsData = () => {
  const [teamGoals, setTeamGoals] = useState<TeamGoal[]>([
    {
      name: 'Meta Mensal',
      description: 'Meta de vendas para o mês atual',
      target: 300000,
      current: 183000,
      progress: 61
    },
    {
      name: 'Meta Trimestral',
      description: 'Meta de vendas para o trimestre atual',
      target: 900000,
      current: 683000,
      progress: 76
    },
    {
      name: 'Meta Anual',
      description: 'Meta de vendas para o ano atual',
      target: 3600000,
      current: 2450000,
      progress: 68
    },
    {
      name: 'Meta de Novos Clientes',
      description: 'Novos clientes para o mês atual',
      target: 50,
      current: 38,
      progress: 76
    }
  ]);

  const [sellerGoals, setSellerGoals] = useState<SellerGoal[]>([
    { name: 'Ana Silva', target: 60000, current: 48000, progress: 80 },
    { name: 'Roberto Almeida', target: 55000, current: 42000, progress: 76 },
    { name: 'Carlos Eduardo', target: 50000, current: 35000, progress: 70 },
    { name: 'Juliana Costa', target: 45000, current: 30000, progress: 67 },
    { name: 'Marcos Oliveira', target: 40000, current: 25000, progress: 63 },
    { name: 'Patrícia Santos', target: 35000, current: 20000, progress: 57 }
  ]);

  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([
    { date: '01/05/2025', sales: 15, value: 12500, progress: 104 },
    { date: '02/05/2025', sales: 12, value: 9800, progress: 82 },
    { date: '03/05/2025', sales: 18, value: 14300, progress: 119 },
    { date: '04/05/2025', sales: 10, value: 8200, progress: 68 },
    { date: '05/05/2025', sales: 13, value: 11000, progress: 92 },
    { date: '06/05/2025', sales: 16, value: 13500, progress: 113 },
    { date: '07/05/2025', sales: 14, value: 11800, progress: 98 }
  ]);

  return {
    teamGoals,
    sellerGoals,
    dailyGoals
  };
};
