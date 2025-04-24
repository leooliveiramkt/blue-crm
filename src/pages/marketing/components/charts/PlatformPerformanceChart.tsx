
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PlatformData {
  name: string;
  facebook: number;
  google: number;
  tiktok: number;
  taboola: number;
  outbrain: number;
}

interface PlatformPerformanceChartProps {
  data: PlatformData[];
}

const PlatformPerformanceChart = ({ data }: PlatformPerformanceChartProps) => {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Desempenho por Plataforma</CardTitle>
        <CardDescription>Faturamento mensal por canal de anúncios</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, ""]} />
            <Legend />
            <Area type="monotone" dataKey="facebook" name="Facebook" stackId="1" stroke="#4267B2" fill="#4267B2" />
            <Area type="monotone" dataKey="google" name="Google" stackId="1" stroke="#34A853" fill="#34A853" />
            <Area type="monotone" dataKey="tiktok" name="TikTok" stackId="1" stroke="#000000" fill="#6c6c6c" />
            <Area type="monotone" dataKey="taboola" name="Taboola" stackId="1" stroke="#004D9C" fill="#004D9C" />
            <Area type="monotone" dataKey="outbrain" name="Outbrain" stackId="1" stroke="#F18E1C" fill="#F18E1C" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PlatformPerformanceChart;
