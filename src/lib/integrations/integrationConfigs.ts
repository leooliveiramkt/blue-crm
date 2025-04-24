
import { IntegrationConfig, IntegrationType } from './types';

/**
 * Configurações para cada tipo de integração suportada
 */
export const integrationConfigs: Record<IntegrationType, IntegrationConfig> = {
  wbuy: {
    id: 'wbuy',
    name: 'Wbuy',
    description: 'Sistema de vendas e gestão de afiliados',
    color: 'bg-blue-100 text-blue-700',
    iconName: 'shopping-cart',
    requiredFields: [
      {
        name: 'apiKey',
        label: 'Chave da API',
        type: 'password',
        placeholder: 'Insira sua chave API da Wbuy',
        required: true
      },
      {
        name: 'domain',
        label: 'Domínio',
        type: 'text',
        placeholder: 'https://seudominio.wbuy.io',
        required: true
      }
    ],
    endpoints: {
      orders: '/api/orders',
      products: '/api/products',
      affiliates: '/api/affiliates'
    }
  },
  facebook: {
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
  },
  activecampaign: {
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
  },
  google: {
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
  },
  stape: {
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
  },
  tiny: {
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
  },
  airtable: {
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
      },
      {
        name: 'tableName',
        label: 'Nome da Tabela',
        type: 'text',
        placeholder: 'Nome da tabela principal',
        required: false
      }
    ]
  }
};

/**
 * Obtém a configuração de uma integração específica
 */
export const getIntegrationConfig = (integrationId: IntegrationType): IntegrationConfig | null => {
  return integrationConfigs[integrationId] || null;
};

/**
 * Lista todas as integrações disponíveis
 */
export const getAllIntegrationConfigs = (): IntegrationConfig[] => {
  return Object.values(integrationConfigs);
};
