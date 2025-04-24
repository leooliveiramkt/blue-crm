
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Calendar as CalendarIcon, 
  Download, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  LineChart, 
  DollarSign, 
  Target, 
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Line, 
  LineChart as RechartsLineChart, 
  Area, 
  AreaChart 
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

// Dados de exemplo para as plataformas de anúncios
const adPlatformData = [
  { name: 'Jan', facebook: 12500, google: 9800, tiktok: 7200, taboola: 4200, outbrain: 3100 },
  { name: 'Fev', facebook: 11800, google: 10500, tiktok: 8100, taboola: 3800, outbrain: 2900 },
  { name: 'Mar', facebook: 14200, google: 11200, tiktok: 9300, taboola: 4500, outbrain: 3400 },
  { name: 'Abr', facebook: 13500, google: 12100, tiktok: 10200, taboola: 5100, outbrain: 3700 },
  { name: 'Mai', facebook: 15800, google: 13400, tiktok: 11500, taboola: 5400, outbrain: 4200 },
  { name: 'Jun', facebook: 18200, google: 14900, tiktok: 13200, taboola: 6300, outbrain: 4800 },
];

// Dados de ROI por plataforma
const roiData = [
  { name: 'Jan', facebook: 2.4, google: 3.1, tiktok: 1.8, taboola: 1.5, outbrain: 1.3 },
  { name: 'Fev', facebook: 2.6, google: 3.3, tiktok: 2.0, taboola: 1.4, outbrain: 1.2 },
  { name: 'Mar', facebook: 2.8, google: 3.5, tiktok: 2.2, taboola: 1.6, outbrain: 1.4 },
  { name: 'Abr', facebook: 3.0, google: 3.7, tiktok: 2.4, taboola: 1.8, outbrain: 1.7 },
  { name: 'Mai', facebook: 3.2, google: 3.9, tiktok: 2.7, taboola: 2.0, outbrain: 1.9 },
  { name: 'Jun', facebook: 3.5, google: 4.2, tiktok: 2.9, taboola: 2.3, outbrain: 2.1 },
];

// Dados de distribuição de investimento
const investmentData = [
  { name: 'Facebook', value: 35, color: '#4267B2' },
  { name: 'Google', value: 30, color: '#34A853' },
  { name: 'TikTok', value: 20, color: '#000000' },
  { name: 'Taboola', value: 10, color: '#004D9C' },
  { name: 'Outbrain', value: 5, color: '#F18E1C' },
];

// Dados de campanhas mais efetivas
const campaignData = [
  { id: 1, name: 'Black Friday', platform: 'Facebook', revenue: 85600, investment: 15000, roi: 5.7 },
  { id: 2, name: 'Lançamento Premium', platform: 'Google', revenue: 76400, investment: 14200, roi: 5.4 },
  { id: 3, name: 'Promoção Verão', platform: 'Facebook', revenue: 62300, investment: 12500, roi: 5.0 },
  { id: 4, name: 'Liquidação Inverno', platform: 'TikTok', revenue: 58700, investment: 12000, roi: 4.9 },
  { id: 5, name: 'Campanha Dia das Mães', platform: 'Google', revenue: 51200, investment: 10800, roi: 4.7 },
  { id: 6, name: 'Retargeting Premium', platform: 'Facebook', revenue: 47500, investment: 10200, roi: 4.6 },
  { id: 7, name: 'Campanha Natal', platform: 'TikTok', revenue: 45300, investment: 9800, roi: 4.6 },
  { id: 8, name: 'Remarketing Geral', platform: 'Taboola', revenue: 42100, investment: 9500, roi: 4.4 },
  { id: 9, name: 'Segmento Jovem', platform: 'TikTok', revenue: 39800, investment: 9200, roi: 4.3 },
  { id: 10, name: 'Look-alike 3%', platform: 'Facebook', revenue: 36500, investment: 8500, roi: 4.3 },
];

// Dados dos influenciadores top 10
const influencerData = [
  { id: 1, name: 'Ana Clara', platform: 'Instagram', revenue: 145000, followers: 2500000, engagement: 4.8 },
  { id: 2, name: 'Paulo Vieira', platform: 'TikTok', revenue: 128000, followers: 1800000, engagement: 5.2 },
  { id: 3, name: 'Mariana Costa', platform: 'YouTube', revenue: 112000, followers: 1200000, engagement: 4.5 },
  { id: 4, name: 'Rodrigo Lima', platform: 'Instagram', revenue: 98000, followers: 950000, engagement: 4.9 },
  { id: 5, name: 'Carla Mendes', platform: 'TikTok', revenue: 87000, followers: 820000, engagement: 6.1 },
  { id: 6, name: 'Fernando Santos', platform: 'YouTube', revenue: 76000, followers: 780000, engagement: 3.8 },
  { id: 7, name: 'Júlia Pereira', platform: 'Instagram', revenue: 65000, followers: 720000, engagement: 5.3 },
  { id: 8, name: 'Marcos Oliveira', platform: 'TikTok', revenue: 54000, followers: 650000, engagement: 4.7 },
  { id: 9, name: 'Luiza Castro', platform: 'YouTube', revenue: 48000, followers: 580000, engagement: 4.2 },
  { id: 10, name: 'Gabriel Martins', platform: 'Instagram', revenue: 42000, followers: 520000, engagement: 4.6 },
];

