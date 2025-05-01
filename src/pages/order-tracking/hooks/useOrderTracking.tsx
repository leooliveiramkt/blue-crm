
import { useState } from 'react';
import { TrackingData } from '../models/types';
import { trackingService } from '../services/trackingService';
import { useToast } from '@/hooks/use-toast';

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
      // Buscar dados em todas as plataformas usando o novo serviço
      const data = await trackingService.getOrderTrackingData(orderCode);
      
      setTrackingData(data);

      toast({
        title: "Dados encontrados",
        description: "Informações do pedido recuperadas com sucesso.",
        variant: "default"
      });

      // Após ter os dados básicos, iniciar análise da IA
      if (data.summary) {
        analyzeWithAI();
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
  
  const analyzeWithAI = async () => {
    if (!trackingData) return;
    
    setIsAnalyzing(true);
    
    try {
      // Chamar o serviço da IA para análise dos dados
      const aiResult = await trackingService.analyzeOrderWithAI(trackingData);
      
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
    analyzeWithAI();
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
