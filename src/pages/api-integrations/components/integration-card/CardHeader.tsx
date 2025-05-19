
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
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-full ${color}`}>
          {IconComponent && <IconComponent size={16} />}
        </div>
        <div className="text-md font-medium">
          {name}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id={`${id}-switch`}
          checked={connected}
          disabled
        />
      </div>
    </div>
  );
};
