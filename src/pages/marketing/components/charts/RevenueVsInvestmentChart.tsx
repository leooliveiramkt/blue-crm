
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueVsInvestmentChartProps {
  data: Array<{
    name: string;
    revenue: number;
    investment: number;
  }>;
  title?: string;
  description?: string;
}

const RevenueVsInvestmentChart = ({ 
  data,
  title = "Faturamento vs Investimento",
  description = "Análise comparativa de receita e custos com marketing"
}: RevenueVsInvestmentChartProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
            <YAxis yAxisId="right" orientation="right" stroke="#34A853" />
            <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, ""]} />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" name="Faturamento" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="investment" name="Investimento" fill="#34A853" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueVsInvestmentChart;
