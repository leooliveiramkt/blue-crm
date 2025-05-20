import { supabase } from '@/lib/supabase';
import { WBuyService } from './wbuyService';

export class WBuySyncService {
  private static instance: WBuySyncService;
  private wbuyService: WBuyService;

  private constructor() {
    this.wbuyService = WBuyService.getInstance();
  }

  static getInstance(): WBuySyncService {
    if (!WBuySyncService.instance) {
      WBuySyncService.instance = new WBuySyncService();
    }
    return WBuySyncService.instance;
  }

  private async updateSyncStatus(tenantId: string, entityType: string, status: string, error?: string) {
    await supabase
      .from('wbuy_sync_status')
      .upsert({
        tenant_id: tenantId,
        entity_type: entityType,
        status,
        error,
        last_sync_at: new Date().toISOString()
      });
  }

  async syncProducts(tenantId: string) {
    try {
      await this.updateSyncStatus(tenantId, 'products', 'syncing');
      
      const products = await this.wbuyService.getProducts();
      
      for (const product of products.data) {
        await supabase
          .from('wbuy_products')
          .upsert({
            id: product.id,
            wbuy_id: product.id,
            tenant_id: tenantId,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            status: product.status,
            category: product.category,
            images: product.images,
            metadata: product,
            last_sync_at: new Date().toISOString()
          });
      }

      await this.updateSyncStatus(tenantId, 'products', 'success');
    } catch (error) {
      await this.updateSyncStatus(tenantId, 'products', 'error', error.message);
      throw error;
    }
  }

  async syncOrders(tenantId: string) {
    try {
      await this.updateSyncStatus(tenantId, 'orders', 'syncing');
      
      const orders = await this.wbuyService.getOrders();
      
      for (const order of orders.data) {
        await supabase
          .from('wbuy_orders')
          .upsert({
            id: order.id,
            wbuy_id: order.id,
            tenant_id: tenantId,
            customer_id: order.customer_id,
            status: order.status,
            total: order.total,
            payment_method: order.payment_method,
            shipping_address: order.shipping_address,
            items: order.items,
            metadata: order,
            last_sync_at: new Date().toISOString()
          });
      }

      await this.updateSyncStatus(tenantId, 'orders', 'success');
    } catch (error) {
      await this.updateSyncStatus(tenantId, 'orders', 'error', error.message);
      throw error;
    }
  }

  async syncCustomers(tenantId: string) {
    try {
      await this.updateSyncStatus(tenantId, 'customers', 'syncing');
      
      const customers = await this.wbuyService.getCustomers();
      
      for (const customer of customers.data) {
        await supabase
          .from('wbuy_customers')
          .upsert({
            id: customer.id,
            wbuy_id: customer.id,
            tenant_id: tenantId,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            document: customer.document,
            address: customer.address,
            metadata: customer,
            last_sync_at: new Date().toISOString()
          });
      }

      await this.updateSyncStatus(tenantId, 'customers', 'success');
    } catch (error) {
      await this.updateSyncStatus(tenantId, 'customers', 'error', error.message);
      throw error;
    }
  }

  async syncStats(tenantId: string) {
    try {
      await this.updateSyncStatus(tenantId, 'stats', 'syncing');
      
      const today = new Date().toISOString().split('T')[0];
      const analytics = await this.wbuyService.getAnalytics({
        start_date: today,
        end_date: today
      });

      const topProducts = await this.wbuyService.getTopProducts({
        start_date: today,
        end_date: today
      });

      const customerAcquisition = await this.wbuyService.getCustomerAcquisition({
        start_date: today,
        end_date: today
      });

      await supabase
        .from('wbuy_stats')
        .upsert({
          tenant_id: tenantId,
          date: today,
          total_sales: analytics.total_sales,
          total_orders: analytics.total_orders,
          total_customers: analytics.total_customers,
          top_products: topProducts,
          customer_acquisition: customerAcquisition,
          metadata: analytics,
          updated_at: new Date().toISOString()
        });

      await this.updateSyncStatus(tenantId, 'stats', 'success');
    } catch (error) {
      await this.updateSyncStatus(tenantId, 'stats', 'error', error.message);
      throw error;
    }
  }

  async syncAll(tenantId: string) {
    try {
      await this.wbuyService.initialize(tenantId);
      
      await Promise.all([
        this.syncProducts(tenantId),
        this.syncOrders(tenantId),
        this.syncCustomers(tenantId),
        this.syncStats(tenantId)
      ]);
    } catch (error) {
      console.error('Erro na sincronização completa:', error);
      throw error;
    }
  }
} 