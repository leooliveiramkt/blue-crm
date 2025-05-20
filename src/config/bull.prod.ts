import Queue from 'bull';
import redis from './redis.prod';
import { logger } from '../utils/logger';

const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000
  },
  removeOnComplete: true,
  removeOnFail: false
};

const createQueue = (name: string) => {
  const queue = new Queue(name, {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    },
    defaultJobOptions
  });

  queue.on('error', (error) => {
    logger.error(`Queue ${name} error:`, error);
  });

  queue.on('failed', (job, error) => {
    logger.error(`Job ${job.id} in queue ${name} failed:`, error);
  });

  queue.on('completed', (job) => {
    logger.info(`Job ${job.id} in queue ${name} completed`);
  });

  queue.on('stalled', (job) => {
    logger.warn(`Job ${job.id} in queue ${name} stalled`);
  });

  return queue;
};

// Create queues
export const wbuySyncQueue = createQueue('wbuy-sync');
export const wbuyStatsQueue = createQueue('wbuy-stats');
export const wbuyWebhookQueue = createQueue('wbuy-webhook');

// Process queues
wbuySyncQueue.process(async (job) => {
  const { type, data } = job.data;
  logger.info(`Processing sync job ${job.id} of type ${type}`);
  // Process sync job
});

wbuyStatsQueue.process(async (job) => {
  const { tenantId } = job.data;
  logger.info(`Processing stats job ${job.id} for tenant ${tenantId}`);
  // Process stats job
});

wbuyWebhookQueue.process(async (job) => {
  const { type, payload } = job.data;
  logger.info(`Processing webhook job ${job.id} of type ${type}`);
  // Process webhook job
}); 