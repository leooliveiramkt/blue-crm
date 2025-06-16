import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IntegrationCardProps } from '../types';
import { IntegrationType } from '@/lib/integrations/types';
import { IntegrationConfigDialog } from './IntegrationConfigDialog';
import { IntegrationCardHeader } from './integration-card/CardHeader';
import { SyncStatus } from './integration-card/SyncStatus';

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  id,
  name,
  description,
  color,
  connected,
  lastSync,
  syncStatus,
  onConnect
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenConfig = () => {
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    // Opcionalmente, podemos atualizar algo após a conexão bem-sucedida
    // Como a prop onConnect é usada apenas para notificar o componente pai
    onConnect(id);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-6 pb-2">
          <IntegrationCardHeader
            id={id}
            name={name}
            color={color}
            connected={connected}
          />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <SyncStatus
            lastSync={lastSync}
            syncStatus={syncStatus}
            connected={connected}
          />
        </CardContent>
        <CardFooter className="p-6 pt-0">
          {connected ? (
            <Button 
              variant="outline" 
              className="w-full h-10 font-medium" 
              onClick={handleOpenConfig}
            >
              Configurar
            </Button>
          ) : (
            <Button 
              className="w-full h-10 font-medium bg-primary hover:bg-primary/90" 
              onClick={handleOpenConfig}
            >
              Conectar
            </Button>
          )}
        </CardFooter>
      </Card>

      <IntegrationConfigDialog
        integrationId={id}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
};
