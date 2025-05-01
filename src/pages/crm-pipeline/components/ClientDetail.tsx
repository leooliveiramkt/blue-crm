
import React, { useState } from 'react';
import { toast } from "sonner";
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePipelineData } from '../hooks/usePipelineData';
import { ClientHeader } from './client-detail/ClientHeader';
import { ClientInfo } from './client-detail/ClientInfo';
import { ClientActions } from './client-detail/ClientActions';
import { ClientTabs } from './client-detail/ClientTabs';
import { useIntegrationCheck } from '../hooks/useIntegrationCheck';

interface ClientDetailProps {
  leadId: string;
  onClose: () => void;
}

export const ClientDetail: React.FC<ClientDetailProps> = ({ leadId, onClose }) => {
  const { getLeadById, deleteLeadById } = usePipelineData();
  const [isDeleting, setIsDeleting] = useState(false);
  const { checkIntegration } = useIntegrationCheck();
  
  const lead = getLeadById(leadId);
  
  if (!lead) {
    return (
      <div className="h-full p-4 flex flex-col justify-center items-center">
        <p>Lead não encontrado</p>
        <Button onClick={onClose} variant="outline" className="mt-4">Fechar</Button>
      </div>
    );
  }
  
  const handleDeleteLead = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o lead "${lead.name}"?`)) {
      setIsDeleting(true);
      
      try {
        deleteLeadById(leadId);
        onClose();
        toast.success(`Lead "${lead.name}" excluído com sucesso`);
      } catch (error) {
        console.error('Erro ao excluir lead:', error);
        toast.error('Erro ao excluir lead');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const handleStartCall = async () => {
    try {
      const hasVoipIntegration = await checkIntegration('voip');
      
      if (hasVoipIntegration) {
        toast.success(`Iniciando chamada para ${lead.phone}`);
        // Lógica para iniciar chamada
      } else {
        window.location.href = `tel:${lead.phone}`;
      }
    } catch (error) {
      console.error('Erro ao iniciar chamada:', error);
      window.location.href = `tel:${lead.phone}`;
    }
  };
  
  const handleStartChat = async () => {
    try {
      const hasWhatsAppIntegration = await checkIntegration('whatsapp');
      
      if (hasWhatsAppIntegration) {
        toast.success(`Iniciando conversa com ${lead.name}`);
        // Lógica para iniciar chat via integração
      } else {
        const phone = lead.phone.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}`, '_blank');
      }
    } catch (error) {
      console.error('Erro ao iniciar chat:', error);
      const phone = lead.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_blank');
    }
  };
  
  const handleSendEmail = () => {
    window.location.href = `mailto:${lead.email}`;
  };
  
  const handleSchedule = () => {
    toast.success(`Agendando com ${lead.name}`);
    // Implementar agendamento posteriormente
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end p-2 border-b">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ClientHeader lead={lead} onDeleteLead={handleDeleteLead} />
        
        <div className="p-4 border-t">
          <ClientInfo lead={lead} />
          
          <ClientActions
            onStartCall={handleStartCall}
            onStartChat={handleStartChat}
            onSendEmail={handleSendEmail}
            onSchedule={handleSchedule}
          />
        </div>
        
        <ClientTabs leadId={leadId} />
      </div>
    </div>
  );
};
