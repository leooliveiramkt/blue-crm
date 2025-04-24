
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { influencerData } from '../../data/mockData';

const InfluencersTab = () => {
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Faturamento por Influenciador</CardTitle>
            <CardDescription>Top 10 influenciadores por volume de vendas</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={influencerData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, ""]} />
                <Bar dataKey="revenue" name="Faturamento" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Plataforma</CardTitle>
            <CardDescription>Influenciadores por canal principal</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={[
                    { name: 'Instagram', value: 40, color: '#E1306C' },
                    { name: 'TikTok', value: 30, color: '#000000' },
                    { name: 'YouTube', value: 20, color: '#FF0000' },
                    { name: 'Twitter', value: 10, color: '#1DA1F2' },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Instagram', value: 40, color: '#E1306C' },
                    { name: 'TikTok', value: 30, color: '#000000' },
                    { name: 'YouTube', value: 20, color: '#FF0000' },
                    { name: 'Twitter', value: 10, color: '#1DA1F2' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, ""]} />
              </RechartsPieChart>
            </ResponsiveContainer>
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
                        <NavigationMenuLink asChild>
                          <Button variant="outline" className="justify-start">Faturamento</Button>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Button variant="outline" className="justify-start">Engajamento</Button>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Button variant="outline" className="justify-start">ROI</Button>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Button variant="outline" className="justify-start">Seguidores</Button>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Ranking</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead className="text-right">Seguidores</TableHead>
                <TableHead className="text-right">Engajamento</TableHead>
                <TableHead className="text-right">Faturamento</TableHead>
                <TableHead className="text-right">Conversão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {influencerData.map((influencer, index) => (
                <TableRow key={influencer.id}>
                  <TableCell>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-medium">
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{influencer.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ 
                          backgroundColor: 
                            influencer.platform === 'Instagram' ? '#E1306C' : 
                            influencer.platform === 'TikTok' ? '#000000' : 
                            influencer.platform === 'YouTube' ? '#FF0000' : '#1DA1F2'
                        }}
                      />
                      <span>{influencer.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{(influencer.followers / 1000000).toFixed(1)}M</TableCell>
                  <TableCell className="text-right">{influencer.engagement}%</TableCell>
                  <TableCell className="text-right">{formatCurrency(influencer.revenue)}</TableCell>
                  <TableCell className="text-right">{(Math.random() * 2 + 2).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencersTab;