// Dados de faturamento mensal
const revenueData = [
  { name: 'Jan', revenue: 352000, investment: 41000 },
  { name: 'Fev', revenue: 384000, investment: 43500 },
  { name: 'Mar', revenue: 421000, investment: 46000 },
  { name: 'Abr', revenue: 465000, investment: 48200 },
  { name: 'Mai', revenue: 498000, investment: 51500 },
  { name: 'Jun', revenue: 532000, investment: 55800 },
  { name: 'Jul', revenue: 578000, investment: 58500 },
  { name: 'Ago', revenue: 612000, investment: 62000 },
  { name: 'Set', revenue: 645000, investment: 65300 },
  { name: 'Out', revenue: 689000, investment: 69500 },
  { name: 'Nov', revenue: 784000, investment: 75800 },
  { name: 'Dez', revenue: 852000, investment: 82000 },
];

// Dados trimestrais
const quarterlyData = [
  { name: 'Q1', revenue: 1157000, investment: 130500 },
  { name: 'Q2', revenue: 1495000, investment: 155500 },
  { name: 'Q3', revenue: 1835000, investment: 185800 },
  { name: 'Q4', revenue: 2325000, investment: 227300 },
];

// Dados semestrais
const biannualData = [
  { name: '1° Semestre', revenue: 2652000, investment: 286000 },
  { name: '2° Semestre', revenue: 4160000, investment: 413100 },
];

// Dados anuais
const annualData = [
  { name: '2025', revenue: 6812000, investment: 699100 },
];

