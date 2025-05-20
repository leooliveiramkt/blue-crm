import Queue from 'bull';
import { redis } from './redis';
import { logger } from '@/utils/logger';

const bullConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
};

const createQueue = (name: string) => {
  const queue = new Queue(name, bullConfig);

  queue.on('error', (error: Error) => {
    logger.error(`Erro na fila ${name}:`, error);
  });

  queue.on('failed', (job: Queue.Job, error: Error) => {
    logger.error(`Job ${job.id} falhou na fila ${name}:`, error);
  });

  queue.on('completed', (job: Queue.Job) => {
    logger.info(`Job ${job.id} completado na fila ${name}`);
  });

  return queue;
};

export const wbuySyncQueue = createQueue('wbuy-sync');
export const wbuyStatsQueue = createQueue('wbuy-stats');
export const wbuyWebhookQueue = createQueue('wbuy-webhook'); 