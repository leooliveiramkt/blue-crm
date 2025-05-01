
import { useState } from 'react';
import { Stage } from '../types';

// Dados iniciais simulados
const initialStages: Stage[] = [
  { id: 'stage-1', name: 'Novo Lead', order: 1, color: '#9b87f5' },
  { id: 'stage-2', name: 'Contato Inicial', order: 2, color: '#7E69AB' },
  { id: 'stage-3', name: 'Proposta Enviada', order: 3, color: '#33C3F0' },
  { id: 'stage-4', name: 'Em Negociação', order: 4, color: '#8B5CF6' },
  { id: 'stage-5', name: 'Fechado Ganho', order: 5, color: '#2ECC71' },
  { id: 'stage-6', name: 'Fechado Perdido', order: 6, color: '#E74C3C' },
];

export const useStages = () => {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  
  return {
    stages,
    setStages
  };
};
