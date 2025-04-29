
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import AffiliateOverview from './affiliates/AffiliateOverview';
import AffiliateForm from './affiliates/AffiliateForm';
import AffiliatesTable from './affiliates/AffiliatesTable';
import WeeklyRankingTab from './affiliates/WeeklyRankingTab';
import MonthlyRankingTab from './affiliates/MonthlyRankingTab';
import OverallRankingTab from './affiliates/OverallRankingTab';
import { useAffiliatesData } from './affiliates/hooks/useAffiliatesData';

const Affiliates = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<string | null>(null);
  const { toast } = useToast();
  const { 
    isLoading, 
    affiliates, 
    weeklyPhysicalRanking,
    weeklyDigitalRanking,
    monthlyRanking,
    overallRanking,
    refreshData 
  } = useAffiliatesData();

  const handleAffiliateSelect = (id: string) => {
    setSelectedAffiliateId(id);
    setActiveTab("edit");
  };

  const handleAffiliateSaved = () => {
    toast({
      title: "Sucesso",
      description: "Dados do afiliado salvos com sucesso",
    });
    refreshData();
    setActiveTab("overview");
    setSelectedAffiliateId(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Carregando dados de afiliados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Afiliados</h2>
        <p className="text-muted-foreground">Gerencie seus afiliados e acompanhe o desempenho deles.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6 sm:grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="weekly-phys">Ranking Físico</TabsTrigger>
          <TabsTrigger value="weekly-dig">Ranking Digital</TabsTrigger>
          <TabsTrigger value="monthly">Ranking Mensal</TabsTrigger>
          <TabsTrigger value="overall">Ranking Geral</TabsTrigger>
          <TabsTrigger value="new-affiliate">Novo Afiliado</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AffiliateOverview 
            affiliates={affiliates}
            weeklyPhysicalRanking={weeklyPhysicalRanking}
            weeklyDigitalRanking={weeklyDigitalRanking}
            onSelectAffiliate={handleAffiliateSelect}
          />
        </TabsContent>

        <TabsContent value="weekly-phys">
          <WeeklyRankingTab 
            title="Ranking Semanal - Produtos Físicos" 
            rankingData={weeklyPhysicalRanking}
            type="physical"
          />
        </TabsContent>

        <TabsContent value="weekly-dig">
          <WeeklyRankingTab 
            title="Ranking Semanal - Produtos Digitais" 
            rankingData={weeklyDigitalRanking}
            type="digital"
          />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyRankingTab rankingData={monthlyRanking} />
        </TabsContent>

        <TabsContent value="overall">
          <OverallRankingTab rankingData={overallRanking} />
        </TabsContent>

        <TabsContent value="new-affiliate">
          <Card>
            <CardHeader>
              <CardTitle>Novo Afiliado</CardTitle>
              <CardDescription>
                Adicione um novo afiliado ao seu sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AffiliateForm onSave={handleAffiliateSaved} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Editar Afiliado</CardTitle>
              <CardDescription>
                Modifique os dados do afiliado selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AffiliateForm 
                affiliateId={selectedAffiliateId as string} 
                onSave={handleAffiliateSaved} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Affiliates;
