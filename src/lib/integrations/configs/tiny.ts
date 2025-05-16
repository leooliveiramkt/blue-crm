
import { IntegrationConfig } from '../types';

export const tinyConfig: IntegrationConfig = {
  id: 'tiny',
  name: 'Tiny',
  description: 'Sistema de gestão empresarial',
  color: 'bg-pink-100 text-pink-700',
  iconName: 'archive',
  requiredFields: [
    {
      name: 'token',
      label: 'Token da API',
      type: 'password',
      placeholder: 'Token da API do Tiny',
      required: true
    },
    {
      name: 'format',
      label: 'Formato de Resposta',
      type: 'text',
      placeholder: 'JSON',
      required: false
    }
  ]
};
