
import React from 'react';
import { MessageCircle, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientActionsProps {
  onStartCall: () => void;
  onStartChat: () => void;
  onSendEmail: () => void;
  onSchedule: () => void;
}

export const ClientActions: React.FC<ClientActionsProps> = ({ 
  onStartCall, 
  onStartChat, 
  onSendEmail, 
  onSchedule 
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        onClick={onStartCall}
      >
        <Phone className="h-4 w-4" />
        Ligar
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        onClick={onStartChat}
      >
        <MessageCircle className="h-4 w-4" />
        Whatsapp
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        onClick={onSendEmail}
      >
        <Mail className="h-4 w-4" />
        Email
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        onClick={onSchedule}
      >
        <Calendar className="h-4 w-4" />
        Agendar
      </Button>
    </div>
  );
};
