
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductAnalytics } from './commercial/components/ProductAnalytics';
import { InventoryControl } from './commercial/components/InventoryControl';
import { ShippingHeader } from './shipping/components/ShippingHeader';

const Shipping = () => {
  return (
    <div className="space-y-6">
      <ShippingHeader />

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="products">Análise de Produtos</TabsTrigger>
          <TabsTrigger value="inventory">Controle de Estoque</TabsTrigger>
          <TabsTrigger value="ai">Análise Preditiva</TabsTrigger>
        </TabsList>

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

export default Shipping;
