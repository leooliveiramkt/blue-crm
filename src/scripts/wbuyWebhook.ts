import express from 'express';
import { wbuyWebhookQueue } from '../config/bull.prod';
import { WBuyService } from '../services/wbuy/wbuyService';
import { logger } from '../utils/logger';

const app = express();
app.use(express.json());

// Process webhook queue
wbuyWebhookQueue.process(async (job) => {
  const { type, payload, tenantId } = job.data;
  const wbuyService = new WBuyService(tenantId);

  try {
    switch (type) {
      case 'order.created':
        await wbuyService.handleOrderCreated(payload);
        break;
      case 'order.updated':
        await wbuyService.handleOrderUpdated(payload);
        break;
      case 'product.updated':
        await wbuyService.handleProductUpdated(payload);
        break;
      case 'customer.updated':
        await wbuyService.handleCustomerUpdated(payload);
        break;
      default:
        logger.warn(`Unknown webhook type: ${type}`);
    }

    logger.info(`Webhook ${type} processed successfully for tenant ${tenantId}`);
  } catch (error) {
    logger.error(`Error processing webhook ${type} for tenant ${tenantId}:`, error);
    throw error;
  }
});

// Webhook endpoint
app.post('/webhook/:tenantId', async (req, res) => {
  const { tenantId } = req.params;
  const { type, payload } = req.body;

  try {
    await wbuyWebhookQueue.add({
      type,
      payload,
      tenantId
    });

    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    logger.error(`Error adding webhook to queue for tenant ${tenantId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Webhook server listening on port ${PORT}`);
});

// Handle process termination
process.on('SIGTERM', async () => {
  logger.info('Shutting down webhook server...');
  await wbuyWebhookQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Shutting down webhook server...');
  await wbuyWebhookQueue.close();
  process.exit(0);
}); 