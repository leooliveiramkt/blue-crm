
import { wbuyRepository } from "../repositories/wbuyRepository";
import { activeCampaignRepository } from "../repositories/activeCampaignRepository";
import { googleAnalyticsRepository } from "../repositories/googleAnalyticsRepository";
import { stapeRepository } from "../repositories/stapeRepository";
import { trackingAnalysisService } from "./trackingAnalysisService";
import { TrackingData, AIAnalysisResult } from "../models/types";

export class TrackingService {
  /**
   * Busca todos os dados relacionados a um pedido
   */
  async getOrderTrackingData(orderCode: string): Promise<TrackingData> {
    // Buscar dados do Wbuy primeiro
    const wbuyData = await wbuyRepository.getOrderData(orderCode);
    
    // Buscar dados das outras plataformas em paralelo
    const [activeCampaignData, googleAnalyticsData, stapeData] = await Promise.all([
      activeCampaignRepository.getContactData(wbuyData.customerEmail),
      googleAnalyticsRepository.getTransactionData(orderCode),
      stapeRepository.getEventData(orderCode)
    ]);
    
    // Criar objeto consolidado
    const trackingData: TrackingData = {
      wbuy: wbuyData,
      activeCampaign: activeCampaignData,
      googleAnalytics: googleAnalyticsData,
      stape: stapeData,
      summary: null
    };
    
    // Analisar correlação entre os dados
    const summary = trackingAnalysisService.analyzeCorrelation(trackingData);
    
    // Adicionar resumo ao objeto de dados
    trackingData.summary = summary;
    
    return trackingData;
  }
  
  /**
   * Realiza análise de IA dos dados de rastreamento
   */
  async analyzeOrderWithAI(data: TrackingData): Promise<AIAnalysisResult> {
    return trackingAnalysisService.analyzeWithOpenAI(data);
  }
}

export const trackingService = new TrackingService();
