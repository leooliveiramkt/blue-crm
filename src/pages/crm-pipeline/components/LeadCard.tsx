
import React from 'react';
import { Calendar, Phone, MessageCircle, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Lead } from '../types';
import { cn } from '@/lib/utils';

interface LeadCardProps {
  lead: Lead;
  isActive: boolean;
  onClick: () => void;
}

export const LeadCard = ({ lead, isActive, onClick }: LeadCardProps) => {
  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderPriorityBadge = () => {
    const priorityClasses = {
      high: "bg-red-100 text-red-800 hover:bg-red-100",
      medium: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      low: "bg-green-100 text-green-800 hover:bg-green-100"
    };
    
    const priorityLabels = {
      high: "Alta",
      medium: "Média",
      low: "Baixa"
    };
    
    return (
      <Badge 
        variant="outline" 
        className={cn(priorityClasses[lead.priority])}
      >
        {priorityLabels[lead.priority]}
      </Badge>
    );
  };

  return (
    <div 
      className={cn(
        "bg-card border rounded-md p-3 cursor-pointer transition-all hover:shadow-md",
        isActive && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-brand-600 text-white text-xs">
              {getInitials(lead.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium line-clamp-1">{lead.name}</h4>
            <p className="text-xs text-muted-foreground">{lead.email}</p>
          </div>
        </div>
        
        {renderPriorityBadge()}
      </div>
      
      <div className="space-y-1 mt-3">
        {lead.phone && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Phone className="h-3 w-3 mr-1" />
            <span>{lead.phone}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>{lead.assignedTo}</span>
          </div>
          
          <div className="flex gap-2">
            {lead.lastContactDays > 0 && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{lead.lastContactDays}d</span>
              </div>
            )}
            {lead.unreadMessages > 0 && (
              <div className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                <span>{lead.unreadMessages}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
