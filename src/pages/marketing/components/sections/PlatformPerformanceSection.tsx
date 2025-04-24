
import React from 'react';
import PlatformPerformanceChart from '../charts/PlatformPerformanceChart';
import PlatformROIChart from '../charts/PlatformROIChart';

interface PlatformData {
  name: string;
  facebook: number;
  google: number;
  tiktok: number;
  taboola: number;
  outbrain: number;
}

interface PlatformPerformanceSectionProps {
  adPlatformData: PlatformData[];
  roiData: PlatformData[];
}

const PlatformPerformanceSection = ({ adPlatformData, roiData }: PlatformPerformanceSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
      <PlatformPerformanceChart data={adPlatformData} />
      <PlatformROIChart data={roiData} />
    </div>
  );
};

export default PlatformPerformanceSection;
