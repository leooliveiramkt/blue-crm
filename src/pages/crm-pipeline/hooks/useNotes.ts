
import { useState } from 'react';
import { Note } from '../types';

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

export const useNotes = () => {
  const [notes, setNotes] = useState<Record<string, Note[]>>({});
  
  // Inicializar notas para um novo lead
  const initializeNotes = (leadId: string) => {
    if (!notes[leadId]) {
      setNotes(prev => ({
        ...prev,
        [leadId]: generateNotes(leadId)
      }));
    }
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
    
    return newNote;
  };
  
  // Alternar status de fixação da nota
  const toggleNotePinned = (leadId: string, noteId: string) => {
    setNotes(prev => {
      const leadNotes = [...(prev[leadId] || [])];
      const updatedNotes = leadNotes.map(note => 
        note.id === noteId ? { ...note, pinned: !note.pinned } : note
      );
      
      return {
        ...prev,
        [leadId]: updatedNotes
      };
    });
  };
  
  // Remover notas de um lead
  const removeLeadNotes = (leadId: string) => {
    setNotes(prev => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
  };

  return {
    notes,
    setNotes,
    initializeNotes,
    getLeadNotes,
    addNote,
    toggleNotePinned,
    removeLeadNotes
  };
};
