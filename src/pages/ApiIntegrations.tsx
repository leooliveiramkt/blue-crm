import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Database, Facebook, Globe, Mail, BarChart3, Archive } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getTenantApiConfigs, saveTenantApiConfig, deleteTenantApiConfig, testTenantApiConnection, TenantApiConfig } from '@/lib/tenant-config';
import { useAuth } from '@/lib/auth';

// Define the ShoppingCart component at the top before it's used
const ShoppingCart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const integrations = [
  {
    id: 'wbuy',
    name: 'Wbuy',
    description: 'Integração com a plataforma Wbuy para sincronização de produtos e pedidos.',
    icon: '🛍️'
  },
  {
    id: 'facebook',
    name: 'Facebook Ads',
    description: 'Integração com Facebook Ads para análise de campanhas e métricas.',
    icon: '📱'
  },
  {
    id: 'activecampaign',
    name: 'Active Campaign',
    description: 'Integração com Active Campaign para automação de marketing e email.',
    icon: '📧'
  },
  {
    id: 'google',
    name: 'Google Analytics',
    description: 'Integração com Google Analytics para análise de tráfego e conversões.',
    icon: '📊'
  },
  {
    id: 'stape',
    name: 'Stape.io',
    description: 'Integração com Stape.io para gravação e análise de chamadas.',
    icon: '📞'
  },
  {
    id: 'tiny',
    name: 'Tiny ERP',
    description: 'Integração com Tiny ERP para sincronização de produtos e estoque.',
    icon: '📦'
  }
];

const ApiIntegrations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [configs, setConfigs] = useState<Record<string, TenantApiConfig>>({});
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  useEffect(() => {
    loadConfigs();
  }, [user?.id]);

  async function loadConfigs() {
    if (!user?.id) return;
    
    try {
      const tenantConfigs = await getTenantApiConfigs(user.id);
      const configMap = tenantConfigs.reduce((acc, config) => {
        acc[config.integration_id] = config;
        return acc;
      }, {} as Record<string, TenantApiConfig>);
      
      setConfigs(configMap);
    } catch (error) {
      toast({
        title: 'Erro ao carregar configurações',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveConfig(integrationId: string, apiKey: string, apiUrl?: string) {
    if (!user?.id) return;

    try {
      const config = await saveTenantApiConfig({
        tenant_id: user.id,
        integration_id: integrationId,
        api_key: apiKey,
        api_url: apiUrl,
        is_active: true
      });

      setConfigs(prev => ({
        ...prev,
        [integrationId]: config
      }));

      toast({
        title: 'Configuração salva',
        description: 'As configurações da API foram salvas com sucesso.'
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar configuração',
        description: error.message,
        variant: 'destructive'
      });
    }
  }

  async function handleDeleteConfig(integrationId: string) {
    if (!configs[integrationId]?.id) return;

    try {
      await deleteTenantApiConfig(configs[integrationId].id);
      
      setConfigs(prev => {
        const newConfigs = { ...prev };
        delete newConfigs[integrationId];
        return newConfigs;
      });

      toast({
        title: 'Configuração removida',
        description: 'As configurações da API foram removidas com sucesso.'
      });
    } catch (error) {
      toast({
        title: 'Erro ao remover configuração',
        description: error.message,
        variant: 'destructive'
      });
    }
  }

  async function handleTestConnection(integrationId: string) {
    if (!configs[integrationId]) return;

    setTesting(prev => ({ ...prev, [integrationId]: true }));
    
    try {
      const result = await testTenantApiConnection(configs[integrationId]);
      setTestResults(prev => ({
        ...prev,
        [integrationId]: result
      }));

      if (result.success) {
        toast({
          title: 'Conexão testada com sucesso',
          description: 'A API está respondendo corretamente.'
        });
      } else {
        toast({
          title: 'Erro ao testar conexão',
          description: result.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao testar conexão',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setTesting(prev => ({ ...prev, [integrationId]: false }));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Integrações API</h2>
        <p className="text-muted-foreground">Gerencie todas as suas conexões API e integrações.</p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {integrations.map(integration => (
            <Card key={integration.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{integration.icon}</span>
                  {integration.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{integration.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      placeholder="API Key"
                      value={configs[integration.id]?.api_key || ''}
                      onChange={e => handleSaveConfig(integration.id, e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="API URL (opcional)"
                      value={configs[integration.id]?.api_url || ''}
                      onChange={e => handleSaveConfig(integration.id, configs[integration.id]?.api_key || '', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleTestConnection(integration.id)}
                      disabled={!configs[integration.id] || testing[integration.id]}
                    >
                      {testing[integration.id] ? 'Testando...' : 'Testar Conexão'}
                    </Button>

                    {configs[integration.id] && (
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteConfig(integration.id)}
                      >
                        Remover
                      </Button>
                    )}
                  </div>

                  {testResults[integration.id] && (
                    <div className={`p-4 rounded-md ${
                      testResults[integration.id].success
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      <p className="font-medium">
                        {testResults[integration.id].success
                          ? 'Conexão bem-sucedida!'
                          : 'Erro na conexão'}
                      </p>
                      {testResults[integration.id].error && (
                        <p className="text-sm mt-1">
                          {testResults[integration.id].error}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Configure as opções globais para todas as integrações de API.
              </p>
              {/* Adicionar configurações globais aqui */}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Integração</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Visualize os logs de todas as integrações de API.
              </p>
              {/* Adicionar visualização de logs aqui */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiIntegrations;
