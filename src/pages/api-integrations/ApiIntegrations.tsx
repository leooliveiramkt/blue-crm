
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiIntegrations } from './hooks/useApiIntegrations';
import { IntegrationsOverview } from './components/IntegrationsOverview';
import { ApiSettingsContent } from './components/ApiSettingsContent';
import { WebhooksForm } from './components/WebhooksForm';
import { ApiLogsTable } from './components/ApiLogsTable';
import ApiStatisticsCard from './components/ApiStatisticsCard';
import { IntegrationDetails } from './components/IntegrationDetails';
import { IntegrationType } from '@/lib/integrations/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ApiIntegrations: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    apiKeys,
    handleConnect,
    handleSaveApiKey,
    getIntegrationsData
  } = useApiIntegrations();

  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationType | null>(null);
  
  const integrationsData = getIntegrationsData();

  // Handler para quando o usuário clica em conectar no card de integração
  const handleIntegrationSelect = (integrationId: IntegrationType) => {
    setSelectedIntegration(integrationId);
  };

  const handleBackToOverview = () => {
    setSelectedIntegration(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Integrações API</h2>
        <p className="text-muted-foreground">Gerencie todas as suas conexões API e integrações.</p>
      </div>
      
      {selectedIntegration ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={handleBackToOverview} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para visão geral
          </Button>
          <IntegrationDetails integrationId={selectedIntegration} />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <IntegrationsOverview 
              integrations={integrationsData.map(integration => ({
                ...integration,
                onConnect: handleIntegrationSelect
              }))} 
            />
          </TabsContent>
          
          <TabsContent value="statistics" className="space-y-4">
            <ApiStatisticsCard />
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
      )}
    </div>
  );
};

export default ApiIntegrations;
