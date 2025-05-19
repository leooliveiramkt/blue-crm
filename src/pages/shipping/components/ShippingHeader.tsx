
import React from 'react';
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, FileText, Download, ShoppingCart } from "lucide-react";

export const ShippingHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expedição</h1>
        <p className="text-muted-foreground">
          Controle de estoque de suplementos, produtos naturais e conteúdos digitais
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="h-9">
          <Package className="mr-2 h-4 w-4" />
          Inventário
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <FileText className="mr-2 h-4 w-4" />
          Relatórios
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <Download className="mr-2 h-4 w-4" />
          Exportar Dados
        </Button>
        <Button className="h-9">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>
    </div>
  );
};
