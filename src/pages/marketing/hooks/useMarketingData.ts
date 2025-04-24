import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { revenueData, quarterlyData, biannualData, annualData } from '../data/mockData';

export type PeriodView = "monthly" | "bimonthly" | "quarterly" | "biannual" | "annual" | "projections";

export const useMarketingData = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 5, 30),
  });

  const [periodView, setPeriodView] = useState<PeriodView>("monthly");

  const getTimeData = () => {
    switch(periodView) {
      case "monthly":
        return revenueData;
      case "bimonthly":
        return revenueData.filter((_, index) => index % 2 === 0)
          .map((item, index) => {
            const nextMonth = revenueData[index * 2 + 1];
            return nextMonth ? {
              name: `${item.name}-${nextMonth.name}`,
              revenue: item.revenue + nextMonth.revenue,
              investment: item.investment + nextMonth.investment
            } : item;
          });
      case "quarterly":
        return quarterlyData;
      case "biannual":
        return biannualData;
      case "annual":
        return annualData;
      case "projections":
        return revenueData;
      default:
        return revenueData;
    }
  };

  const calculateTotalROI = () => {
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalInvestment = revenueData.reduce((sum, item) => sum + item.investment, 0);
    return (totalRevenue / totalInvestment).toFixed(2);
  };

  const calculateGrowth = () => {
    if (revenueData.length < 2) return 0;
    const firstMonth = revenueData[0].revenue;
    const lastMonth = revenueData[revenueData.length - 1].revenue;
    return (((lastMonth - firstMonth) / firstMonth) * 100).toFixed(1);
  };

  return {
    dateRange,
    setDateRange,
    periodView,
    setPeriodView,
    getTimeData,
    calculateTotalROI,
    calculateGrowth,
  };
};
