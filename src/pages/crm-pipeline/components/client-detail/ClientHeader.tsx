
import React from 'react';
import { MoreVertical, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Lead } from '../../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ClientHeaderProps {
  lead: Lead;
  onDeleteLead: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ lead, onDeleteLead }) => {
  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-brand-600 text-white">
            {getInitials(lead.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">{lead.name}</h2>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => console.log('Editar lead')}>
                  Editar Lead
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDeleteLead} className="text-red-500">
                  Excluir Lead
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <Badge>{lead.source}</Badge>
            <Badge variant="outline">{lead.tags.join(', ')}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
