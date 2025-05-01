
import { WbuyOrderData } from "../models/types";
import { integrationManager } from '@/lib/integrations/integrationManager';

export class WbuyRepository {
  async getOrderData(orderCode: string): Promise<WbuyOrderData> {
    // Em um ambiente real, isto faria uma chamada à API da Wbuy
    // usando as credenciais armazenadas no integrationManager
    
    // Simular tempo de resposta da API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Retornar dados simulados
    return {
      orderId: orderCode,
      customerEmail: "cliente@exemplo.com",
      value: 397.00,
      date: new Date().toISOString(),
      affiliateCode: "JOAO123",
      status: "approved",
      paymentMethod: "credit_card",
      products: ["Curso Digital Marketing Pro", "E-book SEO Avançado"],
      customerName: "Maria Silva",
      phoneNumber: "+5511999998888"
    };
  }
}

export const wbuyRepository = new WbuyRepository();
