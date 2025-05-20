import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

declare global {
  namespace Express {
    interface Request extends ExpressRequest {
      tenantId?: string;
    }
    interface Response extends ExpressResponse {}
  }
}

export interface WebhookRequest {
  type: 'order.created' | 'order.updated' | 'product.updated' | 'customer.updated';
  payload: any;
}

export interface WebhookResponse {
  message: string;
  error?: string;
} 