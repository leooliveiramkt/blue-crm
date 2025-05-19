
import { ActiveCampaignData } from "../models/types";
import { integrationManager } from '@/lib/integrations/integrationManager';

export class ActiveCampaignRepository {
  async getContactData(email: string): Promise<ActiveCampaignData> {
    // Em um ambiente real, isto faria uma chamada à API do Active Campaign
    
    // Simular tempo de resposta da API
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Retornar dados simulados
    return {
      contactId: "AC-" + Math.floor(Math.random() * 10000),
      email: email,
      firstSeen: new Date(Date.now() - 86400000 * 2).toISOString(),
      utmSource: "facebook",
      utmMedium: "cpc",
      utmCampaign: "promo-junho",
      affiliateCode: "JOAO123",
      tags: ["lead-quente", "interesse-marketing"],
      score: 85,
      lastEngagement: new Date(Date.now() - 86400000 * 1).toISOString()
    };
  }
}

export const activeCampaignRepository = new ActiveCampaignRepository();
