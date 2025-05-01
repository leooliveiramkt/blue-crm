
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleAlert, CheckCircle2, SearchIcon, InfoIcon, Loader2 } from 'lucide-react';
import { integrationManager } from '@/lib/integrations/integrationManager';

const OrderTracking = () => {
  const [orderCode, setOrderCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
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
      // Simulação de busca em múltiplas plataformas
      // Em um ambiente real, estas chamadas seriam feitas para as APIs correspondentes
      
      // Simular um tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dados simulados para demonstração
      const simulatedData = {
        wbuy: {
          orderId: orderCode,
          customerEmail: "cliente@exemplo.com",
          value: 397.00,
          date: new Date().toISOString(),
          affiliateCode: "JOAO123",
          status: "approved"
        },
        activeCampaign: {
          contactId: "AC-" + Math.floor(Math.random() * 10000),
          email: "cliente@exemplo.com",
          firstSeen: new Date(Date.now() - 86400000 * 2).toISOString(),
          utmSource: "facebook",
          utmMedium: "cpc",
          utmCampaign: "promo-junho",
          affiliateCode: "JOAO123"
        },
        googleAnalytics: {
          sessionId: "GA-" + Math.floor(Math.random() * 10000),
          firstVisit: new Date(Date.now() - 86400000 * 3).toISOString(),
          lastVisit: new Date(Date.now() - 86400000 * 1).toISOString(),
          source: "facebook.com",
          medium: "cpc",
          campaign: "promo-junho",
          conversionValue: 397.00
        },
        stape: {
          eventId: "ST-" + Math.floor(Math.random() * 10000),
          firstClickTime: new Date(Date.now() - 86400000 * 3).toISOString(),
          lastClickTime: new Date(Date.now() - 86400000 * 1).toISOString(),
          firstClickSource: "facebook.com",
          lastClickSource: "instagram.com",
          affiliateParam: "JOAO123",
          conversionValue: 397.00
        }
      };

      // Análise de correspondência entre plataformas
      const matchingPlatforms = [];
      
      // Verificar correspondência de código de afiliado entre Wbuy e ActiveCampaign
      if (simulatedData.wbuy.affiliateCode === simulatedData.activeCampaign.affiliateCode) {
        matchingPlatforms.push('Wbuy-ActiveCampaign');
      }
      
      // Verificar correspondência de código de afiliado entre Wbuy e Stape
      if (simulatedData.wbuy.affiliateCode === simulatedData.stape.affiliateParam) {
        matchingPlatforms.push('Wbuy-Stape');
      }
      
      // Criar resumo dos dados
      const summary = {
        firstClick: simulatedData.stape.firstClickSource,
        lastClick: simulatedData.stape.lastClickSource,
        affiliateCode: simulatedData.wbuy.affiliateCode,
        confidence: matchingPlatforms.length >= 2 ? 99 : matchingPlatforms.length * 50,
        matchingPlatforms: matchingPlatforms
      };

      // Atualizar estado com os dados coletados
      setTrackingData({
        ...simulatedData,
        summary
      });

    } catch (err) {
      setError('Erro ao buscar dados do pedido. Por favor, tente novamente.');
      console.error('Erro na busca:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const renderPlatformCard = (title: string, data: any, icon: React.ReactNode) => {
    return (
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data && Object.entries(data).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 text-sm">
                <span className="font-medium text-muted-foreground">{key}:</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Rastreamento de Pedidos</h2>
        <p className="text-muted-foreground">
          Consulte informações detalhadas de rastreamento de pedidos em múltiplas plataformas.
        </p>
      </div>

      <Card>
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
            <Button onClick={handleSearch} disabled={isSearching}>
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
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                Resumo da Análise de Atribuição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Origem do tráfego (First Click)</h4>
                    <p className="text-lg font-semibold">{trackingData.summary?.firstClick}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Último click (Last Click)</h4>
                    <p className="text-lg font-semibold">{trackingData.summary?.lastClick}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Código de Afiliado</h4>
                    <p className="text-lg font-semibold">{trackingData.summary?.affiliateCode}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Nível de Confiança</h4>
                    <p className="text-lg font-semibold">{trackingData.summary?.confidence}%</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Correspondência entre plataformas</h4>
                  <div className="flex flex-wrap gap-2">
                    {trackingData.summary?.matchingPlatforms.map((match) => (
                      <span key={match} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                        {match}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todas as Plataformas</TabsTrigger>
              <TabsTrigger value="wbuy">Wbuy</TabsTrigger>
              <TabsTrigger value="activecampaign">Active Campaign</TabsTrigger>
              <TabsTrigger value="ga">Google Analytics</TabsTrigger>
              <TabsTrigger value="stape">Stape.io</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderPlatformCard('Wbuy', trackingData.wbuy, <ShoppingCart className="h-4 w-4 text-blue-600" />)}
                {renderPlatformCard('Active Campaign', trackingData.activeCampaign, <Mail className="h-4 w-4 text-green-600" />)}
                {renderPlatformCard('Google Analytics', trackingData.googleAnalytics, <BarChart3 className="h-4 w-4 text-yellow-600" />)}
                {renderPlatformCard('Stape.io', trackingData.stape, <Globe className="h-4 w-4 text-purple-600" />)}
              </div>
            </TabsContent>

            <TabsContent value="wbuy">
              {renderPlatformCard('Wbuy', trackingData.wbuy, <ShoppingCart className="h-4 w-4 text-blue-600" />)}
            </TabsContent>

            <TabsContent value="activecampaign">
              {renderPlatformCard('Active Campaign', trackingData.activeCampaign, <Mail className="h-4 w-4 text-green-600" />)}
            </TabsContent>

            <TabsContent value="ga">
              {renderPlatformCard('Google Analytics', trackingData.googleAnalytics, <BarChart3 className="h-4 w-4 text-yellow-600" />)}
            </TabsContent>

            <TabsContent value="stape">
              {renderPlatformCard('Stape.io', trackingData.stape, <Globe className="h-4 w-4 text-purple-600" />)}
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader className="flex flex-row items-center">
              <div>
                <CardTitle>Entenda o Rastreamento Multicanal</CardTitle>
                <CardDescription>Como funciona nossa tecnologia de atribuição de vendas</CardDescription>
              </div>
              <InfoIcon className="h-5 w-5 text-muted-foreground ml-auto" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
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
                  <strong>Atribuição precisa:</strong> Isto nos permite identificar tanto o first-click (origem inicial do 
                  lead) quanto o last-click (último ponto de contato antes da compra), garantindo que o afiliado correto 
                  receba o crédito pela venda.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

// Ícone de carrinho de compras para Wbuy
const ShoppingCart = ({ className }: { className?: string }) => (
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

// Reexportar os ícones necessários do Lucide React
const Mail = ({ className }: { className?: string }) => (
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

const BarChart3 = ({ className }: { className?: string }) => (
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

const Globe = ({ className }: { className?: string }) => (
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

export default OrderTracking;
