import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, DollarSign, Users, ShoppingCart, BarChart3 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', vendas: 40, marketing: 24, afiliados: 20 },
  { name: 'Fev', vendas: 30, marketing: 28, afiliados: 27 },
  { name: 'Mar', vendas: 20, marketing: 40, afiliados: 30 },
  { name: 'Abr', vendas: 27, marketing: 39, afiliados: 32 },
  { name: 'Mai', vendas: 18, marketing: 48, afiliados: 35 },
  { name: 'Jun', vendas: 23, marketing: 38, afiliados: 30 },
  { name: 'Jul', vendas: 34, marketing: 43, afiliados: 38 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral do desempenho da sua empresa.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button variant="outline">Exportar Dados</Button>
          <Button>Gerar Relatório</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Vendas Totais" 
          value="R$ 45.231,89" 
          change="+12.5%" 
          trend="up" 
          icon={DollarSign} 
        />
        <StatCard 
          title="Novos Afiliados" 
          value="126" 
          change="+4.3%" 
          trend="up" 
          icon={Users} 
        />
        <StatCard 
          title="Pedidos" 
          value="864" 
          change="-2.1%" 
          trend="down" 
          icon={ShoppingCart} 
        />
        <StatCard 
          title="Taxa de Conversão" 
          value="3.78%" 
          change="+1.2%" 
          trend="up" 
          icon={BarChart3} 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Desempenho de Vendas</CardTitle>
            <CardDescription>Comparativo de origens de vendas nos últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="vendas" stackId="1" stroke="#6d28d9" fill="#8b5cf6" name="Comercial" />
                  <Area type="monotone" dataKey="marketing" stackId="1" stroke="#0ea5e9" fill="#38bdf8" name="Marketing" />
                  <Area type="monotone" dataKey="afiliados" stackId="1" stroke="#f97316" fill="#fb923c" name="Afiliados" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Distribuição de Vendas</CardTitle>
            <CardDescription>Por canal de origem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-brand-600"></div>
                    <span className="text-sm font-medium">Comercial</span>
                  </div>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-sky-500"></div>
                    <span className="text-sm font-medium">Marketing</span>
                  </div>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <Progress value={35} className="h-2 bg-muted" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm font-medium">Afiliados</span>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <Progress value={25} className="h-2 bg-muted" />
              </div>
              
              <div className="pt-4 flex justify-center">
                <Button variant="outline" className="w-full">Ver Relatório Detalhado</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Afiliados</CardTitle>
            <CardDescription>Por volume de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Carlos Silva', sales: 'R$ 12.580,00', conversion: '4.2%' },
                { name: 'Ana Ferreira', sales: 'R$ 9.845,00', conversion: '3.8%' },
                { name: 'Marcos Oliveira', sales: 'R$ 7.623,00', conversion: '3.5%' },
                { name: 'Juliana Costa', sales: 'R$ 6.421,00', conversion: '3.1%' },
              ].map((affiliate, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">{affiliate.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{affiliate.name}</p>
                      <p className="text-xs text-muted-foreground">Conversão: {affiliate.conversion}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{affiliate.sales}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campanhas em Destaque</CardTitle>
            <CardDescription>Melhor desempenho recente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Black Friday', source: 'Facebook Ads', roi: '+124%' },
                { name: 'Lançamento Premium', source: 'Google Ads', roi: '+87%' },
                { name: 'Desconto Sazonal', source: 'Email Marketing', roi: '+65%' },
                { name: 'Programa Fidelidade', source: 'Orgânico', roi: '+52%' },
              ].map((campaign, index) => (
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

        <Card>
          <CardHeader>
            <CardTitle>Integrações Ativas</CardTitle>
            <CardDescription>Status das conexões API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Wbuy', status: 'Ativo', statusClass: 'text-green-600' },
                { name: 'Facebook', status: 'Ativo', statusClass: 'text-green-600' },
                { name: 'Active Campaign', status: 'Ativo', statusClass: 'text-green-600' },
                { name: 'Google Analytics', status: 'Pendente', statusClass: 'text-amber-600' },
                { name: 'Stape.io', status: 'Desconectado', statusClass: 'text-red-600' },
                { name: 'Tiny', status: 'Pendente', statusClass: 'text-amber-600' },
              ].map((integration, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-sm font-medium">{integration.name}</p>
                  <span className={`text-sm font-medium ${integration.statusClass}`}>{integration.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
}

const StatCard = ({ title, value, change, trend, icon: Icon }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex items-center mt-3">
          {trend === 'up' ? (
            <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
          )}
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="text-xs text-muted-foreground ml-1">vs último mês</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
