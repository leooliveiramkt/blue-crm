
import { WbuyOrderData } from "../models/types";
import { integrationManager } from '@/lib/integrations/integrationManager';
import { wbuyApiService } from "@/services/wbuy-api";
import { useToast } from "@/hooks/use-toast";

export class WbuyRepository {
  async getOrderData(orderCode: string): Promise<WbuyOrderData> {
    try {
      // Verificar se a integração está ativa
      const integration = await integrationManager.getIntegration('wbuy');
      
      if (!integration || integration.status !== 'connected') {
        console.log('Usando dados simulados (integração Wbuy não configurada)');
        return this.getMockOrderData(orderCode);
      }
      
      // Tentar buscar dados reais da API
      const result = await wbuyApiService.getOrderData(orderCode);
      
      if (result) {
        return this.formatOrderData(result);
      } else {
        console.log('Falha ao obter dados reais, usando dados simulados');
        return this.getMockOrderData(orderCode);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do pedido:', error);
      // Em caso de erro, retornar dados simulados
      return this.getMockOrderData(orderCode);
    }
  }
  
  // Formata os dados brutos da API para o formato esperado pelo sistema
  private formatOrderData(rawData: any): WbuyOrderData {
    try {
      return {
        orderId: rawData.order_id || rawData.id || '',
        customerEmail: rawData.customer?.email || rawData.email || '',
        value: parseFloat(rawData.total || rawData.value || '0'),
        date: rawData.created_at || rawData.date || new Date().toISOString(),
        affiliateCode: rawData.affiliate_code || rawData.producer_code || '',
        status: rawData.status || 'approved',
        paymentMethod: rawData.payment_method || rawData.payment_type || 'credit_card',
        products: Array.isArray(rawData.products) 
          ? rawData.products.map((p: any) => p.name || p) 
          : ['Produto não especificado'],
        customerName: rawData.customer?.name || rawData.customer_name || '',
        phoneNumber: rawData.customer?.phone || rawData.phone_number || ''
      };
    } catch (err) {
      console.error('Erro ao formatar dados do pedido:', err);
      return this.getMockOrderData(rawData.order_id || '');
    }
  }
  
  // Gera dados simulados para demonstração
  private getMockOrderData(orderCode: string): WbuyOrderData {
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
