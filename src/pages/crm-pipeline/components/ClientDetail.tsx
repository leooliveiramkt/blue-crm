
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePipelineData } from '../hooks/usePipelineData';
import { useIntegrationCheck } from '../hooks/useIntegrationCheck';
import { ClientHeader } from './client-detail/ClientHeader';
import { ClientActions } from './client-detail/ClientActions';
import { ClientInfo } from './client-detail/ClientInfo';
import { ClientTabs } from './client-detail/ClientTabs';

interface ClientDetailProps {
  leadId: string;
  onClose: () => void;
}

export const ClientDetail = ({ leadId, onClose }: ClientDetailProps) => {
  const { getLeadById, deleteLeadById } = usePipelineData();
  const { checkIntegration } = useIntegrationCheck();
  
  const lead = getLeadById(leadId);

  if (!lead) return null;
  
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
  
  const handleSendEmail = () => {
    window.location.href = `mailto:${lead.email}`;
  };
  
  const handleSchedule = () => {
    console.log('Agendar consulta');
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
        <ClientHeader lead={lead} onDeleteLead={handleDeleteLead} />
        
        <div className="p-4 pt-0">
          <ClientActions 
            onStartCall={handleStartCall}
            onStartChat={handleStartChat}
            onSendEmail={handleSendEmail}
            onSchedule={handleSchedule}
          />
          
          <Separator className="my-4" />
          
          <ClientInfo lead={lead} />
        </div>
        
        <ClientTabs leadId={leadId} />
      </div>
    </div>
  );
};
