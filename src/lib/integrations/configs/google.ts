
import { IntegrationConfig } from '../types';

export const googleConfig: IntegrationConfig = {
  id: 'google',
  name: 'Google Analytics',
  description: 'Análise de tráfego e conversões',
  color: 'bg-yellow-100 text-yellow-700',
  iconName: 'bar-chart-3',
  requiredFields: [
    {
      name: 'measurementId',
      label: 'ID de medição',
      type: 'text',
      placeholder: 'G-XXXXXXXXXX',
      required: true
    },
    {
      name: 'apiSecret',
      label: 'Segredo da API',
      type: 'password',
      placeholder: 'Segredo da API do GA4',
      required: false
    }
  ]
};
