
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiKeyForm } from './ApiKeyForm';
import { ApiKeyFormProps } from '../types';

interface ApiSettingsContentProps {
  integrations: ApiKeyFormProps[];
}

export const ApiSettingsContent: React.FC<ApiSettingsContentProps> = ({ integrations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de API</CardTitle>
        <CardDescription>Gerencie suas chaves e tokens de API para cada integração.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {integrations.map((integration) => (
          <ApiKeyForm key={integration.id} {...integration} />
        ))}
      </CardContent>
    </Card>
  );
};
