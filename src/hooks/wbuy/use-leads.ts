
import { useState } from 'react';
import { wbuyLeadsService } from '@/services/wbuy';
import { useWbuyIntegration } from './use-integration';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para gerenciar leads da Wbuy
 */
export const useWbuyLeads = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkIntegration, handleError } = useWbuyIntegration();
  const { toast } = useToast();

  /**
   * Busca lista de leads com paginação e filtros opcionais
   */
  const getLeads = async (page = 1, limit = 20, filters?: Record<string, any>) => {
    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyLeadsService.getLeads(page, limit, filters);
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
      handleError(new Error('ID do lead não informado'), 'Erro ao buscar lead');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyLeadsService.getLeadDetails(leadId);
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
      handleError(new Error('Dados do lead não informados'), 'Erro ao criar lead');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyLeadsService.createLead(leadData);
      
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
      handleError(new Error('Dados do lead incompletos'), 'Erro ao atualizar lead');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      const data = await wbuyLeadsService.updateLead(leadId, leadData);
      
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

  return {
    isLoading,
    getLeads,
    getLeadDetails,
    createLead,
    updateLead
  };
};
