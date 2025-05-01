
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CommercialHeader } from './commercial/components/CommercialHeader';
import { SalesRanking } from './commercial/components/SalesRanking';
import { RevenueDashboard } from './commercial/components/RevenueDashboard';
import { SalesGoals } from './commercial/components/SalesGoals';
import { ProductAnalytics } from './commercial/components/ProductAnalytics';
import { InventoryControl } from './commercial/components/InventoryControl';

const Commercial = () => {
  return (
    <div className="space-y-6">
      <CommercialHeader />

      <Tabs defaultValue="ranking" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="ranking">Ranking de Vendedores</TabsTrigger>
          <TabsTrigger value="revenue">Faturamento</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="products">Análise de Produtos</TabsTrigger>
          <TabsTrigger value="inventory">Controle de Estoque</TabsTrigger>
          <TabsTrigger value="ai">Análise Preditiva</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="space-y-4">
          <SalesRanking />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueDashboard />
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <SalesGoals />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductAnalytics />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryControl />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise Preditiva de Estoque</CardTitle>
              <CardDescription>Previsões de estoque baseadas em Inteligência Artificial</CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Commercial;
