
import { useState, useEffect } from 'react';
import { Message } from '../types';

// Criar mensagens simuladas
const generateMessages = (leadId: string): Message[] => {
  const baseDate = new Date();
  baseDate.setHours(baseDate.getHours() - 2);
  
  return [
    {
      id: `msg-${leadId}-1`,
      leadId,
      sender: 'Sistema',
      content: 'Lead criado automaticamente.',
      timestamp: new Date(baseDate.getTime() - 120 * 60000).toISOString(),
      isFromLead: false,
      channel: 'system'
    },
    {
      id: `msg-${leadId}-2`,
      leadId,
      sender: 'Cliente', // Alterado para simplificar
      content: 'Olá, gostaria de saber mais sobre os serviços.',
      timestamp: new Date(baseDate.getTime() - 90 * 60000).toISOString(),
      isFromLead: true,
      channel: 'whatsapp'
    },
    {
      id: `msg-${leadId}-3`,
      leadId,
      sender: 'Ana Silva',
      content: 'Olá! Como posso ajudar você hoje?',
      timestamp: new Date(baseDate.getTime() - 85 * 60000).toISOString(),
      isFromLead: false,
      channel: 'whatsapp'
    }
  ];
};

export const useMessages = () => {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  
  // Inicializar mensagens para um novo lead
  const initializeMessages = (leadId: string) => {
    if (!messages[leadId]) {
      setMessages(prev => ({
        ...prev,
        [leadId]: generateMessages(leadId)
      }));
    }
  };
  
  // Obter conversas do lead
  const getLeadConversation = (leadId: string): Message[] => {
    return messages[leadId] || [];
  };
  
  // Adicionar mensagem
  const addMessage = (leadId: string, message: Omit<Message, 'id' | 'leadId'>) => {
    const newMessage: Message = {
      id: `msg-${leadId}-${Date.now()}`,
      leadId,
      ...message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => {
      const leadMessages = [...(prev[leadId] || [])];
      return {
        ...prev,
        [leadId]: [...leadMessages, newMessage]
      };
    });
    
    return newMessage;
  };
  
  // Remover mensagens de um lead
  const removeLeadMessages = (leadId: string) => {
    setMessages(prev => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
  };

  return {
    messages,
    setMessages,
    initializeMessages,
    getLeadConversation,
    addMessage,
    removeLeadMessages
  };
};
