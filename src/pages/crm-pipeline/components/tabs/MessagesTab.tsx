
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePipelineData } from '../../hooks/usePipelineData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessagesTabProps {
  leadId: string;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({ leadId }) => {
  const { getLeadConversation } = usePipelineData();
  const messages = getLeadConversation(leadId);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.isFromLead ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${message.isFromLead ? 'flex-row' : 'flex-row-reverse'}`}>
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarFallback className={message.isFromLead ? "bg-brand-300" : "bg-brand-600"}>
                  {getInitials(message.sender)}
                </AvatarFallback>
              </Avatar>
              
              <div
                className={`rounded-lg py-2 px-3 ${
                  message.isFromLead 
                    ? 'bg-muted text-foreground' 
                    : 'bg-brand-600 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="text-xs mt-1 opacity-70 text-right">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center">
            <div className="text-muted-foreground">
              <p>Nenhuma mensagem ainda</p>
              <p className="text-sm">Inicie uma conversa enviando uma mensagem</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-2 border-t">
        <div className="flex items-end gap-2">
          <Textarea 
            placeholder="Digite sua mensagem..." 
            className="min-h-[60px] resize-none"
          />
          <Button size="icon" className="flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-muted-foreground">
            Enviando via: WhatsApp
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              Modelos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
