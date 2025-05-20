import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Integration, IntegrationType, IntegrationCredentials } from '@/lib/integrations/types';
import { getIntegrationConfig } from '@/lib/integrations/configs';

export const useIntegration = (integrationId: IntegrationType) => {
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const config = getIntegrationConfig(integrationId);

  useEffect(() => {
    loadIntegration();
  }, [integrationId]);

  const loadIntegration = async () => {
    try {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        console.error('Usuário não autenticado');
        return;
      }

      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('integration_id', integrationId)
        .single();

      if (error) {
        console.error('Erro ao carregar integração:', error);
        return;
      }

      setIntegration(data);
    } catch (error) {
      console.error('Erro ao carregar integração:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectIntegration = async (credentials: IntegrationCredentials): Promise<boolean> => {
    try {
      setIsConnecting(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        console.error('Usuário não autenticado');
        return false;
      }

      // Verificar se a integração já existe
      const { data: existingIntegration } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('integration_id', integrationId)
        .single();

      if (existingIntegration) {
        // Atualizar integração existente
        const { error } = await supabase
          .from('integrations')
          .update({
            credentials,
            status: 'connected',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingIntegration.id);

        if (error) {
          console.error('Erro ao atualizar integração:', error);
          return false;
        }
      } else {
        // Criar nova integração
        const { error } = await supabase
          .from('integrations')
          .insert({
            user_id: user.user.id,
            integration_id: integrationId,
            credentials,
            status: 'connected',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Erro ao criar integração:', error);
          return false;
        }
      }

      await loadIntegration();
      return true;
    } catch (error) {
      console.error('Erro ao conectar integração:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectIntegration = async (): Promise<boolean> => {
    try {
      if (!integration) return false;

      const { error } = await supabase
        .from('integrations')
        .update({
          status: 'disconnected',
          updated_at: new Date().toISOString()
        })
        .eq('id', integration.id);

      if (error) {
        console.error('Erro ao desconectar integração:', error);
        return false;
      }

      await loadIntegration();
      return true;
    } catch (error) {
      console.error('Erro ao desconectar integração:', error);
      return false;
    }
  };

  const refreshIntegration = async () => {
    await loadIntegration();
  };

  return {
    integration,
    config,
    isLoading,
    isConnecting,
    isConnected: integration?.status === 'connected',
    connectIntegration,
    disconnectIntegration,
    refreshIntegration
  };
}; 