import { IntegrationConfig } from './types';

export const getIntegrationConfig = (integrationId: string): IntegrationConfig | null => {
  const configs: Record<string, IntegrationConfig> = {
    wbuy: {
      name: 'WBuy',
      description: 'Sistema de vendas e gestão de afiliados',
      requiredFields: [
        {
          name: 'domain',
          label: 'URL da API',
          type: 'text',
          required: true,
          placeholder: 'https://sistema.sistemawbuy.com.br/api/v1',
          defaultValue: 'https://sistema.sistemawbuy.com.br/api/v1'
        },
        {
          name: 'apiKey',
          label: 'Token de Acesso',
          type: 'password',
          required: true,
          placeholder: 'Bearer seu_token_aqui'
        },
        {
          name: 'storeId',
          label: 'ID da Loja',
          type: 'text',
          required: true,
          placeholder: 'ID da sua loja na WBuy'
        },
        {
          name: 'username',
          label: 'Usuário da API',
          type: 'text',
          required: true,
          placeholder: 'Usuário de acesso à API WBuy'
        },
        {
          name: 'password',
          label: 'Senha da API',
          type: 'password',
          required: true,
          placeholder: 'Senha de acesso à API WBuy'
        }
      ]
    },
    facebook: {
      name: 'Facebook',
      description: 'Integração com API de anúncios do Facebook',
      requiredFields: [
        {
          name: 'apiKey',
          label: 'Chave da API',
          type: 'password',
          required: true,
          placeholder: 'Sua chave da API do Facebook'
        }
      ]
    },
    activecampaign: {
      name: 'Active Campaign',
      description: 'Automação de marketing e gestão de leads',
      requiredFields: [
        {
          name: 'apiKey',
          label: 'Chave da API',
          type: 'password',
          required: true,
          placeholder: 'Sua chave da API do Active Campaign'
        },
        {
          name: 'domain',
          label: 'Domínio',
          type: 'text',
          required: true,
          placeholder: 'seu-dominio.activehosted.com'
        }
      ]
    },
    google: {
      name: 'Google Analytics',
      description: 'Análise de tráfego e conversões',
      requiredFields: [
        {
          name: 'apiKey',
          label: 'Chave da API',
          type: 'password',
          required: true,
          placeholder: 'Sua chave da API do Google Analytics'
        }
      ]
    },
    stape: {
      name: 'Stape.io',
      description: 'Servidor de tags e rastreamento',
      requiredFields: [
        {
          name: 'apiKey',
          label: 'Chave da API',
          type: 'password',
          required: true,
          placeholder: 'Sua chave da API do Stape.io'
        }
      ]
    },
    tiny: {
      name: 'Tiny',
      description: 'Sistema de gestão empresarial',
      requiredFields: [
        {
          name: 'apiKey',
          label: 'Chave da API',
          type: 'password',
          required: true,
          placeholder: 'Sua chave da API do Tiny'
        }
      ]
    },
    airtable: {
      name: 'Airtable',
      description: 'Base de dados colaborativa',
      requiredFields: [
        {
          name: 'apiKey',
          label: 'Chave da API',
          type: 'password',
          required: true,
          placeholder: 'Sua chave da API do Airtable'
        }
      ]
    }
  };

  return configs[integrationId] || null;
}; 