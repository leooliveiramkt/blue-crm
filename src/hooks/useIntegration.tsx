
import { useState, useEffect } from 'react';
import { integrationManager } from '@/lib/integrations/integrationManager';
import { IntegrationType, IntegrationData, IntegrationStatus } from '@/lib/integrations/types';
import { useCurrentTenantId } from '@/hooks/useTenant';
import { getIntegrationConfig } from '@/lib/integrations/integrationConfigs';

/**
 * Hook para gerenciar uma integração específica
 */
export const useIntegration = (integrationType: IntegrationType) => {
  const tenantId = useCurrentTenantId();
  const [integration, setIntegration] = useState<IntegrationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const config = getIntegrationConfig(integrationType);

  useEffect(() => {
    loadIntegration();
  }, [tenantId, integrationType]);

  const loadIntegration = async () => {
    setIsLoading(true);
    try {
      console.log(`[useIntegration] Carregando integração ${integrationType} para tenant ${tenantId}`);
      const data = await integrationManager.getIntegration(integrationType, tenantId);
      console.log(`[useIntegration] Integração ${integrationType} carregada:`, data ? 'Dados encontrados' : 'Nenhum dado');
      setIntegration(data);
    } catch (error) {
      console.error(`[useIntegration] Erro ao carregar integração ${integrationType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectIntegration = async (credentials: Record<string, string>): Promise<boolean> => {
    console.log(`[useIntegration] Iniciando conexão para ${integrationType} com tenant ${tenantId}`);
    setIsConnecting(true);
    try {
      // Testa a conexão
      console.log(`[useIntegration] Testando conexão para ${integrationType}...`);
      const isValid = await integrationManager.testConnection(integrationType, credentials);
      console.log(`[useIntegration] Resultado do teste de conexão: ${isValid ? 'Válida' : 'Inválida'}`);
      
      if (!isValid) {
        console.error(`[useIntegration] Credenciais inválidas para ${integrationType}`);
        return false;
      }

      // Se a conexão for válida, salva a integração
      console.log(`[useIntegration] Conexão válida, salvando integração ${integrationType}`);
      const now = new Date().toISOString();
      
      const result = await integrationManager.saveIntegration({
        id: integrationType,
        tenantId,
        status: 'connected',
        credentials,
        updatedAt: now,
        createdAt: integration?.createdAt || now
      });

      if (result) {
        console.log(`[useIntegration] Integração ${integrationType} salva com sucesso`);
        setIntegration(result);
        return true;
      }
      
      console.error(`[useIntegration] Falha ao salvar integração ${integrationType}`);
      return false;
    } catch (error) {
      console.error(`[useIntegration] Erro ao conectar integração ${integrationType}:`, error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectIntegration = async (): Promise<boolean> => {
    if (!integration) return false;
    
    try {
      const result = await integrationManager.updateIntegrationStatus(
        integrationType, 
        'disconnected', 
        tenantId
      );
      
      if (result) {
        await loadIntegration();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Erro ao desconectar integração ${integrationType}:`, error);
      return false;
    }
  };

  const updateCredentials = async (credentials: Record<string, string>): Promise<boolean> => {
    if (!integration) return false;
    
    try {
      // Mescla as credenciais existentes com as novas
      const updatedCredentials = { ...integration.credentials, ...credentials };
      
      const result = await integrationManager.saveIntegration({
        ...integration,
        credentials: updatedCredentials,
        updatedAt: new Date().toISOString()
      });
      
      if (result) {
        setIntegration(result);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Erro ao atualizar credenciais da integração ${integrationType}:`, error);
      return false;
    }
  };

  return {
    integration,
    config,
    isLoading,
    isConnecting,
    isConnected: integration?.status === 'connected',
    connectIntegration,
    disconnectIntegration,
    updateCredentials,
    refreshIntegration: loadIntegration
  };
};

/**
 * Hook para listar todas as integrações disponíveis para o tenant atual
 */
export const useIntegrations = () => {
  const tenantId = useCurrentTenantId();
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIntegrations();
  }, [tenantId]);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      const data = await integrationManager.loadIntegrations(tenantId);
      setIntegrations(data);
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    integrations,
    isLoading,
    refreshIntegrations: loadIntegrations
  };
};
