
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dados mockados para o gráfico
const data = [
  { name: 'Jan', vendas: 40, marketing: 24, afiliados: 20 },
  { name: 'Fev', vendas: 30, marketing: 28, afiliados: 27 },
  { name: 'Mar', vendas: 20, marketing: 40, afiliados: 30 },
  { name: 'Abr', vendas: 27, marketing: 39, afiliados: 32 },
  { name: 'Mai', vendas: 18, marketing: 48, afiliados: 35 },
  { name: 'Jun', vendas: 23, marketing: 38, afiliados: 30 },
  { name: 'Jul', vendas: 34, marketing: 43, afiliados: 38 },
];

const SalesPerformanceChart = () => {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Desempenho de Vendas</CardTitle>
        <CardDescription>Comparativo de origens de vendas nos últimos 7 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="vendas" stackId="1" stroke="#6d28d9" fill="#8b5cf6" name="Comercial" />
              <Area type="monotone" dataKey="marketing" stackId="1" stroke="#0ea5e9" fill="#38bdf8" name="Marketing" />
              <Area type="monotone" dataKey="afiliados" stackId="1" stroke="#f97316" fill="#fb923c" name="Afiliados" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesPerformanceChart;
