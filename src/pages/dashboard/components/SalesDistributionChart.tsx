import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CHANNELS = [
  { label: 'Comercial', value: 40, color: '#8b5cf6' }, // roxo
  { label: 'Marketing', value: 35, color: '#0ea5e9' }, // azul
  { label: 'Afiliados', value: 25, color: '#f97316' }, // laranja
];

const BAR_COLOR = '#1e293b'; // cor escura da barra

const SalesDistributionChart = () => {
  const navigate = useNavigate();

  const handleViewDetailedReport = () => {
    navigate('/reports');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">Distribuição de Vendas</CardTitle>
        <CardDescription className="text-center">Por canal de origem</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {CHANNELS.map((item) => (
            <div key={item.label} className="mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: item.color }}></span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-sm font-semibold">{item.value}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 mt-1">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${item.value}%`, background: BAR_COLOR }}
                />
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full mt-2 border border-gray-300"
            onClick={handleViewDetailedReport}
          >
            Ver Relatório Detalhado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesDistributionChart;
