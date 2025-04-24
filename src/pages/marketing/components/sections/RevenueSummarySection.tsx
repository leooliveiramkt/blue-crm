
import React from 'react';
import RevenueVsInvestmentChart from '../charts/RevenueVsInvestmentChart';
import InvestmentDistributionChart from '../charts/InvestmentDistributionChart';

interface RevenueSummarySectionProps {
  revenueData: Array<{
    name: string;
    revenue: number;
    investment: number;
  }>;
  investmentData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const RevenueSummarySection = ({ revenueData, investmentData }: RevenueSummarySectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <RevenueVsInvestmentChart data={revenueData} />
      <InvestmentDistributionChart data={investmentData} />
    </div>
  );
};

export default RevenueSummarySection;
