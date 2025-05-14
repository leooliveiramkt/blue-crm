
import { useState } from 'react';
import { wbuyApiService } from '@/services/wbuy-api';
import { useToast } from './use-toast';
import { integrationManager } from '@/lib/integrations/integrationManager';

export const useWbuyApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Verifica se a integração com a Wbuy está configurada
   */
  const checkIntegration = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const integration = await integrationManager.getIntegration('wbuy');
      const isConfigured = integration !== null && integration.status === 'connected';
      
      if (!isConfigured) {
        setError('Integração com Wbuy não configurada ou desconectada');
        toast({
          title: "Configuração necessária",
          description: "Integração com Wbuy não está configurada. Acesse as configurações de integração.",
          variant: "destructive"
        });
      }
      
      return isConfigured;
    } catch (err: any) {
      setError(err.message || 'Erro ao verificar integração com Wbuy');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ====== PRODUTOS ======

  /**
   * Busca lista de produtos com paginação e filtros opcionais
   */
  const getProducts = async (page = 1, limit = 20, filters?: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getProducts(page, limit, filters);
      return data;
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
      setError('ID do produto não informado');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getProductDetails(productId);
      return data;
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
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getCategories();
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar categorias');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ====== PEDIDOS ======

  /**
   * Busca dados de um pedido específico
   */
  const getOrderData = async (orderCode: string) => {
    if (!orderCode.trim()) {
      setError('Código do pedido não informado');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getOrderData(orderCode);
      return data;
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
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getOrders(page, limit, filters);
      return data;
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
      setError('Dados do pedido não informados');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.createOrder(orderData);
      
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
      setError('Dados do pedido incompletos');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.updateOrder(orderId, orderData);
      
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

  // ====== AFILIADOS ======

  /**
   * Busca lista de afiliados
   */
  const getAffiliates = async (searchTerm?: string, page = 1, limit = 20, filters?: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getAffiliates(searchTerm, page, limit, filters);
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar afiliados');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca detalhes de um afiliado específico
   */
  const getAffiliateDetails = async (affiliateId: string) => {
    if (!affiliateId) {
      setError('ID do afiliado não informado');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getAffiliateDetails(affiliateId);
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar detalhes do afiliado');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cria um novo afiliado
   */
  const createAffiliate = async (affiliateData: any) => {
    if (!affiliateData) {
      setError('Dados do afiliado não informados');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.createAffiliate(affiliateData);
      
      if (data) {
        toast({
          title: "Afiliado criado",
          description: "Afiliado criado com sucesso"
        });
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao criar afiliado');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Atualiza um afiliado existente
   */
  const updateAffiliate = async (affiliateId: string, affiliateData: any) => {
    if (!affiliateId || !affiliateData) {
      setError('Dados do afiliado incompletos');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.updateAffiliate(affiliateId, affiliateData);
      
      if (data) {
        toast({
          title: "Afiliado atualizado",
          description: "Afiliado atualizado com sucesso"
        });
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao atualizar afiliado');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Atualiza atributo de um afiliado
   */
  const updateAffiliateAttribute = async (affiliateId: string, attributeName: string, attributeValue: string) => {
    if (!affiliateId || !attributeName) {
      setError('Dados incompletos para atualização');
      return false;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return false;
      }
      
      const result = await wbuyApiService.updateAffiliateAttribute(
        affiliateId, 
        attributeName, 
        attributeValue
      );
      
      if (result) {
        toast({
          title: "Atualização concluída",
          description: `Atributo ${attributeName} atualizado com sucesso.`
        });
        return true;
      } else {
        setError('Falha na atualização do atributo');
        return false;
      }
    } catch (err: any) {
      handleError(err, 'Erro ao atualizar atributo');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca comissões de um afiliado
   */
  const getAffiliateCommissions = async (affiliateId: string, startDate?: string, endDate?: string) => {
    if (!affiliateId) {
      setError('ID do afiliado não informado');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getAffiliateCommissions(affiliateId, startDate, endDate);
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar comissões do afiliado');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ====== LEADS ======

  /**
   * Busca lista de leads com paginação e filtros opcionais
   */
  const getLeads = async (page = 1, limit = 20, filters?: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getLeads(page, limit, filters);
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar leads');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca detalhes de um lead específico
   */
  const getLeadDetails = async (leadId: string) => {
    if (!leadId) {
      setError('ID do lead não informado');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getLeadDetails(leadId);
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar detalhes do lead');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cria um novo lead
   */
  const createLead = async (leadData: any) => {
    if (!leadData) {
      setError('Dados do lead não informados');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.createLead(leadData);
      
      if (data) {
        toast({
          title: "Lead criado",
          description: "Lead criado com sucesso"
        });
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao criar lead');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Atualiza um lead existente
   */
  const updateLead = async (leadId: string, leadData: any) => {
    if (!leadId || !leadData) {
      setError('Dados do lead incompletos');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.updateLead(leadId, leadData);
      
      if (data) {
        toast({
          title: "Lead atualizado",
          description: "Lead atualizado com sucesso"
        });
      }
      
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao atualizar lead');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ====== USUÁRIOS ======

  /**
   * Busca lista de usuários
   */
  const getUsers = async (page = 1, limit = 20) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getUsers(page, limit);
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar usuários');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca detalhes de um usuário específico
   */
  const getUserDetails = async (userId: string) => {
    if (!userId) {
      setError('ID do usuário não informado');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getUserDetails(userId);
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar detalhes do usuário');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ====== RELATÓRIOS ======

  /**
   * Busca relatório de vendas
   */
  const getSalesReport = async (startDate: string, endDate: string, filters?: Record<string, any>) => {
    if (!startDate || !endDate) {
      setError('Datas não informadas');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getSalesReport(startDate, endDate, filters);
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar relatório de vendas');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca relatório de afiliados
   */
  const getAffiliatesReport = async (startDate: string, endDate: string, filters?: Record<string, any>) => {
    if (!startDate || !endDate) {
      setError('Datas não informadas');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getAffiliatesReport(startDate, endDate, filters);
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar relatório de afiliados');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ====== CONFIGURAÇÕES ======

  /**
   * Busca configurações do sistema
   */
  const getSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getSettings();
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar configurações');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ====== NOTIFICAÇÕES ======

  /**
   * Busca notificações
   */
  const getNotifications = async (page = 1, limit = 20) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyApiService.getNotifications(page, limit);
      return data;
    } catch (err: any) {
      handleError(err, 'Erro ao buscar notificações');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para tratamento de erros
  const handleError = (err: any, defaultMessage: string) => {
    const errorMessage = err.message || defaultMessage;
    setError(errorMessage);
    toast({
      title: "Erro na requisição",
      description: errorMessage,
      variant: "destructive"
    });
  };

  return {
    isLoading,
    error,
    // Integração
    checkIntegration,
    // Produtos
    getProducts,
    getProductDetails,
    getCategories,
    // Pedidos
    getOrderData,
    getOrders,
    createOrder,
    updateOrder,
    // Afiliados
    getAffiliates,
    getAffiliateDetails,
    createAffiliate,
    updateAffiliate,
    updateAffiliateAttribute,
    getAffiliateCommissions,
    // Leads
    getLeads,
    getLeadDetails,
    createLead,
    updateLead,
    // Usuários
    getUsers,
    getUserDetails,
    // Relatórios
    getSalesReport,
    getAffiliatesReport,
    // Configurações
    getSettings,
    // Notificações
    getNotifications
  };
};
