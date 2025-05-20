import Redis from 'ioredis';
import { logger } from '../utils/logger';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  connectTimeout: 10000,
  keepAlive: 30000,
  family: 4,
  db: 0
};

const redis = new Redis(redisConfig);

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('ready', () => {
  logger.info('Redis client ready');
});

redis.on('reconnecting', () => {
  logger.warn('Redis client reconnecting');
});

redis.on('end', () => {
  logger.warn('Redis client connection closed');
});

export default redis; 