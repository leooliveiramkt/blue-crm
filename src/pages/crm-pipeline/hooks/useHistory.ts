
import { useState } from 'react';
import { HistoryItem } from '../types';

// Criar histórico simulado
const generateHistory = (leadId: string): HistoryItem[] => {
  const baseDate = new Date();
  baseDate.setHours(baseDate.getHours() - 3);
  
  return [
    {
      id: `history-${leadId}-1`,
      leadId,
      type: 'status',
      description: 'Lead criado no sistema',
      user: 'Sistema',
      timestamp: new Date(baseDate.getTime() - 180 * 60000).toISOString()
    },
    {
      id: `history-${leadId}-2`,
      leadId,
      type: 'assignment',
      description: 'Lead atribuído a Ana Silva',
      user: 'Carlos Eduardo',
      timestamp: new Date(baseDate.getTime() - 175 * 60000).toISOString()
    },
    {
      id: `history-${leadId}-3`,
      leadId,
      type: 'message',
      description: 'Primeira mensagem recebida',
      details: 'Cliente entrou em contato via WhatsApp.',
      user: 'Sistema',
      timestamp: new Date(baseDate.getTime() - 90 * 60000).toISOString()
    },
    {
      id: `history-${leadId}-4`,
      leadId,
      type: 'message',
      description: 'Resposta enviada ao cliente',
      user: 'Ana Silva',
      timestamp: new Date(baseDate.getTime() - 85 * 60000).toISOString()
    }
  ];
};

export const useHistory = () => {
  const [history, setHistory] = useState<Record<string, HistoryItem[]>>({});
  
  // Inicializar histórico para um novo lead
  const initializeHistory = (leadId: string) => {
    if (!history[leadId]) {
      setHistory(prev => ({
        ...prev,
        [leadId]: generateHistory(leadId)
      }));
    }
  };
  
  // Obter histórico do lead
  const getLeadHistory = (leadId: string): HistoryItem[] => {
    return history[leadId] || [];
  };
  
  // Adicionar item ao histórico
  const addHistoryItem = (leadId: string, item: Omit<HistoryItem, 'id' | 'leadId'>) => {
    const newItem: HistoryItem = {
      id: `history-${leadId}-${Date.now()}`,
      leadId,
      ...item
    };
    
    setHistory(prev => {
      const leadHistory = [...(prev[leadId] || [])];
      return {
        ...prev,
        [leadId]: [newItem, ...leadHistory]
      };
    });
    
    return newItem;
  };
  
  // Remover histórico de um lead
  const removeLeadHistory = (leadId: string) => {
    setHistory(prev => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
  };

  return {
    history,
    setHistory,
    initializeHistory,
    getLeadHistory,
    addHistoryItem,
    removeLeadHistory
  };
};
