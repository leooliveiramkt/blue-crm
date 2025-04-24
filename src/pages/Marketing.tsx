import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Download, BarChart3, PieChart, TrendingUp, LineChart, DollarSign, Target, Award } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "@/hooks/use-toast";
import { type DateRange } from 'react-day-picker';

import MetricCard from './marketing/components/MetricCard';
import OverviewTab from './marketing/components/tabs/OverviewTab';
import PlatformsTab from './marketing/components/tabs/PlatformsTab';
import CampaignsTab from './marketing/components/tabs/CampaignsTab';
import InfluencersTab from './marketing/components/tabs/InfluencersTab';
import ProjectionsTab from './marketing/components/tabs/ProjectionsTab';
import { useMarketingData } from './marketing/hooks/useMarketingData';

const Marketing = () => {
  const {
    dateRange,
    setDateRange,
    periodView,
    setPeriodView,
    getTimeData,
    calculateTotalROI,
    calculateGrowth,
  } = useMarketingData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão enviados por email quando estiverem prontos.",
    });
  };

  const timeData = getTimeData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing</h2>
          <p className="text-muted-foreground">Análise de performance das campanhas de marketing e tráfego pago.</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "P", { locale: ptBR })} -{" "}
                      {format(dateRange.to, "P", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "P", { locale: ptBR })
                  )
                ) : (
                  <span>Selecione um período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                locale={ptBR}
                className="pointer-events-auto"
              />
              <div className="p-3 border-t border-border/60 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDateRange({
                    from: new Date(new Date().getFullYear(), 0, 1),
                    to: new Date()
                  })}
                >
                  Este ano
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    setDateRange({
                      from: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
                      to: today
                    });
                  }}
                >
                  Últimos 30 dias
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Dados
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Faturamento Total" 
          value={formatCurrency(timeData.reduce((sum, item) => sum + item.revenue, 0))} 
          description="Via Marketing"
          trend={`+${calculateGrowth()}%`} 
          trendUp={true}
          icon={DollarSign}
        />
        <MetricCard 
          title="Investimento" 
          value={formatCurrency(timeData.reduce((sum, item) => sum + item.investment, 0))} 
          description="Em tráfego pago" 
          trend="+28.3%" 
          trendUp={true}
          icon={BarChart3}
        />
        <MetricCard 
          title="ROI Geral" 
          value={calculateTotalROI()}
          description="Retorno sobre investimento" 
          trend="+18.6%" 
          trendUp={true}
          icon={TrendingUp}
        />
        <MetricCard 
          title="Campanhas Ativas" 
          value="32" 
          description="Nas principais plataformas" 
          trend="+4" 
          trendUp={true}
          icon={Target}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 h-auto gap-4">
          <TabsTrigger value="overview" className="flex items-center gap-2 h-10">
            <BarChart3 className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="platforms" className="flex items-center gap-2 h-10">
            <PieChart className="h-4 w-4" />
            <span>Plataformas</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2 h-10">
            <Target className="h-4 w-4" />
            <span>Campanhas</span>
          </TabsTrigger>
          <TabsTrigger value="influencers" className="flex items-center gap-2 h-10">
            <Award className="h-4 w-4" />
            <span>Influenciadores</span>
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center gap-2 h-10">
            <LineChart className="h-4 w-4" />
            <span>Projeções</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-2">
          {periodView === "projections" && (
            <div className="flex flex-col sm:flex-row items-center justify-end mb-4 gap-3">
              <p className="text-sm text-muted-foreground mr-2">Visualização:</p>
              <div className="inline-flex gap-1 items-center">
                {[
                  { value: "monthly", label: "Mensal" },
                  { value: "bimonthly", label: "Bimestral" },
                  { value: "quarterly", label: "Trimestral" },
                  { value: "biannual", label: "Semestral" },
                  { value: "annual", label: "Anual" }
                ].map((item) => (
                  <Button
                    key={item.value}
                    variant={periodView === item.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPeriodView(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="platforms">
          <PlatformsTab />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignsTab />
        </TabsContent>

        <TabsContent value="influencers">
          <InfluencersTab />
        </TabsContent>

        <TabsContent value="projections">
          <ProjectionsTab periodView={periodView} timeData={timeData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
