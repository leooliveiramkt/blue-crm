
import { useState, useEffect } from 'react';

interface MonthlyRevenueItem {
  name: string;
  value: number;
}

export const useRevenueData = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueItem[]>([
    { name: 'Jan', value: 58000 },
    { name: 'Fev', value: 65000 },
    { name: 'Mar', value: 72000 },
    { name: 'Abr', value: 80000 },
    { name: 'Mai', value: 87000 },
    { name: 'Jun', value: 93000 },
    { name: 'Jul', value: 98000 },
    { name: 'Ago', value: 104000 },
    { name: 'Set', value: 112000 },
    { name: 'Out', value: 118000 },
    { name: 'Nov', value: 124000 },
    { name: 'Dez', value: 142000 },
  ]);

  const [yearlyComparison, setYearlyComparison] = useState({
    currentYear: 1150000,
    previousYear: 980000
  });

  const totalRevenue = yearlyComparison.currentYear;
  const growth = Math.round((yearlyComparison.currentYear / yearlyComparison.previousYear - 1) * 100);

  return {
    monthlyRevenue,
    yearlyComparison,
    totalRevenue,
    growth
  };
};
