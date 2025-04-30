
import React from 'react';
import { Button } from "@/components/ui/button";

const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do desempenho da sua empresa.</p>
      </div>
      <div className="mt-4 md:mt-0 flex items-center gap-2">
        <Button variant="outline">Exportar Dados</Button>
        <Button>Gerar Relatório</Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
