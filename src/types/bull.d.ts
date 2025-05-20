import { Job } from 'bull';

export interface SyncJobData {
  type: 'products' | 'orders' | 'customers' | 'stats';
  tenantId: string;
  data?: any;
}

export interface StatsJobData {
  tenantId: string;
}

export interface WebhookJobData {
  type: 'order.created' | 'order.updated' | 'product.updated' | 'customer.updated';
  tenantId: string;
  payload: any;
}

export type SyncJob = Job<SyncJobData>;
export type StatsJob = Job<StatsJobData>;
export type WebhookJob = Job<WebhookJobData>; 