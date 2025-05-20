import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { WBuyService } from '@/services/wbuy/wbuyService';
import { WBuySyncScheduler } from '@/services/wbuy/wbuySyncScheduler';

export function useWBuyIntegration(tenantId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        
        // Busca configuração
        const { data: configData, error: configError } = await supabase
          .from('tenant_api_configs')
          .select('*')
          .eq('tenant_id', tenantId)
          .eq('provider', 'wbuy')
          .single();

        if (configError) throw configError;
        
        if (!configData) {
          setIsConnected(false);
          setConfig(null);
          return;
        }

        setConfig(configData);

        // Inicializa serviço
        const wbuyService = WBuyService.getInstance();
        await wbuyService.initialize(tenantId);

        // Testa conexão
        const testResult = await wbuyService.testConnection();
        setIsConnected(testResult.success);

        if (testResult.success) {
          // Inicia sincronização
          const scheduler = WBuySyncScheduler.getInstance();
          scheduler.startSync(tenantId);
        } else {
          setError(testResult.error);
        }
      } catch (err) {
        setError(err.message);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [tenantId]);

  const updateConfig = async (newConfig: any) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('tenant_api_configs')
        .upsert({
          tenant_id: tenantId,
          provider: 'wbuy',
          ...newConfig
        });

      if (error) throw error;

      setConfig(newConfig);
      
      // Reinicializa serviço com nova configuração
      const wbuyService = WBuyService.getInstance();
      await wbuyService.initialize(tenantId);

      // Testa conexão
      const testResult = await wbuyService.testConnection();
      setIsConnected(testResult.success);

      if (testResult.success) {
        // Reinicia sincronização
        const scheduler = WBuySyncScheduler.getInstance();
        scheduler.startSync(tenantId);
      } else {
        setError(testResult.error);
      }
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    error,
    config,
    updateConfig
  };
} 