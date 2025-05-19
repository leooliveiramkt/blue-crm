
import React from 'react';
import { 
  DragOverlay, 
  useDraggable, 
  useDroppable,
} from '@dnd-kit/core';
import { Stage, Lead } from '../types';
import { LeadCard } from './LeadCard';

interface PipelineBoardProps {
  stages: Stage[];
  leads: Record<string, Lead>;
  activeLead: string | null;
  onLeadClick: (id: string) => void;
}

export const PipelineBoard = ({ stages, leads, activeLead, onLeadClick }: PipelineBoardProps) => {
  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-6 px-1">
      {stages.map((stage) => (
        <StageColumn 
          key={stage.id}
          stage={stage}
          leads={Object.values(leads).filter(lead => lead.stageId === stage.id)}
          activeLead={activeLead}
          onLeadClick={onLeadClick}
        />
      ))}
    </div>
  );
};

interface StageColumnProps {
  stage: Stage;
  leads: Lead[];
  activeLead: string | null;
  onLeadClick: (id: string) => void;
}

const StageColumn = ({ stage, leads, activeLead, onLeadClick }: StageColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: stage.id,
  });

  return (
    <div className="flex-shrink-0 w-72">
      <div className="bg-muted rounded-t-md p-3 flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: stage.color }}
          ></div>
          <h3 className="font-medium">{stage.name}</h3>
        </div>
        <span className="text-sm bg-background rounded-full h-6 w-6 flex items-center justify-center">
          {leads.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef}
        className="bg-muted/50 rounded-b-md h-full overflow-y-auto p-2 flex flex-col gap-2"
      >
        {leads.map((lead) => (
          <DraggableLeadCard 
            key={lead.id} 
            lead={lead} 
            isActive={lead.id === activeLead}
            onClick={() => onLeadClick(lead.id)}
          />
        ))}
        
        {leads.length === 0 && (
          <div className="h-20 border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center text-sm text-muted-foreground">
            Nenhum lead neste estágio
          </div>
        )}
      </div>
    </div>
  );
};

interface DraggableLeadCardProps {
  lead: Lead;
  isActive: boolean;
  onClick: () => void;
}

const DraggableLeadCard = ({ lead, isActive, onClick }: DraggableLeadCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
      }}
      className={`touch-none ${isDragging ? 'z-10' : ''}`}
      {...attributes}
      {...listeners}
    >
      <LeadCard lead={lead} isActive={isActive} onClick={onClick} />
    </div>
  );
};
