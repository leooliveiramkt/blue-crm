
import React from 'react';
import { campaignData, influencerData, investmentData } from '../../data/mockData';
import { useMarketingData } from '../../hooks/useMarketingData';
import RevenueSummarySection from '../sections/RevenueSummarySection';
import PerformanceTablesSection from '../sections/PerformanceTablesSection';

const OverviewTab = () => {
  const { getTimeData } = useMarketingData();
  const revenueData = getTimeData();

  return (
    <div className="space-y-6">
      <RevenueSummarySection revenueData={revenueData} investmentData={investmentData} />
      <PerformanceTablesSection campaignData={campaignData} influencerData={influencerData} />
    </div>
  );
};

export default OverviewTab;
