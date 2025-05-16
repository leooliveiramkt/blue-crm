
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface IntegrationHeaderProps {
  name: string;
  description: string;
  isConnected: boolean;
  onConfigure: () => void;
}

export const IntegrationHeader: React.FC<IntegrationHeaderProps> = ({
  name,
  description,
  isConnected,
  onConfigure
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <Button
        variant={isConnected ? "outline" : "default"}
        onClick={onConfigure}
      >
        {isConnected ? "Reconfigurar" : "Conectar"}
      </Button>
    </div>
  );
};
