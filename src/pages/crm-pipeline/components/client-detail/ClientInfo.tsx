
import React from 'react';
import { User, Clock, FileText } from 'lucide-react';
import { Lead } from '../../types';

interface ClientInfoProps {
  lead: Lead;
}

export const ClientInfo: React.FC<ClientInfoProps> = ({ lead }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Responsável:</span>
        </div>
        <span className="font-medium">{lead.assignedTo}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Último contato:</span>
        </div>
        <span>{lead.lastContactDays > 0 ? `${lead.lastContactDays} dias atrás` : 'Hoje'}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Valor potencial:</span>
        </div>
        <span className="font-medium">
          {lead.potentialValue ? `R$ ${lead.potentialValue.toLocaleString('pt-BR')}` : 'Não definido'}
        </span>
      </div>
    </div>
  );
};
