
import React from 'react';
import { adPlatformData, roiData, investmentData } from '../../data/mockData';
import PlatformPerformanceSection from '../sections/PlatformPerformanceSection';
import PlatformMetricsSection from '../sections/PlatformMetricsSection';

const PlatformsTab = () => {
  return (
    <div className="space-y-6">
      <PlatformPerformanceSection adPlatformData={adPlatformData} roiData={roiData} />
      <PlatformMetricsSection investmentData={investmentData} />
    </div>
  );
};

export default PlatformsTab;
