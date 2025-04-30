
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturedCampaignsCard = () => {
  const campaigns = [
    { name: 'Black Friday', source: 'Facebook Ads', roi: '+124%' },
    { name: 'Lançamento Premium', source: 'Google Ads', roi: '+87%' },
    { name: 'Desconto Sazonal', source: 'Email Marketing', roi: '+65%' },
    { name: 'Programa Fidelidade', source: 'Orgânico', roi: '+52%' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campanhas em Destaque</CardTitle>
        <CardDescription>Melhor desempenho recente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{campaign.name}</p>
                <p className="text-xs text-muted-foreground">Origem: {campaign.source}</p>
              </div>
              <span className="text-sm font-medium text-green-600">{campaign.roi}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedCampaignsCard;
