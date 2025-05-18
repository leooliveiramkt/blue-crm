
import { useState, useEffect } from 'react';
import { IntegrationType } from '@/lib/integrations/types';
import { useIntegrations } from '@/hooks/useIntegration';
import { useToast } from '@/hooks/use-toast';

export const useApiIntegrations = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [apiKeys, setApiKeys] = useState({
    wbuy: '••••••••••••••••',
    facebook: '••••••••••••••••',
    activecampaign: '••••••••••••••••',
    google: '',
    stape: '',
    tiny: '',
    airtable: '',
  });

  const { integrations, isLoading, refreshIntegrations } = useIntegrations();

  // Efeito para atualizar as integrações periodicamente
  useEffect(() => {
    // Carrega as integrações ao montar o componente
    refreshIntegrations();
    
    // Define um intervalo para atualizar as integrações a cada minuto
    const interval = setInterval(() => {
      refreshIntegrations();
    }, 60000); // 60000 ms = 1 minuto
    
    return () => clearInterval(interval);
  }, [refreshIntegrations]);

  const handleConnect = (integrationId: IntegrationType) => {
    toast({
      title: 'Solicitação de conexão',
      description: `Inicializando configuração para ${integrationId.charAt(0).toUpperCase() + integrationId.slice(1)}...`,
    });
  };

  const handleSaveApiKey = (integrationId: IntegrationType, apiKey: string) => {
    setApiKeys({
      ...apiKeys,
      [integrationId]: apiKey,
    });
    
    toast({
      title: 'Chave API Salva',
      description: `A chave API para ${integrationId.charAt(0).toUpperCase() + integrationId.slice(1)} foi salva com sucesso.`,
    });

    // Aviso ao usuário sobre a limitação da interface antiga
    toast({
      title: 'Recomendação',
      description: `Para configuração completa, use a opção "Conectar" na visualização de cards.`,
      duration: 5000,
    });
  };

  // Combina os dados estáticos com os dados reais das integrações
  const getIntegrationsData = () => {
    const staticIntegrations = [
      {
        id: 'wbuy' as IntegrationType,
        name: 'Wbuy',
        description: 'Sistema de vendas e gestão de afiliados',
        color: 'bg-blue-100 text-blue-700',
        connected: false,
      },
      {
        id: 'facebook' as IntegrationType,
        name: 'Facebook',
        description: 'Integração com API de anúncios do Facebook',
        color: 'bg-blue-100 text-blue-700',
        connected: false,
      },
      {
        id: 'activecampaign' as IntegrationType,
        name: 'Active Campaign',
        description: 'Automação de marketing e gestão de leads',
        color: 'bg-green-100 text-green-700',
        connected: false,
      },
      {
        id: 'google' as IntegrationType,
        name: 'Google Analytics',
        description: 'Análise de tráfego e conversões',
        color: 'bg-yellow-100 text-yellow-700',
        connected: false,
      },
      {
        id: 'stape' as IntegrationType,
        name: 'Stape.io',
        description: 'Servidor de tags e rastreamento',
        color: 'bg-purple-100 text-purple-700',
        connected: false,
      },
      {
        id: 'tiny' as IntegrationType,
        name: 'Tiny',
        description: 'Sistema de gestão empresarial',
        color: 'bg-pink-100 text-pink-700',
        connected: false,
      },
      {
        id: 'airtable' as IntegrationType,
        name: 'Airtable',
        description: 'Base de dados colaborativa',
        color: 'bg-green-100 text-green-700',
        connected: false,
      },
    ];

    // Combina os dados estáticos com os dados reais
    return staticIntegrations.map(staticIntegration => {
      const realIntegration = integrations.find(i => i.id === staticIntegration.id);
      return {
        ...staticIntegration,
        connected: realIntegration?.status === 'connected',
        lastSync: realIntegration?.lastSync,
        syncStatus: realIntegration?.metadata?.last_sync_status,
      };
    });
  };

  return {
    activeTab,
    setActiveTab,
    apiKeys,
    isLoading,
    handleConnect,
    handleSaveApiKey,
    getIntegrationsData
  };
};
