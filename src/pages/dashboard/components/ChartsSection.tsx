
import React from 'react';
import SalesPerformanceChart from './SalesPerformanceChart';
import SalesDistributionChart from './SalesDistributionChart';

const ChartsSection = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      <SalesPerformanceChart />
      <SalesDistributionChart />
    </div>
  );
};

export default ChartsSection;
