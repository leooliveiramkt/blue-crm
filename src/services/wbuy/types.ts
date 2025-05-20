export interface WBuyConfig {
  apiUrl: string;
  apiKey: string;
}

export interface WBuyProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: string;
  category?: string;
  images: string[];
  metadata?: Record<string, any>;
}

export interface WBuyOrder {
  id: string;
  customerId: string;
  status: string;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  metadata?: Record<string, any>;
}

export interface WBuyCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  metadata?: Record<string, any>;
}

export interface WBuyAffiliate {
  id: string;
  name: string;
  email: string;
  status: string;
  commission_rate: number;
  created_at: string;
  updated_at: string;
}

export interface WBuyShipping {
  id: string;
  order_id: string;
  status: string;
  tracking_code: string | null;
  carrier: string;
  created_at: string;
  updated_at: string;
}

export interface WBuyMarketing {
  id: string;
  name: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface WBuyStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  topProducts: {
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  customerAcquisition: {
    date: string;
    count: number;
  }[];
  metadata?: Record<string, any>;
}

export interface WBuyWebhook {
  type: 'order.created' | 'order.updated' | 'product.updated' | 'customer.updated';
  payload: WBuyOrder | WBuyProduct | WBuyCustomer;
}

export interface CompanyWBuyConfig {
  baseURL: string;
  apiKey: string;
  storeId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
} 