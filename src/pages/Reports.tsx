
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Download, BarChart3, PieChart, TrendingUp, LineChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Line, LineChart as RechartsLineChart, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const salesData = [
  { name: 'Jan', comercial: 4000, marketing: 2400, afiliados: 1800 },
  { name: 'Fev', comercial: 3000, marketing: 2900, afiliados: 2200 },
  { name: 'Mar', comercial: 2000, marketing: 3200, afiliados: 2800 },
  { name: 'Abr', comercial: 2780, marketing: 3300, afiliados: 2500 },
  { name: 'Mai', comercial: 1890, marketing: 3700, afiliados: 2300 },
  { name: 'Jun', comercial: 2390, marketing: 3500, afiliados: 2400 },
  { name: 'Jul', comercial: 3490, marketing: 4100, afiliados: 2700 },
];

const pieData = [
  { name: 'Comercial', value: 35 },
  { name: 'Marketing', value: 40 },
  { name: 'Afiliados', value: 25 },
];

const COLORS = ['#8b5cf6', '#0ea5e9', '#f97316'];

const conversionData = [
  { name: 'Jan', comercial: 3.2, marketing: 2.8, afiliados: 4.1 },
  { name: 'Fev', comercial: 3.5, marketing: 2.9, afiliados: 4.3 },
  { name: 'Mar', comercial: 3.1, marketing: 3.2, afiliados: 4.0 },
  { name: 'Abr', comercial: 3.8, marketing: 3.1, afiliados: 4.2 },
  { name: 'Mai', comercial: 3.4, marketing: 3.5, afiliados: 4.3 },
  { name: 'Jun', comercial: 3.2, marketing: 3.6, afiliados: 4.1 },
  { name: 'Jul', comercial: 3.7, marketing: 3.8, afiliados: 4.5 },
];

const revenueData = [
  { name: 'Jan', comercial: 200000, marketing: 150000, afiliados: 120000 },
  { name: 'Fev', comercial: 180000, marketing: 160000, afiliados: 125000 },
  { name: 'Mar', comercial: 170000, marketing: 175000, afiliados: 135000 },
  { name: 'Abr', comercial: 190000, marketing: 180000, afiliados: 140000 },
  { name: 'Mai', comercial: 175000, marketing: 190000, afiliados: 145000 },
  { name: 'Jun', comercial: 185000, marketing: 195000, afiliados: 150000 },
  { name: 'Jul', comercial: 210000, marketing: 205000, afiliados: 160000 },
];

