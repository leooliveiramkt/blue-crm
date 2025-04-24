
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart, Target, Award, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OverviewTab from '../tabs/OverviewTab';
import PlatformsTab from '../tabs/PlatformsTab';
import CampaignsTab from '../tabs/CampaignsTab';
import InfluencersTab from '../tabs/InfluencersTab';
import ProjectionsTab from '../tabs/ProjectionsTab';
import { PeriodView } from '../../hooks/useMarketingData';

interface MarketingTabsProps {
  periodView: PeriodView;
  setPeriodView: (view: PeriodView) => void;
  timeData: any[];
}

const MarketingTabs = ({ periodView, setPeriodView, timeData }: MarketingTabsProps) => {
  return (
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
                { value: "monthly" as PeriodView, label: "Mensal" },
                { value: "bimonthly" as PeriodView, label: "Bimestral" },
                { value: "quarterly" as PeriodView, label: "Trimestral" },
                { value: "biannual" as PeriodView, label: "Semestral" },
                { value: "annual" as PeriodView, label: "Anual" }
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
  );
};

export default MarketingTabs;
