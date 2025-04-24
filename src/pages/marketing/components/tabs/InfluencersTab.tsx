
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { influencerData } from '../../data/mockData';
import InfluencerBarChart from '../charts/InfluencerBarChart';
import PlatformDistributionPieChart from '../charts/PlatformDistributionPieChart';
import TopInfluencersTable from '../tables/TopInfluencersTable';

const platformDistributionData = [
  { name: 'Instagram', value: 40, color: '#E1306C' },
  { name: 'TikTok', value: 30, color: '#000000' },
  { name: 'YouTube', value: 20, color: '#FF0000' },
  { name: 'Twitter', value: 10, color: '#1DA1F2' },
];

const InfluencersTab = () => {
  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Ranking de Influenciadores</CardTitle>
              <CardDescription>Performance detalhada dos top 10</CardDescription>
            </div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Filtrar por</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="justify-start">
                          Faturamento
                        </Button>
                        <Button variant="outline" className="justify-start">
                          Engajamento
                        </Button>
                        <Button variant="outline" className="justify-start">
                          ROI
                        </Button>
                        <Button variant="outline" className="justify-start">
                          Seguidores
                        </Button>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </CardHeader>
        <CardContent>
          <TopInfluencersTable data={influencerData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencersTab;
