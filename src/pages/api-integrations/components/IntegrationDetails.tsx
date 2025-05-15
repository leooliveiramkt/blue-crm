
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIntegration } from '@/hooks/useIntegration';
import { IntegrationType } from '@/lib/integrations/types';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { IntegrationConfigDialog } from './IntegrationConfigDialog';

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

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      }).format(date);
    } catch {
      return 'Data inválida';
    }
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{config.name}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
            <Button
              variant={isConnected ? "outline" : "default"}
              onClick={() => setDialogOpen(true)}
            >
              {isConnected ? "Reconfigurar" : "Conectar"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Status da Integração</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Estado</div>
                <div className={`mt-1 font-medium ${isConnected ? "text-green-600" : "text-amber-600"}`}>
                  {isConnected ? "Conectado" : "Desconectado"}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Última Sincronização</div>
                <div className="mt-1 font-medium">
                  {integration?.lastSync ? formatTimeAgo(integration.lastSync) : "Nunca"}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Status da Última Sync</div>
                <div className={`mt-1 font-medium ${
                  integration?.metadata?.last_sync_status === 'success' ? "text-green-600" : 
                  integration?.metadata?.last_sync_status === 'error' ? "text-red-600" : "text-amber-600"
                }`}>
                  {integration?.metadata?.last_sync_status === 'success' ? "Sucesso" : 
                   integration?.metadata?.last_sync_status === 'error' ? "Erro" : "Não disponível"}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Data de Configuração</div>
                <div className="mt-1 font-medium">
                  {integration ? formatDateTime(integration.createdAt) : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {isConnected && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 font-medium">Ações</h3>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => refreshIntegration()}
                >
                  Atualizar Status
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect} 
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Desconectando...
                    </>
                  ) : "Desconectar"}
                </Button>
              </div>
            </div>
          )}

          {integration?.metadata && Object.keys(integration.metadata).length > 0 && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Metadados da Integração</h3>
              <pre className="mt-2 rounded bg-muted p-4 text-xs overflow-auto max-h-64">
                {JSON.stringify(integration.metadata, null, 2)}
              </pre>
            </div>
          )}
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
