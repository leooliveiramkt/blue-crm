
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SyncStatusProps {
  lastSync?: string;
  syncStatus?: string;
  connected: boolean;
}

// Formata o momento da última sincronização
const formatLastSync = (lastSync?: string) => {
  if (!lastSync) return 'Nunca sincronizado';
  
  try {
    const date = new Date(lastSync);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  } catch (error) {
    return 'Data inválida';
  }
};

// Retorna a classe CSS baseada no status de sincronização
const getSyncStatusClass = (syncStatus?: string) => {
  if (!syncStatus) return 'text-amber-600';
  return syncStatus === 'success' ? 'text-green-600' : 'text-red-600';
};

export const SyncStatus: React.FC<SyncStatusProps> = ({ 
  lastSync, 
  syncStatus,
  connected
}) => {
  return (
    <div className="mt-3 space-y-1">
      <p className="text-xs font-medium text-muted-foreground">
        Status: 
        <span className={connected ? "text-green-600 ml-1" : "text-amber-600 ml-1"}>
          {connected ? "Conectado" : "Não conectado"}
        </span>
      </p>
      <p className="text-xs font-medium text-muted-foreground">
        Última atualização: 
        <span className={`ml-1 ${getSyncStatusClass(syncStatus)}`}>
          {formatLastSync(lastSync)}
        </span>
      </p>
    </div>
  );
};
