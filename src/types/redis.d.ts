import { Redis } from 'ioredis';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  retryStrategy?: (times: number) => number | null;
  maxRetriesPerRequest?: number;
  enableReadyCheck?: boolean;
  connectTimeout?: number;
  keepAlive?: number;
  family?: number;
  db?: number;
}

export interface RedisClient extends Redis {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<'OK'>;
  del(key: string): Promise<number>;
  exists(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  scan(cursor: number, pattern: string, count?: number): Promise<[string, string[]]>;
  hget(key: string, field: string): Promise<string | null>;
  hset(key: string, field: string, value: string): Promise<number>;
  hdel(key: string, field: string): Promise<number>;
  hgetall(key: string): Promise<Record<string, string>>;
  hscan(key: string, cursor: number, pattern: string, count?: number): Promise<[string, string[]]>;
  lpush(key: string, value: string): Promise<number>;
  rpush(key: string, value: string): Promise<number>;
  lpop(key: string): Promise<string | null>;
  rpop(key: string): Promise<string | null>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  llen(key: string): Promise<number>;
  sadd(key: string, member: string): Promise<number>;
  srem(key: string, member: string): Promise<number>;
  smembers(key: string): Promise<string[]>;
  sismember(key: string, member: string): Promise<number>;
  zadd(key: string, score: number, member: string): Promise<number>;
  zrem(key: string, member: string): Promise<number>;
  zrange(key: string, start: number, stop: number, withScores?: boolean): Promise<string[]>;
  zcard(key: string): Promise<number>;
  publish(channel: string, message: string): Promise<number>;
  subscribe(channel: string): Promise<number>;
  psubscribe(pattern: string): Promise<number>;
  unsubscribe(channel: string): Promise<number>;
  punsubscribe(pattern: string): Promise<number>;
  on(event: string, listener: (...args: any[]) => void): this;
  once(event: string, listener: (...args: any[]) => void): this;
  removeListener(event: string, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string): this;
  quit(): Promise<'OK'>;
  disconnect(): void;
} 