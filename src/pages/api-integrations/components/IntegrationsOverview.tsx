
import React from 'react';
import { IntegrationCard } from './IntegrationCard';
import { IntegrationCardProps } from '../types';

interface IntegrationsOverviewProps {
  integrations: IntegrationCardProps[];
}

export const IntegrationsOverview: React.FC<IntegrationsOverviewProps> = ({ integrations }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          {...integration}
        />
      ))}
    </div>
  );
};
