
import { IntegrationType } from '@/lib/integrations/types';

export interface IntegrationCardProps {
  id: IntegrationType;
  name: string;
  description: string;
  color: string;
  connected: boolean;
  lastSync?: string;
  syncStatus?: string;
  onConnect: (integrationId: IntegrationType) => void;
}

export interface ApiKeyFormProps {
  id: IntegrationType;
  name: string;
  connected: boolean;
  defaultValue: string;
  onSave: (integrationId: IntegrationType, apiKey: string) => void;
}
