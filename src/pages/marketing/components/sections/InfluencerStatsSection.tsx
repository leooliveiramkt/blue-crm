
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InfluencerBarChart from '../charts/InfluencerBarChart';
import PlatformDistributionPieChart from '../charts/PlatformDistributionPieChart';

interface InfluencerStatsSectionProps {
  influencerData: Array<{
    id: number;
    name: string;
    platform: string;
    revenue: number;
    followers: number;
    engagement: number;
  }>;
  platformDistributionData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const InfluencerStatsSection = ({ influencerData, platformDistributionData }: InfluencerStatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Faturamento por Influenciador</CardTitle>
          <CardDescription>Top 10 influenciadores por volume de vendas</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <InfluencerBarChart data={influencerData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Plataforma</CardTitle>
          <CardDescription>Influenciadores por canal principal</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <PlatformDistributionPieChart data={platformDistributionData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerStatsSection;
