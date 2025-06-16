import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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

// Retorna as informações de estilo com base no status de sincronização
const getSyncStatusInfo = (syncStatus?: string) => {
  if (!syncStatus) return {
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    icon: Clock,
    label: 'Pendente'
  };
  
  switch (syncStatus) {
    case 'success':
    case 'concluido':
      return {
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        icon: CheckCircle,
        label: 'Concluído'
      };
    case 'error':
    case 'erro':
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: AlertCircle,
        label: 'Erro'
      };
    case 'em_andamento':
    case 'processando':
      return {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: RefreshCw,
        label: 'Em andamento',
        animate: true
      };
    case 'concluido_com_erros':
      return {
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        icon: AlertCircle,
        label: 'Concluído com erros'
      };
    default:
      return {
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        icon: Clock,
        label: 'Status desconhecido'
      };
  }
};

// Retorna as informações de status de conexão
const getConnectionInfo = (connected: boolean) => {
  return {
    color: connected ? 'text-emerald-600' : 'text-amber-600',
    bgColor: connected ? 'bg-emerald-50' : 'bg-amber-50',
    icon: connected ? CheckCircle : AlertCircle,
    label: connected ? 'Conectado' : 'Não conectado'
  };
};

export const SyncStatus: React.FC<SyncStatusProps> = ({ 
  lastSync, 
  syncStatus,
  connected
}) => {
  const syncInfo = getSyncStatusInfo(syncStatus);
  const connectionInfo = getConnectionInfo(connected);
  const isProcessing = syncStatus === 'em_andamento' || syncStatus === 'processando';

  return (
    <div className="space-y-2.5">
      {/* Status de Conexão */}
      <div className={`flex items-center px-2 py-1.5 rounded-md ${connectionInfo.bgColor}`}>
        <connectionInfo.icon className={`mr-2 h-4 w-4 ${connectionInfo.color}`} />
        <span className={`text-xs font-medium ${connectionInfo.color}`}>
          {connectionInfo.label}
        </span>
      </div>
      
      {/* Status de Sincronização */}
      <div className={`flex items-center px-2 py-1.5 rounded-md ${syncInfo.bgColor}`}>
        <syncInfo.icon 
          className={`mr-2 h-4 w-4 ${syncInfo.color} ${syncInfo.animate ? 'animate-spin' : ''}`} 
        />
        <span className={`text-xs font-medium ${syncInfo.color}`}>
          {syncInfo.label}
        </span>
      </div>
      
      {/* Barra de Progresso para sincronização em andamento */}
      {isProcessing && (
        <div className="mt-2">
          <Progress value={65} className="h-1.5 bg-gray-100" />
        </div>
      )}
      
      {/* Última sincronização */}
      <div className="text-xs text-gray-500">
        Última atualização: 
        <span className={`ml-1.5 font-medium ${syncInfo.color}`}>
          {formatLastSync(lastSync)}
        </span>
      </div>
    </div>
  );
};
