import { wbuyStatsQueue } from '../config/bull.prod';
import { WBuyService } from '../services/wbuy/wbuyService';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

async function syncStats(tenantId: string) {
  try {
    const wbuyService = new WBuyService(tenantId);
    const stats = await wbuyService.getStats();

    const { error } = await supabase
      .from('wbuy_stats')
      .upsert({
        tenant_id: tenantId,
        date: new Date().toISOString().split('T')[0],
        total_sales: stats.totalSales,
        total_orders: stats.totalOrders,
        total_customers: stats.totalCustomers,
        top_products: stats.topProducts,
        customer_acquisition: stats.customerAcquisition,
        metadata: stats.metadata,
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    logger.info(`Stats synced successfully for tenant ${tenantId}`);
  } catch (error) {
    logger.error(`Error syncing stats for tenant ${tenantId}:`, error);
    throw error;
  }
}

// Process stats queue
wbuyStatsQueue.process(async (job) => {
  const { tenantId } = job.data;
  await syncStats(tenantId);
});

// Start queue processing
logger.info('Starting WBuy stats sync service...');

// Handle process termination
process.on('SIGTERM', async () => {
  logger.info('Shutting down WBuy stats sync service...');
  await wbuyStatsQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Shutting down WBuy stats sync service...');
  await wbuyStatsQueue.close();
  process.exit(0);
}); 