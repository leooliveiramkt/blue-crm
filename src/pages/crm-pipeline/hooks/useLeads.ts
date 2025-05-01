
import { useState, useCallback } from 'react';
import { Lead } from '../types';
import { useHistory } from './useHistory';

// Dados iniciais simulados
const initialLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '(11) 98765-4321',
    stageId: 'stage-1',
    priority: 'medium',
    assignedTo: 'Ana Silva',
    source: 'website',
    tags: ['curso', 'jurídico'],
    potentialValue: 3500,
    lastContactDays: 0,
    unreadMessages: 2
  },
  {
    id: 'lead-2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 91234-5678',
    stageId: 'stage-2',
    priority: 'high',
    assignedTo: 'Roberto Almeida',
    source: 'instagram',
    tags: ['consultoria'],
    potentialValue: 7800,
    lastContactDays: 1,
    unreadMessages: 0
  },
  {
    id: 'lead-3',
    name: 'João Pereira',
    email: 'joao.pereira@email.com',
    phone: '(21) 99876-5432',
    stageId: 'stage-3',
    priority: 'low',
    assignedTo: 'Ana Silva',
    source: 'referral',
    tags: ['workshop', 'online'],
    potentialValue: 1200,
    lastContactDays: 3,
    unreadMessages: 0
  },
  {
    id: 'lead-4',
    name: 'Patricia Ferreira',
    email: 'patricia@email.com',
    phone: '(11) 97654-3210',
    stageId: 'stage-4',
    priority: 'high',
    assignedTo: 'Roberto Almeida',
    source: 'manychat',
    tags: ['coaching', 'presencial'],
    potentialValue: 5000,
    lastContactDays: 0,
    unreadMessages: 3
  },
];

export const useLeads = () => {
  const { addHistoryItem } = useHistory();
  
  const [leads, setLeads] = useState<Record<string, Lead>>(() => {
    const leadsMap: Record<string, Lead> = {};
    initialLeads.forEach(lead => {
      leadsMap[lead.id] = lead;
    });
    return leadsMap;
  });

  // Mover lead para outro estágio
  const moveLeadToStage = useCallback((leadId: string, stageId: string, stageName?: string) => {
    if (!leads[leadId]) return;
    
    setLeads(prev => {
      const updated = { ...prev };
      updated[leadId] = { ...updated[leadId], stageId };
      return updated;
    });
    
    // Adicionar ao histórico
    addHistoryItem(leadId, {
      type: 'status',
      description: `Movido para ${stageName || 'novo estágio'}`,
      user: 'Você',
      timestamp: new Date().toISOString()
    });
  }, [leads, addHistoryItem]);
  
  // Adicionar lead
  const addLead = useCallback((leadData: Omit<Lead, 'id'>) => {
    const newId = `lead-${Date.now()}`;
    const newLead: Lead = {
      id: newId,
      ...leadData,
    };
    
    setLeads(prev => ({
      ...prev,
      [newId]: newLead
    }));
    
    // Adicionar histórico de criação
    addHistoryItem(newId, {
      type: 'status',
      description: 'Lead adicionado ao sistema',
      user: 'Você',
      timestamp: new Date().toISOString()
    });
    
    return newId;
  }, [addHistoryItem]);
  
  // Excluir lead
  const deleteLeadById = useCallback((leadId: string) => {
    setLeads(prev => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
  }, []);
  
  // Obter lead por ID
  const getLeadById = useCallback((leadId: string): Lead | null => {
    return leads[leadId] || null;
  }, [leads]);
  
  // Atualizar status do lead
  const updateLeadStatus = useCallback((leadId: string, status: string) => {
    // Implementação posteriormente
  }, []);

  return {
    leads,
    moveLeadToStage,
    addLead,
    deleteLeadById,
    getLeadById,
    updateLeadStatus
  };
};
