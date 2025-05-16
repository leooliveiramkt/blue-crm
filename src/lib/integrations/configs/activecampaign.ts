
import { IntegrationConfig } from '../types';

export const activecampaignConfig: IntegrationConfig = {
  id: 'activecampaign',
  name: 'Active Campaign',
  description: 'Automação de marketing e gestão de leads',
  color: 'bg-green-100 text-green-700',
  iconName: 'mail',
  requiredFields: [
    {
      name: 'apiUrl',
      label: 'URL da API',
      type: 'url',
      placeholder: 'https://youraccount.api-us1.com',
      required: true
    },
    {
      name: 'apiKey',
      label: 'Chave da API',
      type: 'password',
      placeholder: 'Chave da API do Active Campaign',
      required: true
    }
  ]
};
