
import { IntegrationConfig } from '../types';

export const wbuyConfig: IntegrationConfig = {
  id: 'wbuy',
  name: 'Wbuy',
  description: 'Sistema de vendas e gestão de afiliados',
  color: 'bg-blue-100 text-blue-700',
  iconName: 'shopping-cart',
  requiredFields: [
    {
      name: 'apiKey',
      label: 'Authorization (Bearer Token)',
      type: 'password',
      placeholder: 'Bearer ZjlkMWNkMGUtMjgyNi00Yjc5LTg5N2ItYTIxNjljY2Y3ZjllOmI3ZDU3...',
      required: true
    },
    {
      name: 'storeId',
      label: 'ID da Loja',
      type: 'text',
      placeholder: 'ID da sua loja na Wbuy (formato UUID)',
      required: true
    },
    {
      name: 'username',
      label: 'Usuário da API',
      type: 'text',
      placeholder: 'Nome de usuário da API',
      required: true
    },
    {
      name: 'password',
      label: 'Senha da API',
      type: 'password',
      placeholder: 'Senha da API',
      required: true
    },
    {
      name: 'domain',
      label: 'Endpoint da API',
      type: 'text',
      placeholder: 'https://sistema.sistemawbuy.com.br/api/v1',
      required: true,
      defaultValue: 'https://sistema.sistemawbuy.com.br/api/v1'
    }
  ],
  // Endpoints conforme documentação da API Wbuy
  endpoints: {
    // Produtos
    products: 'products',
    productDetail: 'products',
    categories: 'categories',
    
    // Pedidos
    orders: 'orders',
    orderDetail: 'orders',
    
    // Afiliados
    affiliates: 'affiliates',
    affiliateDetail: 'affiliates',
    affiliateCommissions: 'affiliates/commissions',
    
    // Comissões
    commissions: 'commissions',
    
    // Financeiro
    payments: 'payments',
    invoices: 'invoices',
    
    // Leads
    leads: 'leads',
    
    // Configurações
    settings: 'settings',
    
    // Usuários
    users: 'users',
    userDetail: 'users',
    
    // Dashboard e Relatórios
    dashboard: 'dashboard',
    reports: 'reports',
    
    // Webhooks e Integrações
    webhooks: 'webhooks',
    integrations: 'integrations',
    
    // Notificações
    notifications: 'notifications'
  }
};
