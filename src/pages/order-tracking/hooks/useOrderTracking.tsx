
import { useState } from 'react';
import { TrackingService } from '@/services/trackingService';
import { useToast } from '@/hooks/use-toast';

export interface TrackingData {
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
  };
}

export const useOrderTracking = () => {
  const [orderCode, setOrderCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

      toast({
        title: "Dados encontrados",
        description: "Informações do pedido recuperadas com sucesso.",
        variant: "default"
      });

      // Após ter os dados básicos, iniciar análise da IA
      if (summary) {
        analyzeWithAI(consolidatedData, summary);
      }

    } catch (err: any) {
      console.error('Erro na busca:', err);
      setError('Erro ao buscar dados do pedido. Por favor, tente novamente.');
      toast({
        title: "Falha na busca",
        description: err.message || "Erro ao buscar dados do pedido",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const analyzeWithAI = async (data: any, summary: any) => {
    setIsAnalyzing(true);
    
    try {
      // Chamar o serviço da IA para análise dos dados
      const aiResult = await TrackingService.analyzeWithOpenAI({ ...data, summary });
      
      setTrackingData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          aiAnalysis: aiResult
        };
      });

      toast({
        title: "Análise concluída",
        description: "A IA finalizou a análise dos dados de rastreamento.",
        variant: "default"
      });
      
    } catch (error: any) {
      console.error('Erro na análise da IA:', error);
      toast({
        title: "Falha na análise",
        description: error.message || "Erro ao analisar dados com IA",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const manualAnalyzeWithAI = () => {
    if (!trackingData || !trackingData.summary) return;
    
    analyzeWithAI(
      {
        wbuy: trackingData.wbuy,
        activeCampaign: trackingData.activeCampaign,
        googleAnalytics: trackingData.googleAnalytics,
        stape: trackingData.stape
      },
      trackingData.summary
    );
  };

  return {
    orderCode,
    setOrderCode,
    isSearching,
    isAnalyzing,
    trackingData,
    error,
    handleSearch,
    analyzeWithAI: manualAnalyzeWithAI
  };
};
