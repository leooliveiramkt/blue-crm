
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface PlatformData {
  name: string;
  value: number;
  color: string;
}

interface PlatformDistributionPieChartProps {
  data: PlatformData[];
}

const PlatformDistributionPieChart = ({ data }: PlatformDistributionPieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, ""]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PlatformDistributionPieChart;
