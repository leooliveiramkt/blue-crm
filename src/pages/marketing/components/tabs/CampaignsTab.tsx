
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { campaignData } from '../../data/mockData';

const CampaignsTab = () => {
  // Formatar para valores em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Campanhas por Desempenho</CardTitle>
                <CardDescription>Ordenadas por maior ROI</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Ver Todas as Campanhas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead className="text-right">Investimento</TableHead>
                  <TableHead className="text-right">Faturamento</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignData.map((campaign, index) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{campaign.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ 
                            backgroundColor: 
                              campaign.platform === 'Facebook' ? '#4267B2' : 
                              campaign.platform === 'Google' ? '#34A853' : 
                              campaign.platform === 'TikTok' ? '#000000' : 
                              campaign.platform === 'Taboola' ? '#004D9C' : '#F18E1C'
                          }}
                        />
                        <span>{campaign.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(campaign.investment)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(campaign.revenue)}</TableCell>
                    <TableCell className="text-right text-green-600 font-medium">{campaign.roi}x</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ROI por Tipo de Campanha</CardTitle>
            <CardDescription>Análise por segmentação e objetivo</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[
                  { name: 'Remarketing', roi: 5.3 },
                  { name: 'Lookalike 1%', roi: 4.8 },
                  { name: 'Conversão', roi: 3.9 },
                  { name: 'Lookalike 3%', roi: 3.6 },
                  { name: 'Tráfego', roi: 2.7 },
                  { name: 'Alcance', roi: 2.1 },
                ]}
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [`${value}x`, "ROI"]} />
                <Bar dataKey="roi" name="ROI" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investimento por Campanha</CardTitle>
            <CardDescription>Top 5 campanhas com maior investimento</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={campaignData.slice(0, 5)}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, ""]} />
                <Bar dataKey="investment" name="Investimento" fill="#34A853" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignsTab;
