
import React from 'react';
import { influencerData } from '../../data/mockData';
import InfluencerStatsSection from '../sections/InfluencerStatsSection';
import InfluencerRankingSection from '../sections/InfluencerRankingSection';

const platformDistributionData = [
  { name: 'Instagram', value: 40, color: '#E1306C' },
  { name: 'TikTok', value: 30, color: '#000000' },
  { name: 'YouTube', value: 20, color: '#FF0000' },
  { name: 'Twitter', value: 10, color: '#1DA1F2' },
];

const InfluencersTab = () => {
  return (
    <div className="space-y-6">
      <InfluencerStatsSection 
        influencerData={influencerData} 
        platformDistributionData={platformDistributionData} 
      />
      <InfluencerRankingSection influencerData={influencerData} />
    </div>
  );
};

export default InfluencersTab;