const Reports = () => {
  const [date, setDate] = useState({
    from: new Date(2025, 0, 1),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">Analise o desempenho do seu negócio através de relatórios detalhados.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "P", { locale: ptBR })} -{" "}
                      {format(date.to, "P", { locale: ptBR })}
                    </>
                  ) : (
                    format(date.from, "P", { locale: ptBR })
                  )
                ) : (
                  <span>Selecione um período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                selected={date}
                onSelect={setDate}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendas" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Vendas</span>
          </TabsTrigger>
          <TabsTrigger value="distribuicao" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" />
            <span>Distribuição</span>
          </TabsTrigger>
          <TabsTrigger value="conversao" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Conversão</span>
          </TabsTrigger>
          <TabsTrigger value="faturamento" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span>Faturamento</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Volume de Vendas por Canal</CardTitle>
              <CardDescription>Comparativo de vendas entre os diferentes canais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} vendas`, ""]} />
                    <Legend />
                    <Bar dataKey="comercial" name="Comercial" fill="#8b5cf6" />
                    <Bar dataKey="marketing" name="Marketing" fill="#0ea5e9" />
                    <Bar dataKey="afiliados" name="Afiliados" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard 
              title="Total de Vendas" 
              value="19.432" 
              description="Acumulado no período"
              trend="+12.5%"
              trendUp={true}
            />
            <KpiCard 
              title="Ticket Médio" 
              value="R$ 487,23" 
              description="Por venda realizada"
              trend="+4.7%"
              trendUp={true}
            />
            <KpiCard 
              title="CAC" 
              value="R$ 103,50" 
              description="Custo de aquisição"
              trend="-2.3%"
              trendUp={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="distribuicao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Vendas por Canal</CardTitle>
              <CardDescription>Proporção de cada canal no total de vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DistributionDetailsCard 
              title="Marketing" 
              value="40%" 
              color="bg-sky-500"
              trend="+5.3%"
              trendUp={true}
              mainChannels={["Facebook Ads: 45%", "Instagram: 30%", "Google Ads: 25%"]}
            />
            <DistributionDetailsCard 
              title="Comercial" 
              value="35%" 
              color="bg-brand-600"
              trend="-3.1%"
              trendUp={false}
              mainChannels={["Venda Direta: 60%", "Representantes: 25%", "Parcerias: 15%"]}
            />
            <DistributionDetailsCard 
              title="Afiliados" 
              value="25%" 
              color="bg-orange-500"
              trend="+1.2%"
              trendUp={true}
              mainChannels={["Tier 1: 50%", "Tier 2: 35%", "Tier 3: 15%"]}
            />
          </div>
        </TabsContent>

        <TabsContent value="conversao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Conversão por Canal</CardTitle>
              <CardDescription>Porcentagem de visitantes que realizam uma compra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={conversionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="comercial" name="Comercial" stroke="#8b5cf6" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="marketing" name="Marketing" stroke="#0ea5e9" />
                    <Line type="monotone" dataKey="afiliados" name="Afiliados" stroke="#f97316" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard 
              title="Conversão Média" 
              value="3.75%" 
              description="Todos os canais"
              trend="+0.3%"
              trendUp={true}
            />
            <KpiCard 
              title="Melhor Canal" 
              value="Afiliados" 
              description="Taxa média de 4.2%"
              trend="+0.4%"
              trendUp={true}
            />
            <KpiCard 
              title="Melhor Campanha" 
              value="Black Friday" 
              description="Taxa de 6.8%"
              trend="+2.1%"
              trendUp={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="faturamento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Faturamento por Canal</CardTitle>
              <CardDescription>Valores de faturamento divididos por origem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${(value/1000).toFixed(0)}k`, ""]} />
                    <Legend />
                    <Area type="monotone" dataKey="comercial" name="Comercial" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                    <Area type="monotone" dataKey="marketing" name="Marketing" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" />
                    <Area type="monotone" dataKey="afiliados" name="Afiliados" stackId="1" stroke="#f97316" fill="#f97316" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard 
              title="Faturamento Total" 
              value="R$ 9.456.780" 
              description="Acumulado no período"
              trend="+15.3%"
              trendUp={true}
            />
            <KpiCard 
              title="ROI Marketing" 
              value="387%" 
              description="Retorno sobre investimento"
              trend="+42%"
              trendUp={true}
            />
            <KpiCard 
              title="Comissão Afiliados" 
              value="R$ 985.420" 
              description="Total pago no período"
              trend="+23.7%"
              trendUp={true}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
  trend: string;
  trendUp: boolean;
}

const KpiCard = ({ title, value, description, trend, trendUp }: KpiCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{description}</p>
            <span className={cn(
              "text-xs font-medium",
              trendUp ? "text-green-600" : "text-red-600"
            )}>
              {trend}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DistributionDetailsCardProps {
  title: string;
  value: string;
  color: string;
  trend: string;
  trendUp: boolean;
  mainChannels: string[];
}

const DistributionDetailsCard = ({ title, value, color, trend, trendUp, mainChannels }: DistributionDetailsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${color}`}></div>
              <p className="text-sm font-medium">{title}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold">{value}</span>
              <span className={cn(
                "text-xs font-medium",
                trendUp ? "text-green-600" : "text-red-600"
              )}>
                {trend}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Principais fontes:</p>
            <ul className="space-y-1">
              {mainChannels.map((channel, index) => (
                <li key={index} className="text-xs">{channel}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reports;
