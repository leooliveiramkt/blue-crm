
import React from 'react';
import { SelectItem } from '@/components/ui/select';

interface PriorityOption {
  value: string;
  label: string;
}

interface PriorityOptionsProps {
  priorities?: PriorityOption[];
}

export const PriorityOptions: React.FC<PriorityOptionsProps> = ({ 
  priorities = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
  ]
}) => {
  return (
    <>
      {priorities.map(priority => (
        <SelectItem key={priority.value} value={priority.value}>
          {priority.label}
        </SelectItem>
      ))}
    </>
  );
};
