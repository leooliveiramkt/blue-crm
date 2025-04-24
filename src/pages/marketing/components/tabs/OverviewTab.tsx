
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import RevenueVsInvestmentChart from '../charts/RevenueVsInvestmentChart';
import InvestmentDistributionChart from '../charts/InvestmentDistributionChart';
import TopInfluencersTable from '../tables/TopInfluencersTable';
import CampaignsTable from '../tables/CampaignsTable';
import { campaignData, influencerData } from '../../data/mockData';

const OverviewTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueVsInvestmentChart data={revenueData} />
        <InvestmentDistributionChart data={investmentData} />
      </div>

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
    </div>
  );
};

export default OverviewTab;
