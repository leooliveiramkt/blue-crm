
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartIcon, MailIcon, ChartIcon, GlobeIcon } from './icons/CustomIcons';

interface PlatformData {
  wbuy: any;
  activeCampaign: any;
  googleAnalytics: any;
  stape: any;
}

interface PlatformDataTabsProps {
  trackingData: PlatformData;
}

const formatKey = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/Id$/i, 'ID')
    .replace(/Utm/i, 'UTM')
    .replace(/Url/i, 'URL');
};

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (typeof value === 'object' && value instanceof Date) return value.toLocaleString();
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
    return new Date(value).toLocaleString('pt-BR');
  }
  return String(value);
};

export const PlatformDataTabs: React.FC<PlatformDataTabsProps> = ({ trackingData }) => {
  const platformIcons = {
    wbuy: <CartIcon className="h-4 w-4 text-blue-600" />,
    activeCampaign: <MailIcon className="h-4 w-4 text-green-600" />,
    googleAnalytics: <ChartIcon className="h-4 w-4 text-yellow-600" />,
    stape: <GlobeIcon className="h-4 w-4 text-purple-600" />,
  };
  
  const platformColors = {
    wbuy: 'blue',
    activeCampaign: 'green',
    googleAnalytics: 'yellow',
    stape: 'purple',
  };

  const renderPlatformCard = (title: string, data: any, icon: React.ReactNode, color: string) => {
    return (
      <Card className={`mb-4 overflow-hidden border-${color}-200`}>
        <div className={`h-1 w-full bg-${color}-500`}></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <Badge variant="outline" className={`text-${color}-700 border-${color}-300 bg-${color}-50`}>
            {data && data.status ? data.status : 'Dados encontrados'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data && Object.entries(data)
              .filter(([key]) => key !== 'status')
              .map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 text-sm">
                  <span className="font-medium text-muted-foreground">{formatKey(key)}:</span>
                  <span>{formatValue(value as any)}</span>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Tabs defaultValue="all" className="mt-8">
      <TabsList className="mb-4 grid grid-cols-5 max-w-2xl">
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="wbuy">Wbuy</TabsTrigger>
        <TabsTrigger value="activecampaign">Active Campaign</TabsTrigger>
        <TabsTrigger value="ga">Google Analytics</TabsTrigger>
        <TabsTrigger value="stape">Stape.io</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderPlatformCard('Wbuy', trackingData.wbuy, platformIcons.wbuy, platformColors.wbuy)}
          {renderPlatformCard('Active Campaign', trackingData.activeCampaign, platformIcons.activeCampaign, platformColors.activeCampaign)}
          {renderPlatformCard('Google Analytics', trackingData.googleAnalytics, platformIcons.googleAnalytics, platformColors.googleAnalytics)}
          {renderPlatformCard('Stape.io', trackingData.stape, platformIcons.stape, platformColors.stape)}
        </div>
      </TabsContent>

      <TabsContent value="wbuy">
        {renderPlatformCard('Wbuy', trackingData.wbuy, platformIcons.wbuy, platformColors.wbuy)}
      </TabsContent>

      <TabsContent value="activecampaign">
        {renderPlatformCard('Active Campaign', trackingData.activeCampaign, platformIcons.activeCampaign, platformColors.activeCampaign)}
      </TabsContent>

      <TabsContent value="ga">
        {renderPlatformCard('Google Analytics', trackingData.googleAnalytics, platformIcons.googleAnalytics, platformColors.googleAnalytics)}
      </TabsContent>

      <TabsContent value="stape">
        {renderPlatformCard('Stape.io', trackingData.stape, platformIcons.stape, platformColors.stape)}
      </TabsContent>
    </Tabs>
  );
};
