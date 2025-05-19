
import { useState } from 'react';
import { wbuyOrdersService } from '@/services/wbuy';
import { useWbuyIntegration } from './use-integration';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para gerenciar pedidos da Wbuy
 */
export const useWbuyOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkIntegration, handleError } = useWbuyIntegration();
  const { toast } = useToast();

  /**
   * Busca dados de um pedido específico
   */
  const getOrderData = async (orderCode: string) => {
    if (!orderCode.trim()) {
      handleError(new Error('Código do pedido não informado'), 'Erro ao buscar pedido');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyOrdersService.getOrderData(orderCode);
    } catch (err: any) {
      handleError(err, 'Erro ao buscar dados do pedido');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca lista de pedidos com paginação e filtros opcionais
   */
  const getOrders = async (page = 1, limit = 20, filters?: Record<string, any>) => {
    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyOrdersService.getOrders(page, limit, filters);
    } catch (err: any) {
      handleError(err, 'Erro ao buscar pedidos');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cria um novo pedido
   */
  const createOrder = async (orderData: any) => {
    if (!orderData) {
      handleError(new Error('Dados do pedido não informados'), 'Erro ao criar pedido');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyOrdersService.createOrder(orderData);
      
      if (data) {
        toast({
          title: "Pedido criado",
          description: "Pedido criado com sucesso"
        });
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao criar pedido');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Atualiza um pedido existente
   */
  const updateOrder = async (orderId: string, orderData: any) => {
    if (!orderId || !orderData) {
      handleError(new Error('Dados do pedido incompletos'), 'Erro ao atualizar pedido');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyOrdersService.updateOrder(orderId, orderData);
      
      if (data) {
        toast({
          title: "Pedido atualizado",
          description: "Pedido atualizado com sucesso"
        });
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao atualizar pedido');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getOrderData,
    getOrders,
    createOrder,
    updateOrder
  };
};
