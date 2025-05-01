
import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  User, 
  MoreVertical,
  FileText,
  PanelRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePipelineData } from '../hooks/usePipelineData';
import { integrationManager } from '@/lib/integrations/integrationManager';

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { HistoryTab } from './tabs/HistoryTab';
import { NotesTab } from './tabs/NotesTab';
import { TasksTab } from './tabs/TasksTab';
import { MessagesTab } from './tabs/MessagesTab';

interface ClientDetailProps {
  leadId: string;
  onClose: () => void;
}

export const ClientDetail = ({ leadId, onClose }: ClientDetailProps) => {
  const [currentTab, setCurrentTab] = useState<string>('messages');
  const { getLeadById, updateLeadStatus, deleteLeadById } = usePipelineData();
  
  const lead = getLeadById(leadId);

  if (!lead) return null;
  
  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Verificar se alguma integração está disponível
  const checkIntegration = async (type: string) => {
    try {
      // Usando o método getIntegration em vez de hasIntegration
      const integration = await integrationManager.getIntegration(type as any);
      return integration !== null;
    } catch (error) {
      console.error(`Erro ao verificar integração ${type}:`, error);
      return false;
    }
  };

  const handleStartCall = async () => {
    const hasIntegration = await checkIntegration('oc360');
    if (hasIntegration) {
      // Iniciar chamada usando a integração
      console.log('Iniciando chamada para', lead.phone);
    } else {
      // Abrir telefone normalmente
      window.location.href = `tel:${lead.phone}`;
    }
  };

  const handleStartChat = async () => {
    const hasWhatsApp = await checkIntegration('whatsapp');
    if (hasWhatsApp) {
      // Iniciar chat pelo WhatsApp usando a integração
      console.log('Iniciando chat WhatsApp para', lead.phone);
    } else {
      // Abrir WhatsApp padrão
      const formattedPhone = lead.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${formattedPhone}`, '_blank');
    }
  };
  
  const handleDeleteLead = () => {
    if (confirm(`Tem certeza que deseja excluir o lead ${lead.name}?`)) {
      deleteLeadById(leadId);
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Detalhes do Cliente</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
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
                    <DropdownMenuItem onClick={handleDeleteLead} className="text-red-500">
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
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={handleStartCall}
            >
              <Phone className="h-4 w-4" />
              Ligar
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={handleStartChat}
            >
              <MessageCircle className="h-4 w-4" />
              Whatsapp
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={() => window.location.href = `mailto:${lead.email}`}
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={() => console.log('Agendar consulta')}
            >
              <Calendar className="h-4 w-4" />
              Agendar
            </Button>
          </div>
          
          <Separator className="my-4" />
          
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
        </div>
        
        <div className="px-2 pb-2">
          <Tabs defaultValue="messages" onValueChange={setCurrentTab} value={currentTab}>
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="messages">Mensagens</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="tasks">Tarefas</TabsTrigger>
              <TabsTrigger value="notes">Notas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="messages" className="m-0">
              <MessagesTab leadId={leadId} />
            </TabsContent>
            
            <TabsContent value="history" className="m-0">
              <HistoryTab leadId={leadId} />
            </TabsContent>
            
            <TabsContent value="tasks" className="m-0">
              <TasksTab leadId={leadId} />
            </TabsContent>
            
            <TabsContent value="notes" className="m-0">
              <NotesTab leadId={leadId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
