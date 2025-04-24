
import React from 'react';
import { BarChart3, DollarSign, Target, TrendingUp } from 'lucide-react';
import MetricCard from '../MetricCard';

interface MarketingMetricsProps {
  timeData: Array<{
    revenue: number;
    investment: number;
  }>;
  calculateTotalROI: () => string;
  calculateGrowth: () => string;
  formatCurrency: (value: number) => string;
}

const MarketingMetrics = ({ timeData, calculateTotalROI, calculateGrowth, formatCurrency }: MarketingMetricsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard 
        title="Faturamento Total" 
        value={formatCurrency(timeData.reduce((sum, item) => sum + item.revenue, 0))} 
        description="Via Marketing"
        trend={`+${calculateGrowth()}%`} 
        trendUp={true}
        icon={DollarSign}
      />
      <MetricCard 
        title="Investimento" 
        value={formatCurrency(timeData.reduce((sum, item) => sum + item.investment, 0))} 
        description="Em tráfego pago" 
        trend="+28.3%" 
        trendUp={true}
        icon={BarChart3}
      />
      <MetricCard 
        title="ROI Geral" 
        value={calculateTotalROI()}
        description="Retorno sobre investimento" 
        trend="+18.6%" 
        trendUp={true}
        icon={TrendingUp}
      />
      <MetricCard 
        title="Campanhas Ativas" 
        value="32" 
        description="Nas principais plataformas" 
        trend="+4" 
        trendUp={true}
        icon={Target}
      />
    </div>
  );
};

export default MarketingMetrics;
