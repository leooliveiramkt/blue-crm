
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CampaignsTable from '../tables/CampaignsTable';
import TopInfluencersTable from '../tables/TopInfluencersTable';

interface PerformanceTablesSectionProps {
  campaignData: Array<{
    id: number;
    name: string;
    platform: string;
    revenue: number;
    investment: number;
    roi: number;
  }>;
  influencerData: Array<{
    id: number;
    name: string;
    platform: string;
    revenue: number;
    followers: number;
    engagement: number;
  }>;
}

const PerformanceTablesSection = ({ campaignData, influencerData }: PerformanceTablesSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Campanhas mais Efetivas</CardTitle>
          <CardDescription>Top 5 campanhas com melhor ROI</CardDescription>
        </CardHeader>
        <CardContent>
          <CampaignsTable data={campaignData} limit={5} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Top Influenciadores</CardTitle>
          <CardDescription>Por volume de vendas</CardDescription>
        </CardHeader>
        <CardContent>
          <TopInfluencersTable data={influencerData.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTablesSection;
