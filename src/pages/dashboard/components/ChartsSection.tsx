
import React from 'react';
import SalesPerformanceChart from './SalesPerformanceChart';
import SalesDistributionChart from './SalesDistributionChart';

const ChartsSection = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-1 md:col-span-4">
        <SalesPerformanceChart />
      </div>
      <div className="col-span-1 md:col-span-3">
        <SalesDistributionChart />
      </div>
    </div>
  );
};

export default ChartsSection;
