
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useIntegration } from '@/hooks/useIntegration';
import { IntegrationType } from '@/lib/integrations/types';
import { useToast } from '@/hooks/use-toast';
import { IntegrationConfigDialog } from './IntegrationConfigDialog';
import { IntegrationHeader } from './integration-details/IntegrationHeader';
import { IntegrationStatus } from './integration-details/IntegrationStatus';
import { IntegrationActions } from './integration-details/IntegrationActions';
import { IntegrationMetadata } from './integration-details/IntegrationMetadata';

interface IntegrationDetailsProps {
  integrationId: IntegrationType;
}

export const IntegrationDetails: React.FC<IntegrationDetailsProps> = ({ integrationId }) => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { 
    integration, 
    config, 
    isLoading, 
    isConnected, 
    refreshIntegration,
    disconnectIntegration 
  } = useIntegration(integrationId);

  const [isDisconnecting, setIsDisconnecting] = useState(false);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!config) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Configuração não encontrada para esta integração.</p>
        </CardContent>
      </Card>
    );
  }

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    
    try {
      const success = await disconnectIntegration();
      
      if (success) {
        toast({
          title: "Integração desconectada",
          description: `A integração com ${config.name} foi desconectada com sucesso.`
        });
      } else {
        toast({
          title: "Erro na desconexão",
          description: `Não foi possível desconectar a integração com ${config.name}.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro na desconexão",
        description: `Ocorreu um erro ao desconectar a integração: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const syncStatus = integration?.metadata?.last_sync_status;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <IntegrationHeader
            name={config.name}
            description={config.description}
            isConnected={isConnected}
            onConfigure={() => setDialogOpen(true)}
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <IntegrationStatus
            isConnected={isConnected}
            lastSync={integration?.lastSync}
            syncStatus={syncStatus}
            createdAt={integration?.createdAt}
          />

          <IntegrationActions
            isConnected={isConnected}
            isDisconnecting={isDisconnecting}
            onRefresh={refreshIntegration}
            onDisconnect={handleDisconnect}
          />

          <IntegrationMetadata
            metadata={integration?.metadata}
          />
        </CardContent>
      </Card>

      <IntegrationConfigDialog
        integrationId={integrationId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={refreshIntegration}
      />
    </>
  );
};
