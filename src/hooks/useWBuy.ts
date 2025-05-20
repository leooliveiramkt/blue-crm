import { useState, useCallback } from 'react';
import { WBuyService } from '../services/wbuy/wbuyService';
import { wbuyConfig } from '../config/wbuy';
import { WBuyProduct, WBuyOrder, WBuyCustomer, WBuyAffiliate, WBuyShipping, WBuyMarketing, WBuyAnalytics } from '../services/wbuy/types';

const wbuyService = new WBuyService(wbuyConfig);

export function useWBuy() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleRequest = useCallback(async <T>(request: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await request();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Produtos
  const getProducts = useCallback(async (params?: { page?: number; limit?: number; category?: string; status?: string }) => {
    return handleRequest(() => wbuyService.getProducts(params));
  }, [handleRequest]);

  const getProduct = useCallback(async (id: string) => {
    return handleRequest(() => wbuyService.getProduct(id));
  }, [handleRequest]);

  const createProduct = useCallback(async (product: Omit<WBuyProduct, 'id' | 'created_at' | 'updated_at'>) => {
    return handleRequest(() => wbuyService.createProduct(product));
  }, [handleRequest]);

  const updateProduct = useCallback(async (id: string, product: Partial<WBuyProduct>) => {
    return handleRequest(() => wbuyService.updateProduct(id, product));
  }, [handleRequest]);

  const deleteProduct = useCallback(async (id: string) => {
    return handleRequest(() => wbuyService.deleteProduct(id));
  }, [handleRequest]);

  // Pedidos
  const getOrders = useCallback(async (params?: { page?: number; limit?: number; status?: string; start_date?: string; end_date?: string }) => {
    return handleRequest(() => wbuyService.getOrders(params));
  }, [handleRequest]);

  const getOrder = useCallback(async (id: string) => {
    return handleRequest(() => wbuyService.getOrder(id));
  }, [handleRequest]);

  const updateOrderStatus = useCallback(async (id: string, status: WBuyOrder['status']) => {
    return handleRequest(() => wbuyService.updateOrderStatus(id, status));
  }, [handleRequest]);

  // Clientes
  const getCustomers = useCallback(async (params?: { page?: number; limit?: number; search?: string }) => {
    return handleRequest(() => wbuyService.getCustomers(params));
  }, [handleRequest]);

  const getCustomer = useCallback(async (id: string) => {
    return handleRequest(() => wbuyService.getCustomer(id));
  }, [handleRequest]);

  const createCustomer = useCallback(async (customer: Omit<WBuyCustomer, 'id' | 'created_at' | 'updated_at'>) => {
    return handleRequest(() => wbuyService.createCustomer(customer));
  }, [handleRequest]);

  const updateCustomer = useCallback(async (id: string, customer: Partial<WBuyCustomer>) => {
    return handleRequest(() => wbuyService.updateCustomer(id, customer));
  }, [handleRequest]);

  // Afiliados
  const getAffiliates = useCallback(async (params?: { page?: number; limit?: number; status?: string }) => {
    return handleRequest(() => wbuyService.getAffiliates(params));
  }, [handleRequest]);

  const getAffiliate = useCallback(async (id: string) => {
    return handleRequest(() => wbuyService.getAffiliate(id));
  }, [handleRequest]);

  const createAffiliate = useCallback(async (affiliate: Omit<WBuyAffiliate, 'id' | 'created_at' | 'updated_at'>) => {
    return handleRequest(() => wbuyService.createAffiliate(affiliate));
  }, [handleRequest]);

  const updateAffiliate = useCallback(async (id: string, affiliate: Partial<WBuyAffiliate>) => {
    return handleRequest(() => wbuyService.updateAffiliate(id, affiliate));
  }, [handleRequest]);

  // Envios
  const getShippings = useCallback(async (params?: { page?: number; limit?: number; status?: string; order_id?: string }) => {
    return handleRequest(() => wbuyService.getShippings(params));
  }, [handleRequest]);

  const getShipping = useCallback(async (id: string) => {
    return handleRequest(() => wbuyService.getShipping(id));
  }, [handleRequest]);

  const createShipping = useCallback(async (shipping: Omit<WBuyShipping, 'id' | 'created_at' | 'updated_at'>) => {
    return handleRequest(() => wbuyService.createShipping(shipping));
  }, [handleRequest]);

  const updateShippingStatus = useCallback(async (id: string, status: WBuyShipping['status']) => {
    return handleRequest(() => wbuyService.updateShippingStatus(id, status));
  }, [handleRequest]);

  // Marketing
  const getMarketingCampaigns = useCallback(async (params?: { page?: number; limit?: number; status?: string; type?: string }) => {
    return handleRequest(() => wbuyService.getMarketingCampaigns(params));
  }, [handleRequest]);

  const getMarketingCampaign = useCallback(async (id: string) => {
    return handleRequest(() => wbuyService.getMarketingCampaign(id));
  }, [handleRequest]);

  const createMarketingCampaign = useCallback(async (campaign: Omit<WBuyMarketing, 'id' | 'created_at' | 'updated_at'>) => {
    return handleRequest(() => wbuyService.createMarketingCampaign(campaign));
  }, [handleRequest]);

  const updateMarketingCampaign = useCallback(async (id: string, campaign: Partial<WBuyMarketing>) => {
    return handleRequest(() => wbuyService.updateMarketingCampaign(id, campaign));
  }, [handleRequest]);

  // Analytics
  const getAnalytics = useCallback(async (params: { start_date: string; end_date: string; metrics?: string[] }) => {
    return handleRequest(() => wbuyService.getAnalytics(params));
  }, [handleRequest]);

  const getTopProducts = useCallback(async (params: { start_date: string; end_date: string; limit?: number }) => {
    return handleRequest(() => wbuyService.getTopProducts(params));
  }, [handleRequest]);

  const getCustomerAcquisition = useCallback(async (params: { start_date: string; end_date: string }) => {
    return handleRequest(() => wbuyService.getCustomerAcquisition(params));
  }, [handleRequest]);

  return {
    loading,
    error,
    // Produtos
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    // Pedidos
    getOrders,
    getOrder,
    updateOrderStatus,
    // Clientes
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    // Afiliados
    getAffiliates,
    getAffiliate,
    createAffiliate,
    updateAffiliate,
    // Envios
    getShippings,
    getShipping,
    createShipping,
    updateShippingStatus,
    // Marketing
    getMarketingCampaigns,
    getMarketingCampaign,
    createMarketingCampaign,
    updateMarketingCampaign,
    // Analytics
    getAnalytics,
    getTopProducts,
    getCustomerAcquisition
  };
} 