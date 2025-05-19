
import { useState } from 'react';
import { wbuyReportsService } from '@/services/wbuy';
import { useWbuyIntegration } from './use-integration';

/**
 * Hook para gerenciar relatórios da Wbuy
 */
export const useWbuyReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkIntegration, handleError } = useWbuyIntegration();

  /**
   * Busca relatório de vendas
   */
  const getSalesReport = async (startDate: string, endDate: string, filters?: Record<string, any>) => {
    if (!startDate || !endDate) {
      handleError(new Error('Datas não informadas'), 'Erro ao buscar relatório');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyReportsService.getSalesReport(startDate, endDate, filters);
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
      handleError(new Error('Datas não informadas'), 'Erro ao buscar relatório');
      return null;
    }

    setIsLoading(true);
    
    try {
      const isConfigured = await checkIntegration();
      
      if (!isConfigured) {
        return null;
      }
      
      return await wbuyReportsService.getAffiliatesReport(startDate, endDate, filters);
    } catch (err: any) {
      handleError(err, 'Erro ao buscar relatório de afiliados');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getSalesReport,
    getAffiliatesReport
  };
};
