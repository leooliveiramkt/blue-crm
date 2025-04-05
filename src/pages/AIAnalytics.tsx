import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Brain, BarChart3, LineChart, ShoppingBag, Activity, AlertTriangle, Lightbulb, Layers, TrendingUp } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useToast } from "@/components/ui/use-toast";

const revenueData = [
  { month: 'Jan', valor: 15000, previsao: 14000 },
  { month: 'Fev', valor: 18000, previsao: 17500 },
  { month: 'Mar', valor: 16500, previsao: 17000 },
  { month: 'Abr', valor: 21000, previsao: 19000 },
  { month: 'Mai', valor: 19500, previsao: 20000 },
  { month: 'Jun', valor: 22000, previsao: 21000 },
  { month: 'Jul', valor: 23500, previsao: 22000 },
  { month: 'Ago', valor: 25000, previsao: 24000 },
  { month: 'Set', valor: 24000, previsao: 25000 },
  { month: 'Out', valor: 27000, previsao: 26000 },
  { month: 'Nov', valor: 29000, previsao: 28000 },
  { month: 'Dez', valor: 32000, previsao: 30000 },
];

const attributionData = [
  { name: 'Marketing (Correto)', value: 62 },
  { name: 'Marketing (Incorreto)', value: 8 },
  { name: 'Comercial (Correto)', value: 28 },
  { name: 'Comercial (Incorreto)', value: 2 },
  { name: 'Afiliados (Correto)', value: 17 },
  { name: 'Afiliados (Incorreto)', value: 3 },
];

const colors = ['#4338ca', '#8b5cf6', '#0ea5e9', '#38bdf8', '#f97316', '#fb923c'];

const topProducts = [
  { name: 'Produto Premium X', vendas: 420, crescimento: '+24%', previsao: 'Alta' },
  { name: 'Serviço Mensal Y', vendas: 315, crescimento: '+12%', previsao: 'Média' },
  { name: 'Pacote Completo Z', vendas: 280, crescimento: '+8%', previsao: 'Alta' },
  { name: 'Assinatura Anual', vendas: 245, crescimento: '+15%', previsao: 'Alta' },
  { name: 'Curso Avançado', vendas: 189, crescimento: '+5%', previsao: 'Baixa' },
];

const suggestoes = [
  {
    titulo: "Otimize atribuições de campanhas de marketing",
    descricao: "Detectamos 14% de discrepâncias nas atribuições. Recomendamos revisar UTMs de Facebook e Google Ads.",
    tipo: "alerta",
    icon: AlertTriangle
  },
  {
    titulo: "Aumente vendas sazonais no próximo trimestre",
    descricao: "A análise preditiva indica oportunidade de aumento de 22% nas vendas se o estoque de Produto Premium X for aumentado em 30%.",
    tipo: "oportunidade",
    icon: TrendingUp
  },
  {
    titulo: "Melhore taxas de conversão no marketing",
    descricao: "As campanhas via email marketing estão performando 35% melhor que as de mídia social para produtos premium.",
    tipo: "insight",
    icon: Lightbulb
  },
  {
    titulo: "Ajuste a estratégia para afiliados",
    descricao: "Os afiliados com treinamento completo performam 58% melhor. Recomendamos padronizar o onboarding.",
    tipo: "recomendação",
    icon: Layers
  },
];

const AIAnalytics = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  
  const runAdvancedAIAnalysis = async () => {
    setLoading(true);
    toast({
      title: "Análise Avançada de IA iniciada",
      description: "Processando insights profundos com AIDER.",
    });
    
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: 'Análise de dados de vendas, atribuições e previsões',
          questions: [
            'Quais são os produtos mais vendáveis?',
            'Qual a previsão de crescimento para o próximo trimestre?',
            'Existem padrões de sazonalidade relevantes?'
          ]
        })
      });

      const data = await response.json();
      setAiInsights(data.insights);
      
      toast({
        title: "Análise Concluída",
        description: "Novos insights gerados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na Análise",
        description: "Não foi possível gerar insights.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Análise de IA</h2>
            <Badge variant="outline" className="bg-primary/10 text-primary">Beta</Badge>
          </div>
          <p className="text-muted-foreground">Análise inteligente de dados e recomendações para seu negócio.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={runAdvancedAIAnalysis} 
            disabled={loading} 
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Brain className="h-4 w-4" />
            {loading ? "Processando..." : "Análise Avançada AIDER"}
          </Button>
        </div>
      </div>

      {aiInsights && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Insights Avançados da IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{aiInsights}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="insights" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden md:inline">Insights</span>
          </TabsTrigger>
          <TabsTrigger value="atribuicoes" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span className="hidden md:inline">Atribuições</span>
          </TabsTrigger>
          <TabsTrigger value="previsoes" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span className="hidden md:inline">Previsões</span>
          </TabsTrigger>
          <TabsTrigger value="produtos" className="flex items-center gap-1">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden md:inline">Produtos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {suggestoes.map((sugestao, index) => (
              <Card key={index} className="border-l-4" style={{ borderLeftColor: sugestao.tipo === 'alerta' ? '#f97316' : sugestao.tipo === 'oportunidade' ? '#10b981' : '#8b5cf6' }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{sugestao.titulo}</CardTitle>
                    <sugestao.icon className={`h-5 w-5 ${
                      sugestao.tipo === 'alerta' ? 'text-orange-500' : 
                      sugestao.tipo === 'oportunidade' ? 'text-emerald-500' : 
                      'text-violet-500'
                    }`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{sugestao.descricao}</p>
                </CardContent>
                <CardFooter className="pt-1">
                  <Button variant="ghost" size="sm">
                    Ver detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="atribuicoes" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Atribuições</CardTitle>
              <CardDescription>
                Verificação de precisão na atribuição de vendas por canal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {attributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Análise da IA</h4>
                  <p className="text-sm text-muted-foreground">
                    A análise detectou cerca de 13% de atribuições potencialmente incorretas. 
                    Recomendamos revisar os parâmetros UTM em campanhas do Facebook Ads e 
                    melhorar o rastreamento de sessões para obter maior precisão.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="previsoes" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Previsões de Receita</CardTitle>
              <CardDescription>
                Análise preditiva de receita para os próximos 12 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                    <Area type="monotone" dataKey="valor" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Valor Atual" />
                    <Area type="monotone" dataKey="previsao" stackId="2" stroke="#38bdf8" fill="#38bdf8" name="Previsão" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Análise da IA</h4>
                  <p className="text-sm text-muted-foreground">
                    Projetamos um crescimento de 15% para o próximo trimestre com base em 
                    tendências sazonais e performance das campanhas atuais. 
                    Oportunidades de crescimento adicionais podem ser alcançadas 
                    aumentando investimento em campanhas de afiliados em 20%.
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="produtos" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance de Produtos</CardTitle>
                <CardDescription>
                  Volume de vendas e crescimento por produto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="vendas" fill="#8b5cf6" name="Vendas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Produtos</CardTitle>
                <CardDescription>
                  Análise de performance e previsão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {topProducts.map((produto, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{produto.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary">{produto.vendas} vendas</Badge>
                          <span className="text-xs font-medium text-green-600">{produto.crescimento}</span>
                        </div>
                      </div>
                      <Badge variant={
                        produto.previsao === 'Alta' ? 'default' : 
                        produto.previsao === 'Média' ? 'secondary' : 
                        'outline'
                      }>
                        {produto.previsao}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Ver Análise Completa</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAnalytics;
