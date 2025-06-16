import React from 'react';
import { Switch } from '@/components/ui/switch';
import { IntegrationType } from '@/lib/integrations/types';
import { useIntegrationIcon } from '../integration-icons/IntegrationIcons';

interface CardHeaderProps {
  id: IntegrationType;
  name: string;
  color: string;
  connected: boolean;
}

export const IntegrationCardHeader: React.FC<CardHeaderProps> = ({
  id,
  name,
  color,
  connected
}) => {
  const IconComponent = useIntegrationIcon(id);

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-full ${color} bg-opacity-10`}>
          {IconComponent && <IconComponent className={`${color} text-opacity-100`} size={20} />}
        </div>
        <div className="text-base font-medium text-gray-900">
          {name}
        </div>
      </div>
      <div className="flex items-center">
        <Switch
          id={`${id}-switch`}
          checked={connected}
          disabled
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  );
};
