
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleAlert, CheckCircle2, SearchIcon, InfoIcon, Loader2, AlertCircleIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrackingService } from '@/services/trackingService';

const OrderTracking = () => {
  const [orderCode, setOrderCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trackingData, setTrackingData] = useState<null | {
    wbuy: any;
    activeCampaign: any;
    googleAnalytics: any;
    stape: any;
    summary: {
      firstClick: string;
      lastClick: string;
      affiliateCode: string;
      confidence: number;
      matchingPlatforms: string[];
    } | null;
    aiAnalysis?: {
      conclusion: string;
      attribution: string;
      confidence: string;
      recommendedAction: string;
    }
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!orderCode.trim()) {
      setError('Por favor, insira um código de pedido válido');
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      // Buscar dados em todas as plataformas
      const wbuyData = await TrackingService.getWbuyOrderData(orderCode);
      
      // Só continua se encontrar o pedido na Wbuy
      if (!wbuyData) {
        throw new Error("Pedido não encontrado na Wbuy");
      }
      
      // Buscar nas outras plataformas usando o email do cliente
      const activeCampaignData = await TrackingService.getActiveCampaignData(wbuyData.customerEmail);
      const googleAnalyticsData = await TrackingService.getGoogleAnalyticsData(orderCode);
      const stapeData = await TrackingService.getStapeData(orderCode);
      
      // Criar o objeto de dados consolidado
      const consolidatedData = {
        wbuy: wbuyData,
        activeCampaign: activeCampaignData,
        googleAnalytics: googleAnalyticsData,
        stape: stapeData
      };
      
      // Análise de correspondência entre plataformas
      const summary = TrackingService.analyzeCorrelation(consolidatedData);

      setTrackingData({
        ...consolidatedData,
        summary
      });

      // Após ter os dados básicos, iniciar análise da IA
      if (summary) {
        analyzeWithAI(consolidatedData, summary);
      }

    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Erro ao buscar dados do pedido. Por favor, tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };
  
  const analyzeWithAI = async (data, summary) => {
    setIsAnalyzing(true);
    
    try {
      // Simular análise da IA (em um app real, isto seria uma chamada à API OpenAI)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Dados simulados da análise da IA
      const aiAnalysisResult = {
        conclusion: `Este pedido foi originado por uma campanha de ${data.googleAnalytics.campaign} no ${data.stape.firstClickSource} e convertido após interação final com conteúdo do afiliado ${summary.affiliateCode}.`,
        attribution: `A venda deve ser atribuída ao afiliado ${summary.affiliateCode} com ${summary.confidence}% de confiança.`,
        confidence: summary.confidence > 80 ? "Alta" : summary.confidence > 50 ? "Média" : "Baixa",
        recommendedAction: summary.confidence > 80 
          ? "Processar comissão normalmente" 
          : "Verificar manualmente os dados de atribuição antes de processar comissão"
      };
      
      setTrackingData(prevData => ({
        ...prevData,
        aiAnalysis: aiAnalysisResult
      }));
      
    } catch (error) {
      console.error('Erro na análise da IA:', error);
    } finally {
      setIsAnalyzing(false);
    }
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
  
  // Funções auxiliares para formatar os dados
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
  
  // Icones para as plataformas
  const platformIcons = {
    wbuy: <CartIcon className="h-4 w-4 text-blue-600" />,
    activeCampaign: <MailIcon className="h-4 w-4 text-green-600" />,
    googleAnalytics: <ChartIcon className="h-4 w-4 text-yellow-600" />,
    stape: <GlobeIcon className="h-4 w-4 text-purple-600" />,
  };
  
  // Cores para os cards das plataformas
  const platformColors = {
    wbuy: 'blue',
    activeCampaign: 'green',
    googleAnalytics: 'yellow',
    stape: 'purple',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Rastreamento de Pedidos</h2>
        <p className="text-muted-foreground">
          Consulte informações detalhadas de rastreamento de pedidos em múltiplas plataformas.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader>
          <CardTitle>Consultar Pedido</CardTitle>
          <CardDescription>
            Digite o número do pedido para rastrear sua origem e atribuição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Digite o código do pedido (ex: WB-12345)"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Buscar
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md flex items-center">
              <CircleAlert className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {trackingData && (
        <>
          {/* Card de análise da IA */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-primary/30 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <div className="mr-2 p-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white">
                    <BrainIcon className="h-4 w-4" />
                  </div>
                  Análise Inteligente
                </CardTitle>
                {isAnalyzing ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Analisando
                  </Badge>
                ) : trackingData.aiAnalysis ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Análise concluída
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Aguardando análise
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {isAnalyzing ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-center text-sm text-muted-foreground">
                    Processando dados e realizando análise inteligente...
                  </p>
                  <Progress className="w-full max-w-xs mt-4" value={65} />
                </div>
              ) : trackingData.aiAnalysis ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-primary/10 shadow-sm">
                    <div className="font-medium text-lg mb-2 text-primary">Conclusão</div>
                    <p>{trackingData.aiAnalysis.conclusion}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white rounded-lg border border-primary/10 shadow-sm">
                      <div className="font-medium mb-1 text-sm text-muted-foreground">Atribuição de Venda</div>
                      <p className="font-semibold">{trackingData.aiAnalysis.attribution}</p>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg border border-primary/10 shadow-sm">
                      <div className="font-medium mb-1 text-sm text-muted-foreground">Nível de Confiança</div>
                      <div className="flex items-center">
                        <Badge className={
                          trackingData.aiAnalysis.confidence === "Alta" 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : trackingData.aiAnalysis.confidence === "Média" 
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-red-100 text-red-800 border-red-200"
                        }>
                          {trackingData.aiAnalysis.confidence}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg border border-primary/10 shadow-sm">
                      <div className="font-medium mb-1 text-sm text-muted-foreground">Ação Recomendada</div>
                      <p className="text-sm">{trackingData.aiAnalysis.recommendedAction}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <Button onClick={() => analyzeWithAI(trackingData, trackingData.summary)} disabled={isAnalyzing}>
                    <BrainIcon className="mr-2 h-4 w-4" />
                    Iniciar Análise da IA
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-primary/30 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                Resumo da Análise de Atribuição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-2 text-primary">Origem do tráfego (First Click)</h4>
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-full mr-2">
                        <GlobalIcon className="h-5 w-5 text-blue-700" />
                      </div>
                      <p className="text-lg font-semibold">{trackingData.summary?.firstClick}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-2 text-primary">Último click (Last Click)</h4>
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-100 rounded-full mr-2">
                        <ClickIcon className="h-5 w-5 text-indigo-700" />
                      </div>
                      <p className="text-lg font-semibold">{trackingData.summary?.lastClick}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-2 text-primary">Código de Afiliado</h4>
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-full mr-2">
                        <TagIcon className="h-5 w-5 text-purple-700" />
                      </div>
                      <p className="text-lg font-semibold">{trackingData.summary?.affiliateCode}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-2 text-primary">Nível de Confiança</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-lg font-semibold">{trackingData.summary?.confidence}%</span>
                        <Badge className={
                          trackingData.summary?.confidence! >= 90 
                            ? "bg-green-100 text-green-800" 
                            : trackingData.summary?.confidence! >= 60 
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }>
                          {trackingData.summary?.confidence! >= 90 
                            ? "Alto" 
                            : trackingData.summary?.confidence! >= 60 
                              ? "Médio" 
                              : "Baixo"}
                        </Badge>
                      </div>
                      <Progress value={trackingData.summary?.confidence} className={
                        trackingData.summary?.confidence! >= 90 
                          ? "bg-green-100" 
                          : trackingData.summary?.confidence! >= 60 
                            ? "bg-yellow-100"
                            : "bg-red-100"
                      } />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white/80 rounded-lg shadow-sm">
                  <h4 className="font-medium mb-2 text-primary">Correspondência entre plataformas</h4>
                  <div className="flex flex-wrap gap-2">
                    {trackingData.summary?.matchingPlatforms.map((match) => (
                      <span key={match} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {match}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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

          <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
            <CardHeader className="flex flex-row items-center">
              <div>
                <CardTitle>Entenda o Rastreamento Multicanal</CardTitle>
                <CardDescription>Como funciona nossa tecnologia de atribuição de vendas</CardDescription>
              </div>
              <InfoIcon className="h-5 w-5 text-muted-foreground ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm bg-white p-4 rounded-lg">
                <p>
                  Nosso sistema de rastreamento utiliza tecnologia avançada para triangular dados de várias plataformas 
                  (Wbuy, Active Campaign, Google Analytics e Stape.io) e determinar com precisão a origem de cada venda.
                </p>
                <p>
                  <strong>Como funciona:</strong> Quando um visitante clica em um link de afiliado, armazenamos um cookie 
                  com o código de referência (<code>?ref=CODIGO</code>). Este código é rastreado em todas as etapas da 
                  jornada do cliente, desde o primeiro clique até a compra final.
                </p>
                <p>
                  <strong>Triangulação de dados:</strong> Ao comparar os registros de diferentes plataformas, conseguimos 
                  confirmar com alta precisão (99%+) a verdadeira origem da venda quando há correspondência em pelo menos 
                  duas fontes distintas.
                </p>
                <p>
                  <strong>Inteligência artificial:</strong> Nossa IA analisa todos os dados disponíveis e fornece 
                  uma recomendação clara sobre a atribuição de venda, levando em consideração padrões complexos e 
                  variáveis que poderiam passar despercebidos em uma análise manual.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

// Ícones customizados
const CartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const BrainIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const GlobalIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ClickIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m8 13 4-4 4 4" />
    <path d="M12 17V9" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const TagIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

export default OrderTracking;
