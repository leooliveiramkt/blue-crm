
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart } from 'recharts';
import { revenueData } from '../../data/mockData';

interface ProjectionsTabProps {
  periodView: string;
  timeData: any[];
}

const ProjectionsTab = ({ periodView, timeData }: ProjectionsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projeção de Faturamento vs Investimento</CardTitle>
            <CardDescription>Análise projetada para 2025</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
                <YAxis yAxisId="right" orientation="right" stroke="#34A853" />
                <Tooltip formatter={(value, name) => [
                  `R$ ${Number(value).toLocaleString()}`,
                  name === "revenue" ? "Faturamento" : "Investimento"
                ]} />
                <Legend />
                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Faturamento" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.6}
                />
                <Area 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="investment" 
                  name="Investimento" 
                  stroke="#34A853" 
                  fill="#34A853" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projeção de ROI</CardTitle>
            <CardDescription>Tendência de retorno sobre investimento</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={timeData.map(item => ({
                  ...item,
                  roi: (item.revenue / item.investment).toFixed(2)
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}x`, "ROI"]} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="roi" 
                  name="ROI" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }} 
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento Projetado</CardTitle>
            <CardDescription>Taxa de crescimento da receita</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData.slice(0, -1).map((item, index) => {
                  const nextMonth = revenueData[index + 1];
                  return {
                    name: item.name,
                    growth: ((nextMonth.revenue - item.revenue) / item.revenue * 100).toFixed(1)
                  };
                })}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Crescimento"]} />
                <Bar 
                  dataKey="growth" 
                  name="Crescimento" 
                  fill="#9b87f5" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meta vs Realização</CardTitle>
            <CardDescription>Comparativo com metas estabelecidas</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={revenueData.map(item => ({
                  ...item,
                  meta: item.revenue * 1.2
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, ""]} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Realizado" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="meta" 
                  name="Meta" 
                  stroke="#ff0000" 
                  strokeDasharray="5 5"
                  strokeWidth={2} 
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectionsTab;
