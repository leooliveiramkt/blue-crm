
// Este arquivo atua como uma camada de compatibilidade para código existente
// Usa internamente os hooks modulares

import { useState } from 'react';
import { useToast } from './use-toast';
import { integrationManager } from '@/lib/integrations/integrationManager';
import {
  useWbuyProducts,
  useWbuyOrders,
  useWbuyAffiliates,
  useWbuyLeads,
  useWbuyUsers,
  useWbuyReports,
  useWbuySettings
} from './wbuy';

/**
 * Hook para interagir com a API da Wbuy
 * @deprecated Use os hooks específicos em src/hooks/wbuy/
 */
export const useWbuyApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const productsHook = useWbuyProducts();
  const ordersHook = useWbuyOrders();
  const affiliatesHook = useWbuyAffiliates();
  const leadsHook = useWbuyLeads();
  const usersHook = useWbuyUsers();
  const reportsHook = useWbuyReports();
  const settingsHook = useWbuySettings();

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
    getProducts: productsHook.getProducts,
    getProductDetails: productsHook.getProductDetails,
    getCategories: productsHook.getCategories,

    // Pedidos
    getOrderData: ordersHook.getOrderData,
    getOrders: ordersHook.getOrders,
    createOrder: ordersHook.createOrder,
    updateOrder: ordersHook.updateOrder,

    // Afiliados
    getAffiliates: affiliatesHook.getAffiliates,
    getAffiliateDetails: affiliatesHook.getAffiliateDetails,
    createAffiliate: affiliatesHook.createAffiliate,
    updateAffiliate: affiliatesHook.updateAffiliate,
    updateAffiliateAttribute: affiliatesHook.updateAffiliateAttribute,
    getAffiliateCommissions: affiliatesHook.getAffiliateCommissions,

    // Leads
    getLeads: leadsHook.getLeads,
    getLeadDetails: leadsHook.getLeadDetails,
    createLead: leadsHook.createLead,
    updateLead: leadsHook.updateLead,

    // Usuários
    getUsers: usersHook.getUsers,
    getUserDetails: usersHook.getUserDetails,

    // Relatórios
    getSalesReport: reportsHook.getSalesReport,
    getAffiliatesReport: reportsHook.getAffiliatesReport,

    // Configurações
    getSettings: settingsHook.getSettings,

    // Notificações
    getNotifications: settingsHook.getNotifications
  };
};
