
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiIntegrations } from './hooks/useApiIntegrations';
import { IntegrationsOverview } from './components/IntegrationsOverview';
import { ApiSettingsContent } from './components/ApiSettingsContent';
import { WebhooksForm } from './components/WebhooksForm';
import { ApiLogsTable } from './components/ApiLogsTable';

const ApiIntegrations: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    apiKeys,
    handleConnect,
    handleSaveApiKey,
    getIntegrationsData
  } = useApiIntegrations();

  const integrationsData = getIntegrationsData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Integrações API</h2>
        <p className="text-muted-foreground">Gerencie todas as suas conexões API e integrações.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <IntegrationsOverview 
            integrations={integrationsData.map(integration => ({
              ...integration,
              onConnect: handleConnect
            }))} 
          />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <ApiSettingsContent 
            integrations={integrationsData.map(integration => ({
              id: integration.id,
              name: integration.name,
              connected: integration.connected,
              defaultValue: apiKeys[integration.id],
              onSave: handleSaveApiKey
            }))} 
          />
        </TabsContent>
        
        <TabsContent value="webhooks" className="space-y-4">
          <WebhooksForm />
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <ApiLogsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiIntegrations;
