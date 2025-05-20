import Redis from 'ioredis';
import { logger } from '@/utils/logger';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

const redis = new Redis(redisConfig);

redis.on('error', (error) => {
  logger.error('Erro na conexão com Redis:', error);
});

redis.on('connect', () => {
  logger.info('Conectado ao Redis');
});

export { redis }; 