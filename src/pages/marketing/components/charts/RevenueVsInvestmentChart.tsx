
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
  // Calcula o ROI médio para ajustar a escala do gráfico
  const averageROI = data.reduce((acc, item) => {
    return acc + (item.revenue / item.investment);
  }, 0) / data.length;

  // Formata o valor em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
          <div className="mt-1 text-sm text-muted-foreground">
            ROI Médio: {averageROI.toFixed(2)}x
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
            <XAxis dataKey="name" />
            <YAxis 
              yAxisId="revenue"
              orientation="left" 
              stroke="#34A853"
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <YAxis 
              yAxisId="investment"
              orientation="right" 
              stroke="#8b5cf6"
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip 
              formatter={(value: number, name) => [
                formatCurrency(value),
                name === "revenue" ? "Faturamento" : "Investimento"
              ]}
            />
            <Legend />
            <Bar 
              yAxisId="revenue"
              dataKey="revenue" 
              name="Faturamento" 
              fill="#34A853" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              yAxisId="investment"
              dataKey="investment" 
              name="Investimento" 
              fill="#8b5cf6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueVsInvestmentChart;
