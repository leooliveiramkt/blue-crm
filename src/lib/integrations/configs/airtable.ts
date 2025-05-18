
import { IntegrationConfig } from '../types';

export const airtableConfig: IntegrationConfig = {
  id: 'airtable',
  name: 'Airtable',
  description: 'Base de dados colaborativa',
  color: 'bg-green-100 text-green-700',
  iconName: 'database',
  requiredFields: [
    {
      name: 'apiKey',
      label: 'Chave da API',
      type: 'password',
      placeholder: 'Chave da API do Airtable',
      required: true
    },
    {
      name: 'baseId',
      label: 'ID da Base',
      type: 'text',
      placeholder: 'ID da base do Airtable',
      required: true
    }
  ]
};
