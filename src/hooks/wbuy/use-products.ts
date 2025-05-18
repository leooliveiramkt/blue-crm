
import { useState } from 'react';
import { wbuyProductsService } from '@/services/wbuy';
import { useWbuyIntegration } from './use-integration';

/**
 * Hook para gerenciar produtos da Wbuy
 */
export const useWbuyProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkIntegration, handleError } = useWbuyIntegration();

  /**
   * Busca lista de produtos com paginação e filtros opcionais
   */
  const getProducts = async (page = 1, limit = 20, filters?: Record<string, any>) => {
    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyProductsService.getProducts(page, limit, filters);
    } catch (err: any) {
      handleError(err, 'Erro ao buscar produtos');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca detalhes de um produto específico
   */
  const getProductDetails = async (productId: string) => {
    if (!productId) {
      handleError(new Error('ID do produto não informado'), 'Erro ao buscar produto');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyProductsService.getProductDetails(productId);
    } catch (err: any) {
      handleError(err, 'Erro ao buscar detalhes do produto');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca categorias de produtos
   */
  const getCategories = async () => {
    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyProductsService.getCategories();
    } catch (err: any) {
      handleError(err, 'Erro ao buscar categorias');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getProducts,
    getProductDetails,
    getCategories
  };
};
