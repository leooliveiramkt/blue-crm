
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InfluencerChartData {
  name: string;
  revenue: number;
}

interface InfluencerBarChartProps {
  data: InfluencerChartData[];
}

const InfluencerBarChart = ({ data }: InfluencerBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
        <YAxis />
        <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, ""]} />
        <Bar dataKey="revenue" name="Faturamento" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default InfluencerBarChart;
