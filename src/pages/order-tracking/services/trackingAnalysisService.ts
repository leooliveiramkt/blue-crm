
import { TrackingData, TrackingSummary, AIAnalysisResult } from "../models/types";

export class TrackingAnalysisService {
  /**
   * Analisa a correspondência entre dados de diferentes plataformas
   */
  analyzeCorrelation(data: TrackingData): TrackingSummary {
    const matchingPlatforms = [];
    
    // Verificar correspondência de código de afiliado entre Wbuy e ActiveCampaign
    if (data.wbuy.affiliateCode === data.activeCampaign.affiliateCode) {
      matchingPlatforms.push('Wbuy-ActiveCampaign');
    }
    
    // Verificar correspondência de código de afiliado entre Wbuy e Stape
    if (data.wbuy.affiliateCode === data.stape.affiliateParam) {
      matchingPlatforms.push('Wbuy-Stape');
    }
    
    // Verificar correspondência de campanha entre ActiveCampaign e Google Analytics
    if (data.activeCampaign.utmCampaign === data.googleAnalytics.campaign) {
      matchingPlatforms.push('ActiveCampaign-Google Analytics');
    }
    
    // Calcular confiança com base nas correspondências
    let confidence = matchingPlatforms.length * 33;
    // Garantir que não ultrapasse 100%
    confidence = Math.min(confidence, 99);
    
    // Criar resumo dos dados
    return {
      firstClick: data.stape.firstClickSource,
      lastClick: data.stape.lastClickSource,
      affiliateCode: data.wbuy.affiliateCode,
      confidence: confidence,
      matchingPlatforms: matchingPlatforms
    };
  }
  
  /**
   * Em ambiente de produção, essa função faria a chamada para a API da OpenAI
   * para análise inteligente dos dados de rastreamento
   */
  async analyzeWithOpenAI(data: TrackingData): Promise<AIAnalysisResult> {
    // Simulação - em ambiente real seria uma chamada à API da OpenAI
    
    // Simular tempo de processamento da IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Exemplo de resposta da IA
    return {
      conclusion: `Este pedido foi originado por uma campanha de ${data.googleAnalytics.campaign} no ${data.stape.firstClickSource} e convertido após interação final com conteúdo do afiliado ${data.wbuy.affiliateCode}.`,
      attribution: `A venda deve ser atribuída ao afiliado ${data.wbuy.affiliateCode} com alto grau de confiança.`,
      confidence: data.summary?.confidence > 80 ? "Alta" : data.summary?.confidence > 50 ? "Média" : "Baixa",
      recommendedAction: data.summary?.confidence > 80 
        ? "Processar comissão normalmente" 
        : "Verificar manualmente os dados de atribuição"
    };
  }
}

export const trackingAnalysisService = new TrackingAnalysisService();
