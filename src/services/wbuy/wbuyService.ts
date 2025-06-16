import axios from 'axios';
import fs from 'fs';
import { logger } from '../../utils/logger';
import { supabase } from '../../config/supabase';
import { WBuyConfig, WBuyProduct, WBuyOrder, WBuyCustomer, WBuyAffiliate, WBuyShipping, WBuyMarketing } from './types';

export class WBuyService {
  private static instance: WBuyService;
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly storeId: string;
  private readonly apiUser: string;
  private readonly apiPassword: string;
  private config: WBuyConfig | null = null;
  private initialized = false;
  private readonly allowedTenants: Set<string> = new Set(['bela-blue']); // Lista de tenants autorizados

  private constructor() {
    // Carrega credenciais das variáveis de ambiente
    this.apiUrl = process.env.WBUY_API_URL || 'https://sistema.sistemawbuy.com.br/api/v1';
    this.apiKey = process.env.WBUY_API_KEY || 'eba83af0e5b1415182d267ef174cc2a9';
    this.storeId = process.env.WBUY_STORE_ID || '384388';
    this.apiUser = process.env.WBUY_API_USER || '61691da4-7fc8-419e-a06d-b9e021d75efc';
    this.apiPassword = process.env.WBUY_API_PASSWORD || 'eba83af0e5b1415182d267ef174cc2a9';

    // Validação de segurança
    if (!this.apiUrl || !this.apiKey || !this.storeId || !this.apiUser || !this.apiPassword) {
      throw new Error('Credenciais WBuy não configuradas corretamente');
    }
  }

