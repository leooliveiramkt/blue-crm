
import React from 'react';
import { SearchOrderForm } from './order-tracking/components/SearchOrderForm';
import { AIAnalysisCard } from './order-tracking/components/AIAnalysisCard';
import { AttributionSummaryCard } from './order-tracking/components/AttributionSummaryCard';
import { PlatformDataTabs } from './order-tracking/components/PlatformDataTabs';
import { InfoCard } from './order-tracking/components/InfoCard';
import { useOrderTracking } from './order-tracking/hooks/useOrderTracking';

const OrderTracking = () => {
  const {
    orderCode,
    setOrderCode,
    isSearching,
    isAnalyzing,
    trackingData,
    error,
    handleSearch,
    analyzeWithAI
  } = useOrderTracking();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Rastreamento de Pedidos</h2>
        <p className="text-muted-foreground">
          Consulte informações detalhadas de rastreamento de pedidos em múltiplas plataformas.
        </p>
      </div>

      <SearchOrderForm
        orderCode={orderCode}
        setOrderCode={setOrderCode}
        handleSearch={handleSearch}
        isSearching={isSearching}
        error={error}
      />

      {trackingData && (
        <>
          <AIAnalysisCard 
            isAnalyzing={isAnalyzing} 
            aiAnalysis={trackingData.aiAnalysis} 
            analyzeWithAI={analyzeWithAI}
          />

          {trackingData.summary && (
            <AttributionSummaryCard summary={trackingData.summary} />
          )}

          <PlatformDataTabs trackingData={trackingData} />
          
          <InfoCard />
        </>
      )}
    </div>
  );
};

export default OrderTracking;
