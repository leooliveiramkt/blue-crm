
import { useEffect, createContext, useContext } from 'react';
import { useStages } from './useStages';
import { useLeads } from './useLeads';
import { useMessages } from './useMessages';
import { useHistory } from './useHistory';
import { useTasks } from './useTasks';
import { useNotes } from './useNotes';
import { useUsers } from './useUsers';

// Contexto
type PipelineContextType = ReturnType<typeof usePipelineDataProvider>;

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

// Provider para dados do pipeline
const usePipelineDataProvider = () => {
  const { stages } = useStages();
  const { 
    leads, 
    moveLeadToStage, 
    addLead, 
    deleteLeadById, 
    getLeadById, 
    updateLeadStatus 
  } = useLeads();
  const { 
    messages, 
    setMessages, 
    initializeMessages, 
    getLeadConversation, 
    addMessage, 
    removeLeadMessages 
  } = useMessages();
  const { 
    history, 
    setHistory, 
    initializeHistory, 
    getLeadHistory, 
    addHistoryItem, 
    removeLeadHistory 
  } = useHistory();
  const { 
    tasks, 
    setTasks, 
    initializeTasks, 
    getLeadTasks, 
    toggleTaskStatus, 
    addTask, 
    removeLeadTasks 
  } = useTasks();
  const { 
    notes, 
    setNotes, 
    initializeNotes, 
    getLeadNotes, 
    addNote, 
    toggleNotePinned, 
    removeLeadNotes 
  } = useNotes();
  const { users } = useUsers();
  
  // Carregar dados iniciais
  useEffect(() => {
    // Inicializar mensagens, histórico, tarefas e notas para cada lead
    Object.keys(leads).forEach(leadId => {
      initializeMessages(leadId);
      initializeHistory(leadId);
      initializeTasks(leadId);
      initializeNotes(leadId);
    });
  }, []);
  
  // Atualizar o hook de leads para usar o nome do estágio
  const moveLeadToStageWithName = (leadId: string, stageId: string) => {
    if (!leads[leadId] || !stages.find(s => s.id === stageId)) return;
    
    const stageName = stages.find(s => s.id === stageId)?.name || 'Estágio desconhecido';
    moveLeadToStage(leadId, stageId, stageName);
  };

  // Remover completamente um lead e seus dados relacionados
  const deleteLeadByIdComplete = (leadId: string) => {
    deleteLeadById(leadId);
    removeLeadMessages(leadId);
    removeLeadHistory(leadId);
    removeLeadTasks(leadId);
    removeLeadNotes(leadId);
  };

  return {
    stages,
    leads,
    users,
    moveLeadToStage: moveLeadToStageWithName,
    addLead,
    getLeadById,
    updateLeadStatus,
    getLeadConversation,
    getLeadHistory,
    getLeadTasks,
    toggleTaskStatus,
    getLeadNotes,
    addNote,
    deleteLeadById: deleteLeadByIdComplete,
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
