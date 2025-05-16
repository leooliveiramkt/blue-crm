
import { IntegrationConfig } from '../types';

export const facebookConfig: IntegrationConfig = {
  id: 'facebook',
  name: 'Facebook',
  description: 'Integração com API de anúncios do Facebook',
  color: 'bg-blue-100 text-blue-700',
  iconName: 'facebook',
  requiredFields: [
    {
      name: 'accessToken',
      label: 'Token de Acesso',
      type: 'password',
      placeholder: 'Token de acesso do Facebook',
      required: true
    },
    {
      name: 'adAccountId',
      label: 'ID da Conta de Anúncios',
      type: 'text',
      placeholder: 'act_123456789',
      required: true
    }
  ]
};
