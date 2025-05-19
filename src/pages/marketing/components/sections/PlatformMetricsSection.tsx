
import React from 'react';
import PlatformMetricCard from '../PlatformMetricCard';

interface PlatformMetricsSectionProps {
  investmentData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const PlatformMetricsSection = ({ investmentData }: PlatformMetricsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {investmentData.map((platform) => (
        <PlatformMetricCard
          key={platform.name}
          name={platform.name}
          color={platform.color}
          share={`${platform.value}%`}
          roi={platform.name === 'Facebook' ? '3.5x' : 
               platform.name === 'Google' ? '4.2x' : 
               platform.name === 'TikTok' ? '2.9x' : 
               platform.name === 'Taboola' ? '2.3x' : '2.1x'}
          investment={platform.name === 'Facebook' ? 'R$ 245.000' : 
                      platform.name === 'Google' ? 'R$ 210.000' : 
                      platform.name === 'TikTok' ? 'R$ 140.000' : 
                      platform.name === 'Taboola' ? 'R$ 70.000' : 'R$ 35.000'}
          revenue={platform.name === 'Facebook' ? 'R$ 857.500' : 
                  platform.name === 'Google' ? 'R$ 882.000' : 
                  platform.name === 'TikTok' ? 'R$ 406.000' : 
                  platform.name === 'Taboola' ? 'R$ 161.000' : 'R$ 73.500'}
        />
      ))}
    </div>
  );
};

export default PlatformMetricsSection;
