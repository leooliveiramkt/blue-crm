
import { IntegrationConfig } from '../types';

export const stapeConfig: IntegrationConfig = {
  id: 'stape',
  name: 'Stape.io',
  description: 'Servidor de tags e rastreamento',
  color: 'bg-purple-100 text-purple-700',
  iconName: 'globe',
  requiredFields: [
    {
      name: 'apiKey',
      label: 'Chave da API',
      type: 'password',
      placeholder: 'Chave da API do Stape',
      required: true
    },
    {
      name: 'containerId',
      label: 'ID do Container',
      type: 'text',
      placeholder: 'ID do container do Stape',
      required: true
    }
  ]
};
