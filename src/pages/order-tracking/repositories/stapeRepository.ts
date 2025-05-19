
import { StapeData } from "../models/types";
import { integrationManager } from '@/lib/integrations/integrationManager';

export class StapeRepository {
  async getEventData(transactionId: string): Promise<StapeData> {
    // Em um ambiente real, isto faria uma chamada à API do Stape.io
    
    // Simular tempo de resposta da API
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Retornar dados simulados
    return {
      eventId: "ST-" + Math.floor(Math.random() * 10000),
      firstClickTime: new Date(Date.now() - 86400000 * 3).toISOString(),
      lastClickTime: new Date(Date.now() - 86400000 * 1).toISOString(),
      firstClickSource: "facebook.com",
      lastClickSource: "instagram.com",
      affiliateParam: "JOAO123",
      conversionValue: 397.00,
      userIp: "187.xxx.xxx.xxx",
      pixelId: "FB-123456789",
      eventSequence: ["page_view", "view_content", "add_to_cart", "initiate_checkout", "purchase"]
    };
  }
}

export const stapeRepository = new StapeRepository();
