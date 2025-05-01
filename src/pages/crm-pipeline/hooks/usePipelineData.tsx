
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  Stage, 
  Lead, 
  Message, 
  HistoryItem, 
  Task, 
  Note,
  User
} from '../types';

// Dados iniciais simulados
const initialStages: Stage[] = [
  { id: 'stage-1', name: 'Novo Lead', order: 1, color: '#9b87f5' },
  { id: 'stage-2', name: 'Contato Inicial', order: 2, color: '#7E69AB' },
  { id: 'stage-3', name: 'Proposta Enviada', order: 3, color: '#33C3F0' },
  { id: 'stage-4', name: 'Em Negociação', order: 4, color: '#8B5CF6' },
  { id: 'stage-5', name: 'Fechado Ganho', order: 5, color: '#2ECC71' },
  { id: 'stage-6', name: 'Fechado Perdido', order: 6, color: '#E74C3C' },
];

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

const initialUsers: User[] = [
  { id: 'user-1', name: 'Ana Silva', role: 'Vendedor' },
  { id: 'user-2', name: 'Roberto Almeida', role: 'Consultor' },
  { id: 'user-3', name: 'Carlos Eduardo', role: 'Gerente' },
];

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
      sender: initialLeads.find(l => l.id === leadId)?.name || 'Cliente',
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

// Criar tarefas simuladas
const generateTasks = (leadId: string): Task[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return [
    {
      id: `task-${leadId}-1`,
      leadId,
      title: 'Fazer follow-up com cliente',
      description: 'Verificar se recebeu a proposta e tem dúvidas',
      dueDate: tomorrow.toISOString(),
      completed: false,
      assignee: 'Ana Silva'
    },
    {
      id: `task-${leadId}-2`,
      leadId,
      title: 'Enviar material complementar',
      dueDate: nextWeek.toISOString(),
      completed: false,
      assignee: 'Roberto Almeida'
    },
    {
      id: `task-${leadId}-3`,
      leadId,
      title: 'Atualizar informações no CRM',
      dueDate: yesterday.toISOString(),
      completed: true,
      assignee: 'Ana Silva'
    }
  ];
};

// Criar notas simuladas
const generateNotes = (leadId: string): Note[] => {
  const baseDate = new Date();
  baseDate.setHours(baseDate.getHours() - 4);
  
  return [
    {
      id: `note-${leadId}-1`,
      leadId,
      content: 'Cliente demonstrou interesse no pacote premium, mas está avaliando o orçamento.',
      author: 'Ana Silva',
      timestamp: new Date(baseDate.getTime() - 240 * 60000).toISOString(),
      pinned: true
    },
    {
      id: `note-${leadId}-2`,
      leadId,
      content: 'Mencionou que precisa de implementação até o final do próximo mês.',
      author: 'Ana Silva',
      timestamp: new Date(baseDate.getTime() - 120 * 60000).toISOString(),
      pinned: false
    }
  ];
};

// Contexto
type PipelineContextType = ReturnType<typeof usePipelineDataProvider>;

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

