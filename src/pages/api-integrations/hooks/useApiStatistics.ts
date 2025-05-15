
import { useState, useEffect } from 'react';
import { IntegrationType } from '@/lib/integrations/types';
import { useToast } from '@/hooks/use-toast';
import { useCurrentTenantId } from '@/hooks/useTenant';

export interface ApiCallStat {
  integrationId: IntegrationType;
  totalCalls: number;
  successRate: number;
  lastCall: string | null;
  avgResponseTime: number;
}

export const useApiStatistics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ApiCallStat[]>([]);
  const { toast } = useToast();
  const tenantId = useCurrentTenantId();

  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      // Em um ambiente real, buscaríamos estes dados do banco de dados
      // Por enquanto, vamos simular dados para demonstração
      const mockStats: ApiCallStat[] = [
        { 
          integrationId: 'wbuy', 
          totalCalls: 128, 
          successRate: 98.4, 
          lastCall: new Date(Date.now() - 3 * 60000).toISOString(), 
          avgResponseTime: 345 
        },
        { 
          integrationId: 'facebook', 
          totalCalls: 56, 
          successRate: 100, 
          lastCall: new Date(Date.now() - 15 * 60000).toISOString(),
          avgResponseTime: 520 
        },
        { 
          integrationId: 'activecampaign', 
          totalCalls: 89, 
          successRate: 95.5, 
          lastCall: new Date(Date.now() - 8 * 60000).toISOString(),
          avgResponseTime: 280 
        },
        { 
          integrationId: 'google', 
          totalCalls: 32, 
          successRate: 100, 
          lastCall: new Date(Date.now() - 45 * 60000).toISOString(),
          avgResponseTime: 410 
        },
        { 
          integrationId: 'stape', 
          totalCalls: 17, 
          successRate: 94.1, 
          lastCall: new Date(Date.now() - 120 * 60000).toISOString(),
          avgResponseTime: 390 
        }
      ];

      // Filtrar apenas as integrações que estão sendo usadas neste tenant
      const filteredStats = tenantId ? mockStats : [];
      
      setStats(filteredStats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas de API:', error);
      toast({
        title: 'Erro ao carregar estatísticas',
        description: 'Não foi possível carregar as estatísticas de chamadas de API.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    
    // Atualiza as estatísticas a cada 5 minutos
    const interval = setInterval(fetchStatistics, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [tenantId]);

  return {
    stats,
    isLoading,
    refreshStats: fetchStatistics
  };
};
