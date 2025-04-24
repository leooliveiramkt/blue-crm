
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import TopInfluencersTable from '../tables/TopInfluencersTable';

interface InfluencerRankingSectionProps {
  influencerData: Array<{
    id: number;
    name: string;
    platform: string;
    revenue: number;
    followers: number;
    engagement: number;
  }>;
}

const InfluencerRankingSection = ({ influencerData }: InfluencerRankingSectionProps) => {
  return (
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
  );
};

export default InfluencerRankingSection;
