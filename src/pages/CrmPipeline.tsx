
import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { PipelineHeader } from './crm-pipeline/components/PipelineHeader';
import { PipelineBoard } from './crm-pipeline/components/PipelineBoard';
import { ClientDetail } from './crm-pipeline/components/ClientDetail';
import { usePipelineData } from './crm-pipeline/hooks/usePipelineData';

const CrmPipeline = () => {
  const { stages, leads, moveLeadToStage } = usePipelineData();
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const leadId = String(active.id);
      const stageId = String(over.id);
      moveLeadToStage(leadId, stageId);
    }
  };

  const handleLeadClick = (leadId: string) => {
    setSelectedLead(leadId === selectedLead ? null : leadId);
  };

  const handleCloseDetail = () => {
    setSelectedLead(null);
  };

  return (
    <div className="space-y-6">
      <PipelineHeader />
      
      <div className="flex h-[calc(100vh-220px)]">
        <DndContext onDragEnd={handleDragEnd}>
          <div className={`transition-width duration-300 ${selectedLead ? 'w-2/3' : 'w-full'}`}>
            <PipelineBoard 
              stages={stages} 
              leads={leads} 
              activeLead={selectedLead}
              onLeadClick={handleLeadClick}
            />
          </div>
          
          {selectedLead && (
            <div className="w-1/3 border-l animate-fade-in">
              <ClientDetail 
                leadId={selectedLead}
                onClose={handleCloseDetail}
              />
            </div>
          )}
        </DndContext>
      </div>
    </div>
  );
};

export default CrmPipeline;
