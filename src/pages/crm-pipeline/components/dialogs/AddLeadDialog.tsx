
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { usePipelineData } from '../../hooks/usePipelineData';
import { LeadForm, LeadFormValues } from './LeadForm';

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddLeadDialog = ({ open, onOpenChange }: AddLeadDialogProps) => {
  const { stages, users, addLead } = usePipelineData();
  
  const handleSubmit = (values: LeadFormValues) => {
    // Garantindo que todos os campos obrigatórios estejam presentes
    addLead({
      name: values.name,
      email: values.email,
      phone: values.phone || '',
      source: values.source,
      stageId: values.stageId,
      priority: values.priority,
      assignedTo: values.assignedTo,
      tags: [],
      potentialValue: 0,
      lastContactDays: 0,
      unreadMessages: 0,
    });
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo lead</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo lead para adicioná-lo ao pipeline.
          </DialogDescription>
        </DialogHeader>
        
        <LeadForm 
          stages={stages}
          users={users}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
