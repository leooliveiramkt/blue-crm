
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, Package } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useRevenueData } from '../hooks/useRevenueData';

export const RevenueDashboard: React.FC = () => {
  const { monthlyRevenue, yearlyComparison, totalRevenue, growth } = useRevenueData();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Cards de Resumo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString('pt-BR')}</div>
          <p className="text-xs text-muted-foreground">
            No ano atual
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
          {growth >= 0 ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{growth}%</div>
          <p className="text-xs text-muted-foreground">
            Em comparação ao ano anterior
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">943</div>
          <p className="text-xs text-muted-foreground">
            No mês atual
          </p>
        </CardContent>
      </Card>
      
      {/* Gráfico de Receita Mensal */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Faturamento Mensal</CardTitle>
          <CardDescription>Receita mensal no ano atual</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={{
            revenue: { theme: { light: '#9b87f5', dark: '#7E69AB' } },
            target: { theme: { light: '#D6BCFA', dark: '#6E59A5' } },
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => 
                    value >= 1000 ? `${value / 1000}k` : value
                  }
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent>
                          <div>
                            <p className="font-medium">{payload[0].payload.name}</p>
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">
                                R$ {Number(payload[0].value).toLocaleString('pt-BR')}
                              </span>
                            </p>
                          </div>
                        </ChartTooltipContent>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" fill="var(--color-revenue)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