// Provider para dados do pipeline
const usePipelineDataProvider = () => {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [leads, setLeads] = useState<Record<string, Lead>>(() => {
    const leadsMap: Record<string, Lead> = {};
    initialLeads.forEach(lead => {
      leadsMap[lead.id] = lead;
    });
    return leadsMap;
  });
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [history, setHistory] = useState<Record<string, HistoryItem[]>>({});
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [notes, setNotes] = useState<Record<string, Note[]>>({});
  const [users] = useState<User[]>(initialUsers);
  
  // Carregar dados iniciais
  useEffect(() => {
    // Inicializar mensagens, histórico, tarefas e notas para cada lead
    const messagesMap: Record<string, Message[]> = {};
    const historyMap: Record<string, HistoryItem[]> = {};
    const tasksMap: Record<string, Task[]> = {};
    const notesMap: Record<string, Note[]> = {};
    
    Object.keys(leads).forEach(leadId => {
      messagesMap[leadId] = generateMessages(leadId);
      historyMap[leadId] = generateHistory(leadId);
      tasksMap[leadId] = generateTasks(leadId);
      notesMap[leadId] = generateNotes(leadId);
    });
    
    setMessages(messagesMap);
    setHistory(historyMap);
    setTasks(tasksMap);
    setNotes(notesMap);
  }, []);
  
  // Mover lead para outro estágio
  const moveLeadToStage = (leadId: string, stageId: string) => {
    if (!leads[leadId] || !stages.find(s => s.id === stageId)) return;
    
    setLeads(prev => {
      const updated = { ...prev };
      updated[leadId] = { ...updated[leadId], stageId };
      return updated;
    });
    
    // Adicionar ao histórico
    const stageName = stages.find(s => s.id === stageId)?.name || 'Estágio desconhecido';
    addHistoryItem(leadId, {
      type: 'status',
      description: `Movido para ${stageName}`,
      user: 'Você',
      timestamp: new Date().toISOString()
    });
  };
  
  // Adicionar lead
  const addLead = (leadData: Omit<Lead, 'id'>) => {
    const newId = `lead-${Date.now()}`;
    const newLead: Lead = {
      id: newId,
      ...leadData,
    };
    
    setLeads(prev => ({
      ...prev,
      [newId]: newLead
    }));
    
    // Inicializar dados associados
    setMessages(prev => ({
      ...prev,
      [newId]: []
    }));
    
    // Adicionar histórico de criação
    const historyItem: Omit<HistoryItem, 'id' | 'leadId'> = {
      type: 'status',
      description: 'Lead adicionado ao sistema',
      user: 'Você',
      timestamp: new Date().toISOString()
    };
    
    addHistoryItem(newId, historyItem);
    
    return newId;
  };
  
  // Excluir lead
  const deleteLeadById = (leadId: string) => {
    setLeads(prev => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
    
    // Remover dados associados
    setMessages(prev => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
    
    setHistory(prev => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
    
    setTasks(prev => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
    
    setNotes(prev => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
  };
  
  // Obter lead por ID
  const getLeadById = (leadId: string): Lead | null => {
    return leads[leadId] || null;
  };
  
  // Atualizar status do lead
  const updateLeadStatus = (leadId: string, status: string) => {
    // Implementação posteriormente
  };
  
  // Obter conversas do lead
  const getLeadConversation = (leadId: string): Message[] => {
    return messages[leadId] || [];
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
  };
  
  // Obter tarefas do lead
  const getLeadTasks = (leadId: string): Task[] => {
    return tasks[leadId] || [];
  };
  
  // Alternar status da tarefa
  const toggleTaskStatus = (leadId: string, taskId: string) => {
    setTasks(prev => {
      const leadTasks = [...(prev[leadId] || [])];
      const updatedTasks = leadTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      
      return {
        ...prev,
        [leadId]: updatedTasks
      };
    });
  };
  
  // Obter notas do lead
  const getLeadNotes = (leadId: string): Note[] => {
    return notes[leadId] || [];
  };
  
  // Adicionar nota
  const addNote = (leadId: string, content: string) => {
    const newNote: Note = {
      id: `note-${leadId}-${Date.now()}`,
      leadId,
      content,
      author: 'Você',
      timestamp: new Date().toISOString(),
      pinned: false
    };
    
    setNotes(prev => {
      const leadNotes = [...(prev[leadId] || [])];
      return {
        ...prev,
        [leadId]: [newNote, ...leadNotes]
      };
    });
  };

  return {
    stages,
    leads,
    users,
    moveLeadToStage,
    addLead,
    getLeadById,
    updateLeadStatus,
    getLeadConversation,
    getLeadHistory,
    getLeadTasks,
    toggleTaskStatus,
    getLeadNotes,
    addNote,
    deleteLeadById,
  };
};

// Hook para acessar o contexto
export const usePipelineData = () => {
  // Usando estado local para o exemplo
  return usePipelineDataProvider();
};

// Provider para a aplicação
export const PipelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pipelineData = usePipelineDataProvider();
  return (
    <PipelineContext.Provider value={pipelineData}>
      {children}
    </PipelineContext.Provider>
  );
};
