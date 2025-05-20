import { supabase } from '@/lib/supabase';
import { WBuyService } from './wbuyService';
import { logger } from '@/utils/logger';
import { Database } from '@/types/supabase';

type EntityType = 'products' | 'orders' | 'customers' | 'stats';
type SyncStatus = 'syncing' | 'success' | 'error';

interface SyncJob {
  tenantId: string;
  entityType: EntityType;
  timestamp: number;
  retryCount: number;
}

export class WBuyRealtimeSync {
  private static instance: WBuyRealtimeSync;
  private wbuyService: WBuyService;
  private syncQueue: SyncJob[] = [];
  private isProcessing: boolean = false;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 5000; // 5 segundos
  private processingInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.wbuyService = WBuyService.getInstance();
    this.startProcessing();
  }

  static getInstance(): WBuyRealtimeSync {
    if (!WBuyRealtimeSync.instance) {
      WBuyRealtimeSync.instance = new WBuyRealtimeSync();
    }
    return WBuyRealtimeSync.instance;
  }

  private startProcessing() {
    this.processingInterval = setInterval(async () => {
      if (this.syncQueue.length > 0 && !this.isProcessing) {
        const job = this.syncQueue.shift();
        if (job) {
          await this.processJob(job);
        }
      }
    }, 1000);
  }

  private async processJob(job: SyncJob) {
    const { tenantId, entityType, retryCount } = job;
    
    try {
      this.isProcessing = true;
      await this.processSyncJob(tenantId, entityType);
      logger.info(`Sincronização concluída para ${entityType} do tenant ${tenantId}`);
    } catch (error: unknown) {
      logger.error(`Erro na sincronização de ${entityType}:`, error);
      
      if (retryCount < this.MAX_RETRIES) {
        await this.scheduleRetry(tenantId, entityType, retryCount + 1);
      } else {
        await this.handleSyncFailure(tenantId, entityType, error);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async processSyncJob(tenantId: string, entityType: EntityType) {
    const lastSync = await this.getLastSyncTime(tenantId, entityType);
    const now = Date.now();

    if (lastSync && now - lastSync < 60000) {
      logger.info(`Cache válido para ${entityType} do tenant ${tenantId}`);
      return;
    }

    await this.wbuyService.initialize(tenantId);

    switch (entityType) {
      case 'products':
        await this.syncProducts(tenantId);
        break;
      case 'orders':
        await this.syncOrders(tenantId);
        break;
      case 'customers':
        await this.syncCustomers(tenantId);
        break;
      case 'stats':
        await this.syncStats(tenantId);
        break;
    }

    await this.updateLastSyncTime(tenantId, entityType, now);
  }

  private async getLastSyncTime(tenantId: string, entityType: EntityType): Promise<number | null> {
    const { data, error } = await supabase
      .from('wbuy_sync_status')
      .select('last_sync_at')
      .eq('tenant_id', tenantId)
      .eq('entity_type', entityType)
      .single();

    if (error) {
      logger.error('Erro ao buscar último sync:', error);
      return null;
    }

    return data?.last_sync_at ? new Date(data.last_sync_at).getTime() : null;
  }

  private async updateLastSyncTime(tenantId: string, entityType: EntityType, timestamp: number) {
    const { error } = await supabase
      .from('wbuy_sync_status')
      .upsert({
        tenant_id: tenantId,
        entity_type: entityType,
        last_sync_at: new Date(timestamp).toISOString(),
        status: 'success',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      logger.error('Erro ao atualizar último sync:', error);
    }
  }

  public async syncProducts(tenantId: string) {
    try {
      await this.updateSyncStatus(tenantId, 'products', 'syncing');
      
      const products = await this.wbuyService.getProducts();
      
      for (const product of products.data) {
        const { error } = await supabase
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
            last_sync_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {
          logger.error('Erro ao sincronizar produto:', error);
        }
      }

      await this.updateSyncStatus(tenantId, 'products', 'success');
    } catch (error: unknown) {
      await this.updateSyncStatus(tenantId, 'products', 'error', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  public async syncOrders(tenantId: string) {
    try {
      await this.updateSyncStatus(tenantId, 'orders', 'syncing');
      
      const orders = await this.wbuyService.getOrders();
      
      for (const order of orders.data) {
        const { error } = await supabase
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
            last_sync_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {
          logger.error('Erro ao sincronizar pedido:', error);
        }
      }

      await this.updateSyncStatus(tenantId, 'orders', 'success');
    } catch (error: unknown) {
      await this.updateSyncStatus(tenantId, 'orders', 'error', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  public async syncCustomers(tenantId: string) {
    try {
      await this.updateSyncStatus(tenantId, 'customers', 'syncing');
      
      const customers = await this.wbuyService.getCustomers();
      
      for (const customer of customers.data) {
        const { error } = await supabase
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
            last_sync_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {
          logger.error('Erro ao sincronizar cliente:', error);
        }
      }

      await this.updateSyncStatus(tenantId, 'customers', 'success');
    } catch (error: unknown) {
      await this.updateSyncStatus(tenantId, 'customers', 'error', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  public async syncStats(tenantId: string) {
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
      await this.updateSyncStatus(tenantId, 'stats', 'error', error instanceof Error ? error.message : 'Erro desconhecido');
      throw error;
    }
  }

  private async updateSyncStatus(tenantId: string, entityType: EntityType, status: SyncStatus, error?: string) {
    const { error: updateError } = await supabase
      .from('wbuy_sync_status')
      .upsert({
        tenant_id: tenantId,
        entity_type: entityType,
        status,
        error,
        last_sync_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (updateError) {
      logger.error('Erro ao atualizar status de sincronização:', updateError);
    }
  }

  private async scheduleRetry(tenantId: string, entityType: EntityType, retryCount: number) {
    this.syncQueue.push(
      { tenantId, entityType, timestamp: Date.now(), retryCount }
    );
  }

  private async handleSyncFailure(tenantId: string, entityType: EntityType, error: unknown) {
    await this.updateSyncStatus(
      tenantId,
      entityType,
      'error',
      error instanceof Error ? error.message : 'Erro desconhecido'
    );
    await this.notifyAdmins(tenantId, entityType, error);
  }

  private async notifyAdmins(tenantId: string, entityType: EntityType, error: unknown) {
    // Implementar notificação para administradores
    logger.error(`Falha crítica na sincronização de ${entityType} para o tenant ${tenantId}:`, error);
  }

  public async startRealtimeSync(tenantId: string) {
    if (this.isProcessing) {
      logger.warn('Sincronização já em andamento');
      return;
    }

    this.isProcessing = true;

    try {
      // Iniciar sincronização inicial
      this.syncQueue.push(
        { tenantId, entityType: 'products', timestamp: Date.now(), retryCount: 0 }
      );
      this.syncQueue.push(
        { tenantId, entityType: 'orders', timestamp: Date.now(), retryCount: 0 }
      );
      this.syncQueue.push(
        { tenantId, entityType: 'customers', timestamp: Date.now(), retryCount: 0 }
      );
      this.syncQueue.push(
        { tenantId, entityType: 'stats', timestamp: Date.now(), retryCount: 0 }
      );

      // Configurar sincronização periódica
      setInterval(() => {
        this.syncQueue.push(
          { tenantId, entityType: 'stats', timestamp: Date.now(), retryCount: 0 }
        );
      }, 60000); // Atualizar estatísticas a cada minuto

    } catch (error) {
      logger.error('Erro ao iniciar sincronização em tempo real:', error);
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  public async stopRealtimeSync() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
    this.syncQueue = [];
  }
} 