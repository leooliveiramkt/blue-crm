
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ROIData {
  name: string;
  facebook: number;
  google: number;
  tiktok: number;
  taboola: number;
  outbrain: number;
}

interface PlatformROIChartProps {
  data: ROIData[];
}

const PlatformROIChart = ({ data }: PlatformROIChartProps) => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>ROI por Plataforma</CardTitle>
        <CardDescription>Evolução do retorno sobre investimento</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}x`, ""]} />
            <Legend />
            <Line type="monotone" dataKey="facebook" name="Facebook" stroke="#4267B2" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="google" name="Google" stroke="#34A853" strokeWidth={2} />
            <Line type="monotone" dataKey="tiktok" name="TikTok" stroke="#000000" strokeWidth={2} />
            <Line type="monotone" dataKey="taboola" name="Taboola" stroke="#004D9C" strokeWidth={2} />
            <Line type="monotone" dataKey="outbrain" name="Outbrain" stroke="#F18E1C" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PlatformROIChart;
