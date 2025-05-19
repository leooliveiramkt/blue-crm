
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommercialHeader } from './commercial/components/CommercialHeader';
import { SalesRanking } from './commercial/components/SalesRanking';
import { RevenueDashboard } from './commercial/components/RevenueDashboard';
import { SalesGoals } from './commercial/components/SalesGoals';

const Commercial = () => {
  return (
    <div className="space-y-6">
      <CommercialHeader />

      <Tabs defaultValue="ranking" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="ranking">Ranking de Vendedores</TabsTrigger>
          <TabsTrigger value="revenue">Faturamento</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Commercial;