const Marketing = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 5, 30),
  });

  const [periodView, setPeriodView] = useState("monthly");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Função para determinar quais dados usar com base no período selecionado
  const getTimeData = () => {
    switch(periodView) {
      case "monthly":
        return revenueData;
      case "bimonthly":
        return revenueData.filter((_, index) => index % 2 === 0)
          .map((item, index) => {
            const nextMonth = revenueData[index * 2 + 1];
            return nextMonth ? {
              name: `${item.name}-${nextMonth.name}`,
              revenue: item.revenue + nextMonth.revenue,
              investment: item.investment + nextMonth.investment
            } : item;
          });
      case "quarterly":
        return quarterlyData;
      case "biannual":
        return biannualData;
      case "annual":
        return annualData;
      default:
        return revenueData;
    }
  };
  
  // Formatar para valores em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Calcular ROI total
  const calculateTotalROI = () => {
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalInvestment = revenueData.reduce((sum, item) => sum + item.investment, 0);
    return (totalRevenue / totalInvestment).toFixed(2);
  };
  
  // Calcular crescimento percentual
  const calculateGrowth = () => {
    if (revenueData.length < 2) return 0;
    const firstMonth = revenueData[0].revenue;
    const lastMonth = revenueData[revenueData.length - 1].revenue;
    return (((lastMonth - firstMonth) / firstMonth) * 100).toFixed(1);
  };

  // Função para exportar dados
  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão enviados por email quando estiverem prontos.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing</h2>
          <p className="text-muted-foreground">Análise de performance das campanhas de marketing e tráfego pago.</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "P", { locale: ptBR })} -{" "}
                      {format(dateRange.to, "P", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "P", { locale: ptBR })
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
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                locale={ptBR}
                className="pointer-events-auto"
              />
              <div className="p-3 border-t border-border/60 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDateRange({
                    from: new Date(new Date().getFullYear(), 0, 1),
                    to: new Date()
                  })}
                >
                  Este ano
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    setDateRange({
                      from: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
                      to: today
                    });
                  }}
                >
                  Últimos 30 dias
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Dados
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Faturamento Total" 
          value={formatCurrency(revenueData.reduce((sum, item) => sum + item.revenue, 0))} 
          description="Via Marketing"
          trend={`+${calculateGrowth()}%`} 
          trendUp={true}
          icon={DollarSign}
        />
        <MetricCard 
          title="Investimento" 
          value={formatCurrency(revenueData.reduce((sum, item) => sum + item.investment, 0))} 
          description="Em tráfego pago" 
          trend="+28.3%" 
          trendUp={true}
          icon={BarChart3}
        />
        <MetricCard 
          title="ROI Geral" 
          value={calculateTotalROI()}
          description="Retorno sobre investimento" 
          trend="+18.6%" 
          trendUp={true}
          icon={TrendingUp}
        />
        <MetricCard 
          title="Campanhas Ativas" 
          value="32" 
          description="Nas principais plataformas" 
          trend="+4" 
          trendUp={true}
          icon={Target}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 h-auto gap-4">
          <TabsTrigger value="overview" className="flex items-center gap-2 h-10">
            <BarChart3 className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="platforms" className="flex items-center gap-2 h-10">
            <PieChart className="h-4 w-4" />
            <span>Plataformas</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2 h-10">
            <Target className="h-4 w-4" />
            <span>Campanhas</span>
          </TabsTrigger>
          <TabsTrigger value="influencers" className="flex items-center gap-2 h-10">
            <Award className="h-4 w-4" />
            <span>Influenciadores</span>
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center gap-2 h-10">
            <LineChart className="h-4 w-4" />
            <span>Projeções</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-2">
          {activeTab === "projections" && (
            <div className="flex flex-col sm:flex-row items-center justify-end mb-4 gap-3">
              <p className="text-sm text-muted-foreground mr-2">Visualização:</p>
              <div className="inline-flex gap-1 items-center">
                <Button 
                  variant={periodView === "monthly" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setPeriodView("monthly")}
                >
                  Mensal
                </Button>
                <Button 
                  variant={periodView === "bimonthly" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setPeriodView("bimonthly")}
                >
                  Bimestral
                </Button>
                <Button 
                  variant={periodView === "quarterly" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setPeriodView("quarterly")}
                >
                  Trimestral
                </Button>
                <Button 
                  variant={periodView === "biannual" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setPeriodView("biannual")}
                >
                  Semestral
                </Button>
                <Button 
                  variant={periodView === "annual" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setPeriodView("annual")}
                >
                  Anual
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tab: Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Faturamento vs Investimento</CardTitle>
                <CardDescription>Análise comparativa de receita e custos com marketing</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#34A853" />
                    <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, ""]} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" name="Faturamento" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="investment" name="Investimento" fill="#34A853" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Investimento</CardTitle>
                <CardDescription>Por plataforma de anúncios</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={investmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {investmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Campanhas mais Efetivas</CardTitle>
                <CardDescription>Top 5 campanhas com melhor ROI</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campanha</TableHead>
                      <TableHead>Plataforma</TableHead>
                      <TableHead className="text-right">Faturamento</TableHead>
                      <TableHead className="text-right">ROI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignData.slice(0, 5).map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.platform}</TableCell>
                        <TableCell className="text-right">{formatCurrency(campaign.revenue)}</TableCell>
                        <TableCell className="text-right text-green-600 font-medium">{campaign.roi}x</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Top Influenciadores</CardTitle>
                <CardDescription>Por volume de vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Influenciador</TableHead>
                      <TableHead>Plataforma</TableHead>
                      <TableHead className="text-right">Seguidores</TableHead>
                      <TableHead className="text-right">Faturamento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {influencerData.slice(0, 5).map((influencer) => (
                      <TableRow key={influencer.id}>
                        <TableCell className="font-medium">{influencer.name}</TableCell>
                        <TableCell>{influencer.platform}</TableCell>
                        <TableCell className="text-right">{(influencer.followers / 1000000).toFixed(1)}M</TableCell>
                        <TableCell className="text-right">{formatCurrency(influencer.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Plataformas */}
        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Desempenho por Plataforma</CardTitle>
                <CardDescription>Faturamento mensal por canal de anúncios</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={adPlatformData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, ""]} />
                    <Legend />
                    <Area type="monotone" dataKey="facebook" name="Facebook" stackId="1" stroke="#4267B2" fill="#4267B2" />
                    <Area type="monotone" dataKey="google" name="Google" stackId="1" stroke="#34A853" fill="#34A853" />
                    <Area type="monotone" dataKey="tiktok" name="TikTok" stackId="1" stroke="#000000" fill="#6c6c6c" />
                    <Area type="monotone" dataKey="taboola" name="Taboola" stackId="1" stroke="#004D9C" fill="#004D9C" />
                    <Area type="monotone" dataKey="outbrain" name="Outbrain" stackId="1" stroke="#F18E1C" fill="#F18E1C" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>ROI por Plataforma</CardTitle>
                <CardDescription>Evolução do retorno sobre investimento</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={roiData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}x`, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="facebook" name="Facebook" stroke="#4267B2" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="google" name="Google" stroke="#34A853" strokeWidth={2} />
                    <Line type="monotone" dataKey="tiktok" name="TikTok" stroke="#000000" strokeWidth={2} />
                    <Line type="monotone" dataKey="taboola" name="Taboola" stroke="#004D9C" strokeWidth={2} />
                    <Line type="monotone" dataKey="outbrain" name="Outbrain" stroke="#F18E1C" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {investmentData.map((platform) => (
              <PlatformMetricCard
                key={platform.name}
                name={platform.name}
                color={platform.color}
                share={`${platform.value}%`}
                roi={platform.name === 'Facebook' ? '3.5x' : 
                     platform.name === 'Google' ? '4.2x' : 
                     platform.name === 'TikTok' ? '2.9x' : 
                     platform.name === 'Taboola' ? '2.3x' : '2.1x'}
                investment={platform.name === 'Facebook' ? 'R$ 245.000' : 
                            platform.name === 'Google' ? 'R$ 210.000' : 
                            platform.name === 'TikTok' ? 'R$ 140.000' : 
                            platform.name === 'Taboola' ? 'R$ 70.000' : 'R$ 35.000'}
                revenue={platform.name === 'Facebook' ? 'R$ 857.500' : 
                         platform.name === 'Google' ? 'R$ 882.000' : 
                         platform.name === 'TikTok' ? 'R$ 406.000' : 
                         platform.name === 'Taboola' ? 'R$ 161.000' : 'R$ 73.500'}
              />
            ))}
          </div>
        </TabsContent>

        {/* Tab: Campanhas */}
        <TabsContent value="campaigns" className="space-y-6">
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
        </TabsContent>

        {/* Tab: Influenciadores */}
        <TabsContent value="influencers" className="space-y-6">
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
        </TabsContent>

        {/* Tab: Projeções */}
        <TabsContent value="projections" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projeção de Faturamento vs Investimento</CardTitle>
                <CardDescription>Análise projetada para 2025</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getTimeData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#34A853" />
                    <Tooltip formatter={(value, name) => [
                      `R$ ${Number(value).toLocaleString()}`,
                      name === "revenue" ? "Faturamento" : "Investimento"
                    ]} />
                    <Legend />
                    <Area 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Faturamento" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="investment" 
                      name="Investimento" 
                      stroke="#34A853" 
                      fill="#34A853" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projeção de ROI</CardTitle>
                <CardDescription>Tendência de retorno sobre investimento</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={getTimeData().map(item => ({
                      ...item,
                      roi: (item.revenue / item.investment).toFixed(2)
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}x`, "ROI"]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="roi" 
                      name="ROI" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      activeDot={{ r: 8 }} 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crescimento Projetado</CardTitle>
                <CardDescription>Taxa de crescimento da receita</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData.slice(0, -1).map((item, index) => {
                      const nextMonth = revenueData[index + 1];
                      return {
                        name: item.name,
                        growth: ((nextMonth.revenue - item.revenue) / item.revenue * 100).toFixed(1)
                      };
                    })}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Crescimento"]} />
                    <Bar 
                      dataKey="growth" 
                      name="Crescimento" 
                      fill="#9b87f5" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meta vs Realização</CardTitle>
                <CardDescription>Comparativo com metas estabelecidas</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={revenueData.map(item => ({
                      ...item,
                      meta: item.revenue * 1.2
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, ""]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Realizado" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="meta" 
                      name="Meta" 
                      stroke="#ff0000" 
                      strokeDasharray="5 5"
                      strokeWidth={2} 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend: string;
  trendUp: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const MetricCard = ({ title, value, description, trend, trendUp, icon: Icon }: MetricCardProps) => {
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
          {trendUp ? (
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
          ) : (
            <TrendingUp className="h-4 w-4 text-red-600 mr-1 rotate-180" />
          )}
          <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
          <span className="text-xs text-muted-foreground ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface PlatformMetricCardProps {
  name: string;
  color: string;
  share: string;
  roi: string;
  investment: string;
  revenue: string;
}

const PlatformMetricCard = ({ name, color, share, roi, investment, revenue }: PlatformMetricCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
            {name === 'Facebook' && <span className="text-white font-bold text-xs">F</span>}
            {name === 'Google' && <span className="text-white font-bold text-xs">G</span>}
            {name === 'TikTok' && <span className="text-white font-bold text-xs">T</span>}
            {name === 'Taboola' && <span className="text-white font-bold text-xs">Tb</span>}
            {name === 'Outbrain' && <span className="text-white font-bold text-xs">O</span>}
          </div>
          <p className="text-lg font-bold">{name}</p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Participação:</span>
            <span className="text-sm font-medium">{share}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">ROI:</span>
            <span className="text-sm font-medium text-green-600">{roi}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Investimento:</span>
            <span className="text-sm font-medium">{investment}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Faturamento:</span>
            <span className="text-sm font-medium">{revenue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Marketing;