  public static getInstance(): WBuyService {
    if (!WBuyService.instance) {
      WBuyService.instance = new WBuyService();
    }
    return WBuyService.instance;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${process.env.WBUY_API_TOKEN || 'NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZjOmViYTgzYWYwZTViMTQxNTE4MmQyNjdlZjE3NGNjMmE5'}`,
      'Content-Type': 'application/json',
      'X-Store-ID': this.storeId
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      logger.info('Testando conexão com WBuy API...');
      logger.info('URL:', this.apiUrl);
      logger.info('Headers:', JSON.stringify(this.getHeaders(), null, 2));

      const response = await axios.get(`${this.apiUrl}/products`, {
        headers: this.getHeaders(),
        params: {
          limit: 1
        }
      });
      
      logger.info('Resposta da API:', JSON.stringify(response.data, null, 2));
      logger.info('Conexão com WBuy API estabelecida com sucesso');
      return true;
    } catch (error: any) {
      logger.error('Erro ao conectar com WBuy API:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      return false;
    }
  }

  async initialize(tenantId: string) {
    try {
      // Verifica se o tenant está autorizado
      if (!this.allowedTenants.has(tenantId)) {
        throw new Error('Tenant não autorizado a acessar a API WBuy');
      }

      const { data, error } = await supabase
        .from('tenant_api_configs')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('provider', 'wbuy')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Configuração WBuy não encontrada');

      this.config = {
        apiUrl: data.api_url,
        apiKey: data.api_key
      };

      this.initialized = true;
      logger.info(`WBuy Service inicializado para tenant: ${tenantId}`);
    } catch (error) {
      this.initialized = false;
      logger.error('Erro ao inicializar WBuy Service:', error);
      throw error;
    }
  }

  private checkInitialized() {
    if (!this.initialized || !this.config) {
      throw new Error('Serviço WBuy não inicializado');
    }
  }

  // Produtos
  async getProducts(params?: { page?: number; limit?: number; category?: string; status?: string }) {
    this.checkInitialized();
    try {
      const response = await axios.get(`${this.config!.apiUrl}/produto`, {
        headers: this.getHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      try {
        const cache = fs.readFileSync('wbuy-cache-produtos.json', 'utf-8');
        return JSON.parse(cache);
      } catch (e) {
        throw error;
      }
    }
  }

  async getProduct(id: string) {
    this.checkInitialized();
    const response = await axios.get(`${this.config!.apiUrl}/products/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createProduct(product: Omit<WBuyProduct, 'id' | 'created_at' | 'updated_at'>) {
    this.checkInitialized();
    const response = await axios.post<WBuyProduct>(`${this.config!.apiUrl}/products`, product, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateProduct(id: string, product: Partial<WBuyProduct>) {
    this.checkInitialized();
    const response = await axios.put<WBuyProduct>(`${this.config!.apiUrl}/products/${id}`, product, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async deleteProduct(id: string) {
    this.checkInitialized();
    const response = await axios.delete(`${this.config!.apiUrl}/products/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  // Pedidos
  async getOrders(params?: { page?: number; limit?: number; status?: string; start_date?: string; end_date?: string }) {
    this.checkInitialized();
    try {
      const response = await axios.get(`${this.config!.apiUrl}/order/`, {
        headers: this.getHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      try {
        const cache = fs.readFileSync('wbuy-cache-pedidos.json', 'utf-8');
        return JSON.parse(cache);
      } catch (e) {
        throw error;
      }
    }
  }

  async getOrder(id: string) {
    this.checkInitialized();
    const response = await axios.get(`${this.config!.apiUrl}/orders/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateOrderStatus(id: string, status: WBuyOrder['status']) {
    this.checkInitialized();
    const response = await axios.patch<WBuyOrder>(`${this.config!.apiUrl}/orders/${id}/status`, { status }, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  // Clientes
  async getCustomers(params?: { page?: number; limit?: number; search?: string }) {
    this.checkInitialized();
    try {
      const response = await axios.get(`${this.config!.apiUrl}/cliente`, {
        headers: this.getHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      try {
        const cache = fs.readFileSync('wbuy-cache-clientes.json', 'utf-8');
        return JSON.parse(cache);
      } catch (e) {
        throw error;
      }
    }
  }

  async getCustomer(id: string) {
    this.checkInitialized();
    const response = await axios.get(`${this.config!.apiUrl}/customers/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createCustomer(customer: Omit<WBuyCustomer, 'id' | 'created_at' | 'updated_at'>) {
    this.checkInitialized();
    const response = await axios.post<WBuyCustomer>(`${this.config!.apiUrl}/customers`, customer, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateCustomer(id: string, customer: Partial<WBuyCustomer>) {
    this.checkInitialized();
    const response = await axios.put<WBuyCustomer>(`${this.config!.apiUrl}/customers/${id}`, customer, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  // Afiliados
  async getAffiliates(params?: { page?: number; limit?: number; status?: string }) {
    this.checkInitialized();
    const response = await axios.get<{ data: WBuyAffiliate[]; total: number }>(`${this.config!.apiUrl}/affiliates`, {
      headers: this.getHeaders(),
      params
    });
    return response.data;
  }

  async getAffiliate(id: string) {
    this.checkInitialized();
    const response = await axios.get<WBuyAffiliate>(`${this.config!.apiUrl}/affiliates/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createAffiliate(affiliate: Omit<WBuyAffiliate, 'id' | 'created_at' | 'updated_at'>) {
    this.checkInitialized();
    const response = await axios.post<WBuyAffiliate>(`${this.config!.apiUrl}/affiliates`, affiliate, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateAffiliate(id: string, affiliate: Partial<WBuyAffiliate>) {
    this.checkInitialized();
    const response = await axios.put<WBuyAffiliate>(`${this.config!.apiUrl}/affiliates/${id}`, affiliate, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  // Envios
  async getShippings(params?: { page?: number; limit?: number; status?: string; order_id?: string }) {
    this.checkInitialized();
    const response = await axios.get<{ data: WBuyShipping[]; total: number }>(`${this.config!.apiUrl}/shippings`, {
      headers: this.getHeaders(),
      params
    });
    return response.data;
  }

  async getShipping(id: string) {
    this.checkInitialized();
    const response = await axios.get<WBuyShipping>(`${this.config!.apiUrl}/shippings/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createShipping(shipping: Omit<WBuyShipping, 'id' | 'created_at' | 'updated_at'>) {
    this.checkInitialized();
    const response = await axios.post<WBuyShipping>(`${this.config!.apiUrl}/shippings`, shipping, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateShippingStatus(id: string, status: WBuyShipping['status']) {
    this.checkInitialized();
    const response = await axios.patch<WBuyShipping>(`${this.config!.apiUrl}/shippings/${id}/status`, { status }, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  // Marketing
  async getMarketingCampaigns(params?: { page?: number; limit?: number; status?: string; type?: string }) {
    this.checkInitialized();
    const response = await axios.get<{ data: WBuyMarketing[]; total: number }>(`${this.config!.apiUrl}/marketing/campaigns`, {
      headers: this.getHeaders(),
      params
    });
    return response.data;
  }

  async getMarketingCampaign(id: string) {
    this.checkInitialized();
    const response = await axios.get<WBuyMarketing>(`${this.config!.apiUrl}/marketing/campaigns/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createMarketingCampaign(campaign: Omit<WBuyMarketing, 'id' | 'created_at' | 'updated_at'>) {
    this.checkInitialized();
    const response = await axios.post<WBuyMarketing>(`${this.config!.apiUrl}/marketing/campaigns`, campaign, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateMarketingCampaign(id: string, campaign: Partial<WBuyMarketing>) {
    this.checkInitialized();
    const response = await axios.put<WBuyMarketing>(`${this.config!.apiUrl}/marketing/campaigns/${id}`, campaign, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  // Analytics
  async getAnalytics(params: { start_date: string; end_date: string; metrics?: string[] }) {
    this.checkInitialized();
    const response = await axios.get(`${this.config!.apiUrl}/analytics`, {
      headers: this.getHeaders(),
      params
    });
    return response.data;
  }

  async getTopProducts(params: { start_date: string; end_date: string; limit?: number }) {
    this.checkInitialized();
    const response = await axios.get(`${this.config!.apiUrl}/analytics/top-products`, {
      headers: this.getHeaders(),
      params
    });
    return response.data;
  }

  async getCustomerAcquisition(params: { start_date: string; end_date: string }) {
    this.checkInitialized();
    const response = await axios.get(`${this.config!.apiUrl}/analytics/customer-acquisition`, {
      headers: this.getHeaders(),
      params
    });
    return response.data;
  }

  private async request<T>(endpoint: string, method: string = 'GET', data?: any): Promise<T> {
    try {
      const response = await axios({
        url: `${this.apiUrl}${endpoint}`,
        method,
        data,
        headers: this.getHeaders()
      });

      return response.data;
    } catch (error) {
      logger.error(`WBuy API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  public async getStats(): Promise<any> {
    return this.request<any>('/stats');
  }

  public async handleOrderCreated(payload: any): Promise<void> {
    const { error } = await supabase
      .from('wbuy_orders')
      .upsert({
        wbuy_id: payload.id,
        customer_id: payload.customerId,
        status: payload.status,
        total: payload.total,
        payment_method: payload.paymentMethod,
        shipping_address: payload.shippingAddress,
        items: payload.items,
        metadata: payload.metadata,
        last_sync_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }
  }

  public async handleOrderUpdated(payload: any): Promise<void> {
    await this.handleOrderCreated(payload);
  }

  public async handleProductUpdated(payload: any): Promise<void> {
    const { error } = await supabase
      .from('wbuy_products')
      .upsert({
        wbuy_id: payload.id,
        name: payload.name,
        description: payload.description,
        price: payload.price,
        stock: payload.stock,
        status: payload.status,
        category: payload.category,
        images: payload.images,
        metadata: payload.metadata,
        last_sync_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }
  }

  public async handleCustomerUpdated(payload: any): Promise<void> {
    const { error } = await supabase
      .from('wbuy_customers')
      .upsert({
        wbuy_id: payload.id,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        document: payload.document,
        address: payload.address,
        metadata: payload.metadata,
        last_sync_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }
  }
} 