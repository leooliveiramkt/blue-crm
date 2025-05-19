
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const SalesDistributionChart = () => {
  const navigate = useNavigate();

  const handleViewDetailedReport = () => {
    // Navegar para a página de relatórios
    navigate('/reports');
  };

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Distribuição de Vendas</CardTitle>
        <CardDescription>Por canal de origem</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-brand-600"></div>
                <span className="text-sm font-medium">Comercial</span>
              </div>
              <span className="text-sm font-medium">40%</span>
            </div>
            <Progress value={40} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-sky-500"></div>
                <span className="text-sm font-medium">Marketing</span>
              </div>
              <span className="text-sm font-medium">35%</span>
            </div>
            <Progress value={35} className="h-2 bg-muted" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span className="text-sm font-medium">Afiliados</span>
              </div>
              <span className="text-sm font-medium">25%</span>
            </div>
            <Progress value={25} className="h-2 bg-muted" />
          </div>
          
          <div className="pt-4 flex justify-center">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleViewDetailedReport}
            >
              Ver Relatório Detalhado
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesDistributionChart;
