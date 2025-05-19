
import React from 'react';
import { SelectItem } from '@/components/ui/select';

interface LeadSourceOptionsProps {
  sources?: string[];
}

export const LeadSourceOptions: React.FC<LeadSourceOptionsProps> = ({ 
  sources = ['website', 'referral', 'instagram', 'facebook', 'manychat', 'whatsapp'] 
}) => {
  return (
    <>
      {sources.map(source => {
        const label = getSourceLabel(source);
        return (
          <SelectItem key={source} value={source}>
            {label}
          </SelectItem>
        );
      })}
    </>
  );
};

function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    website: 'Site',
    referral: 'Indicação',
    instagram: 'Instagram',
    facebook: 'Facebook',
    manychat: 'ManyChat',
    whatsapp: 'WhatsApp'
  };
  
  return labels[source] || source;
}
