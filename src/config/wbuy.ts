import { WBuyConfig } from '../services/wbuy/types';

export const wbuyConfig: WBuyConfig = {
  baseURL: import.meta.env.VITE_WBUY_API_URL || 'https://api.wbuy.com.br/v1',
  apiKey: import.meta.env.VITE_WBUY_API_KEY || '',
  storeId: import.meta.env.VITE_WBUY_STORE_ID || ''
};

// Endpoints da API WBuy
export const WBUY_ENDPOINTS = {
  // Produtos
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`
  },
  
  // Pedidos
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`
  },
  
  // Clientes
  CUSTOMERS: {
    LIST: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
    CREATE: '/customers',
    UPDATE: (id: string) => `/customers/${id}`
  },
  
  // Afiliados
  AFFILIATES: {
    LIST: '/affiliates',
    DETAIL: (id: string) => `/affiliates/${id}`,
    CREATE: '/affiliates',
    UPDATE: (id: string) => `/affiliates/${id}`
  },
  
  // Envios
  SHIPPINGS: {
    LIST: '/shippings',
    DETAIL: (id: string) => `/shippings/${id}`,
    CREATE: '/shippings',
    UPDATE_STATUS: (id: string) => `/shippings/${id}/status`
  },
  
  // Marketing
  MARKETING: {
    CAMPAIGNS: {
      LIST: '/marketing/campaigns',
      DETAIL: (id: string) => `/marketing/campaigns/${id}`,
      CREATE: '/marketing/campaigns',
      UPDATE: (id: string) => `/marketing/campaigns/${id}`
    }
  },
  
  // Analytics
  ANALYTICS: {
    GENERAL: '/analytics',
    TOP_PRODUCTS: '/analytics/top-products',
    CUSTOMER_ACQUISITION: '/analytics/customer-acquisition'
  }
};
