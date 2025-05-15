
import React from 'react';
import { CheckCircle, Check, X, Clock } from 'lucide-react';

interface SyncStatusDisplayProps {
  status: string;
}

export const SyncStatusDisplay: React.FC<SyncStatusDisplayProps> = ({ status }) => {
  switch (status) {
    case 'concluido':
      return (
        <div className="flex items-center text-green-500">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>Concluído</span>
        </div>
      );
    case 'concluido_com_erros':
      return (
        <div className="flex items-center text-amber-500">
          <Check className="h-4 w-4 mr-1" />
          <span>Concluído com erros</span>
        </div>
      );
    case 'erro':
      return (
        <div className="flex items-center text-red-500">
          <X className="h-4 w-4 mr-1" />
          <span>Erro</span>
        </div>
      );
    case 'em_andamento':
    case 'processando':
      return (
        <div className="flex items-center text-blue-500">
          <Clock className="h-4 w-4 mr-1 animate-spin" />
          <span>{status === 'em_andamento' ? 'Em andamento' : 'Processando'}</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <span>{status}</span>
        </div>
      );
  }
};
