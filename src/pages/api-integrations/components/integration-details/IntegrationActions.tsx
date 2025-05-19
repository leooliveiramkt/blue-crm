
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface IntegrationActionsProps {
  isConnected: boolean;
  isDisconnecting: boolean;
  onRefresh: () => void;
  onDisconnect: () => void;
}

export const IntegrationActions: React.FC<IntegrationActionsProps> = ({
  isConnected,
  isDisconnecting,
  onRefresh,
  onDisconnect
}) => {
  if (!isConnected) return null;

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 font-medium">Ações</h3>
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          onClick={onRefresh}
        >
          Atualizar Status
        </Button>
        <Button 
          variant="destructive" 
          onClick={onDisconnect} 
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
  );
};
