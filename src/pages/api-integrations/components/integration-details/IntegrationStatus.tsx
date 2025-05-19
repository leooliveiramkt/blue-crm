
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface IntegrationStatusProps {
  isConnected: boolean;
  lastSync?: string;
  syncStatus?: string;
  createdAt?: string;
}

export const IntegrationStatus: React.FC<IntegrationStatusProps> = ({
  isConnected,
  lastSync,
  syncStatus,
  createdAt
}) => {
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
            {lastSync ? formatTimeAgo(lastSync) : "Nunca"}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">Status da Última Sync</div>
          <div className={`mt-1 font-medium ${
            syncStatus === 'success' ? "text-green-600" : 
            syncStatus === 'error' ? "text-red-600" : "text-amber-600"
          }`}>
            {syncStatus === 'success' ? "Sucesso" : 
             syncStatus === 'error' ? "Erro" : "Não disponível"}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">Data de Configuração</div>
          <div className="mt-1 font-medium">
            {createdAt ? formatDateTime(createdAt) : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};
