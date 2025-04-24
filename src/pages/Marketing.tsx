
import React from 'react';
import { useMarketingData } from './marketing/hooks/useMarketingData';
import MarketingFilters from './marketing/components/filters/MarketingFilters';
import MarketingMetrics from './marketing/components/metrics/MarketingMetrics';
import MarketingTabs from './marketing/components/navigation/MarketingTabs';

const Marketing = () => {
  const {
    dateRange,
    setDateRange,
    periodView,
    setPeriodView,
    getTimeData,
    calculateTotalROI,
    calculateGrowth,
  } = useMarketingData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const timeData = getTimeData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing</h2>
          <p className="text-muted-foreground">Análise de performance das campanhas de marketing e tráfego pago.</p>
        </div>
        <MarketingFilters dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      <MarketingMetrics 
        timeData={timeData}
        calculateTotalROI={calculateTotalROI}
        calculateGrowth={calculateGrowth}
        formatCurrency={formatCurrency}
      />

      <MarketingTabs 
        periodView={periodView}
        setPeriodView={setPeriodView}
        timeData={timeData}
      />
    </div>
  );
};

export default Marketing;
