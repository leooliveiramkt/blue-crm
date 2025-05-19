
import React from 'react';
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, Users } from "lucide-react";

export const CommercialHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Setor Comercial</h1>
        <p className="text-muted-foreground">
          Gerencie vendas, metas, produtos e estoque em um só lugar
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="h-9">
          <Package className="mr-2 h-4 w-4" />
          Relatórios
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <TrendingUp className="mr-2 h-4 w-4" />
          Exportar Dados
        </Button>
        <Button className="h-9">
          <Users className="mr-2 h-4 w-4" />
          Cadastrar Vendedor
        </Button>
      </div>
    </div>
  );
};
