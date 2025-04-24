
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adPlatformData, roiData, investmentData } from '../../data/mockData';
import PlatformMetricCard from '../PlatformMetricCard';

const PlatformsTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Desempenho por Plataforma</CardTitle>
            <CardDescription>Faturamento mensal por canal de anúncios</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={adPlatformData}
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
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>ROI por Plataforma</CardTitle>
            <CardDescription>Evolução do retorno sobre investimento</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={roiData}
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
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};

export default PlatformsTab;
