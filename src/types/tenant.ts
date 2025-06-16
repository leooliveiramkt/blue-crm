// ========================================
// 🏢 BLUE CRM - TIPOS MULTI-TENANT
// ========================================

/**
 * Tipos de usuários no sistema hierárquico
 */
export type UserRole = 
  | 'super_admin'    // Proprietário (você)
  | 'tenant_admin'   // Admin da empresa cliente
  | 'director'       // Diretor da empresa
  | 'manager'        // Gerente da empresa
  | 'employee'       // Funcionário da empresa
  | 'view_only';     // Apenas visualização

/**
 * Níveis de acesso aos dados
 */
export type AccessLevel = 
  | 'full'           // Acesso completo
  | 'limited'        // Acesso limitado
  | 'read_only'      // Apenas leitura
  | 'none';          // Sem acesso

/**
 * Configuração de API WBuy
 */
export interface WBuyConfig {
  url: string;
  token: string;
  store_id: string;
  enabled: boolean;
}

/**
 * Configuração de API Tiny
 */
export interface TinyConfig {
  url: string;
  token: string;
  enabled: boolean;
}

/**
 * Configuração de API Active Campaign
 */
export interface ActiveCampaignConfig {
  url: string;
  key: string;
  enabled: boolean;
}

/**
 * Configuração de API Google Analytics
 */
export interface GoogleAnalyticsConfig {
  tracking_id: string;
  view_id: string;
  enabled: boolean;
}

/**
 * Configuração de API Facebook Ads
 */
export interface FacebookAdsConfig {
  access_token: string;
  ad_account_id: string;
  enabled: boolean;
}

/**
 * Configuração de API Stape
 */
export interface StapeConfig {
  url: string;
  key: string;
  enabled: boolean;
}

/**
 * Configuração de APIs por tenant
 */
export interface TenantAPIs {
  wbuy?: WBuyConfig;
  tiny?: TinyConfig;
  activecampaign?: ActiveCampaignConfig;
  google_analytics?: GoogleAnalyticsConfig;
  facebook_ads?: FacebookAdsConfig;
  stape?: StapeConfig;
}

/**
 * Configuração de branding personalizado
 */
export interface CustomBranding {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  company_name: string;
  favicon_url?: string;
  custom_css?: string;
}

/**
 * Configuração de tenant
 */
export interface TenantConfig {
  tenant_id: string;
  company_name: string;
  is_master: boolean;
  is_active: boolean;
  apis: TenantAPIs;
  access_bela_blue: boolean;
  custom_branding?: CustomBranding;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  trial_ends_at?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Permissões de usuário
 */
export interface UserPermissions {
  id: string;
  user_id: string;
  tenant_id: string;
  role: UserRole;
  can_view_bela_blue: boolean;
  can_edit_apis: boolean;
  can_manage_users: boolean;
  can_view_analytics: boolean;
  can_export_data: boolean;
  can_configure_integrations: boolean;
  access_level: AccessLevel;
  created_at: Date;
  updated_at: Date;
}

/**
 * Sessão de usuário com contexto multi-tenant
 */
export interface UserSession {
  user_id: string;
  email: string;
  tenant_id: string;
  role: UserRole;
  permissions: UserPermissions;
  can_access_bela_blue: boolean;
  available_tenants: string[]; // Para super admin
  is_super_admin: boolean;
}

/**
 * Dados compartilhados da Bela Blue
 */
export interface BelaBlueSharedData {
  // Métricas agregadas (sem dados sensíveis)
  monthly_sales: number;
  total_orders: number;
  avg_order_value: number;
  conversion_rate: number;
  customer_retention: number;
  
  // Top produtos (anonimizados)
  top_products: Array<{
    product_name: string;
    category: string;
    sales_volume: number;
    revenue: number;
  }>;
  
  // Insights de mercado
  market_insights: Array<{
    insight_type: 'trend' | 'opportunity' | 'challenge';
    title: string;
    description: string;
    impact_score: number;
    date: Date;
  }>;
  
  // Melhores práticas
  best_practices: Array<{
    category: 'marketing' | 'sales' | 'customer_service' | 'operations';
    title: string;
    description: string;
    success_rate: number;
  }>;
  
  // Benchmarks de performance
  performance_benchmarks: {
    email_open_rate: number;
    click_through_rate: number;
    social_engagement_rate: number;
    customer_satisfaction: number;
  };
}

/**
 * Configuração de compartilhamento de dados
 */
export interface DataSharingConfig {
  share_sales_data: boolean;
  share_product_data: boolean;
  share_customer_insights: boolean;
  share_marketing_metrics: boolean;
  anonymization_level: 'none' | 'basic' | 'full';
  data_retention_days: number;
}

/**
 * Dados de dashboard multi-tenant
 */
export interface MultiTenantDashboard {
  tenant_data: {
    // Dados específicos do tenant
    sales: number;
    orders: number;
    customers: number;
    revenue: number;
  };
  
  bela_blue_data?: BelaBlueSharedData;
  
  comparative_analysis?: {
    performance_vs_bela_blue: {
      sales_comparison: number; // Percentual
      orders_comparison: number;
      customer_growth_comparison: number;
    };
    industry_position: 'above_average' | 'average' | 'below_average';
    improvement_suggestions: string[];
  };
}

/**
 * Filtros para consulta de dados
 */
export interface TenantDataFilter {
  tenant_id?: string;
  include_bela_blue?: boolean;
  date_range?: {
    start: Date;
    end: Date;
  };
  data_types?: Array<'sales' | 'products' | 'customers' | 'marketing'>;
  role_based_filter?: boolean;
}

/**
 * Resposta de API com contexto multi-tenant
 */
export interface TenantAPIResponse<T> {
  data: T;
  tenant_id: string;
  includes_bela_blue_data: boolean;
  user_role: UserRole;
  access_level: AccessLevel;
  cache_key?: string;
  expires_at?: Date;
}

/**
 * Configuração de onboarding para novos tenants
 */
export interface TenantOnboarding {
  step: 'company_info' | 'api_setup' | 'user_invites' | 'data_access' | 'completed';
  company_info?: {
    name: string;
    industry: string;
    size: 'small' | 'medium' | 'large';
    country: string;
  };
  api_preferences?: {
    required_apis: string[];
    optional_apis: string[];
  };
  user_setup?: {
    admin_email: string;
    team_size: number;
    roles_needed: UserRole[];
  };
  data_preferences?: {
    enable_bela_blue_access: boolean;
    anonymization_preference: 'basic' | 'full';
  };
  completed_at?: Date;
}

/**
 * Webhook para sincronização de dados
 */
export interface TenantWebhook {
  id: string;
  tenant_id: string;
  event_type: 'data_sync' | 'user_update' | 'api_change' | 'billing_update';
  url: string;
  is_active: boolean;
  secret_key: string;
  last_triggered?: Date;
  retry_count: number;
}

/**
 * Log de auditoria multi-tenant
 */
export interface TenantAuditLog {
  id: string;
  tenant_id: string;
  user_id: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  timestamp: Date;
}

/**
 * Configuração de limites por tenant
 */
export interface TenantLimits {
  max_users: number;
  max_api_calls_per_month: number;
  max_data_retention_days: number;
  max_webhooks: number;
  features_enabled: string[];
  storage_limit_gb: number;
}

/**
 * Status de saúde do tenant
 */
export interface TenantHealth {
  tenant_id: string;
  status: 'healthy' | 'warning' | 'critical';
  api_status: Record<string, 'connected' | 'error' | 'disabled'>;
  last_sync: Record<string, Date>;
  user_activity: {
    active_users_today: number;
    total_users: number;
  };
  data_freshness: {
    oldest_record: Date;
    newest_record: Date;
  };
  issues: Array<{
    type: 'api_error' | 'data_stale' | 'user_inactive' | 'billing_issue';
    message: string;
    severity: 'low' | 'medium' | 'high';
    occurred_at: Date;
  }>;
}

export default {
  UserRole,
  AccessLevel,
  TenantConfig,
  UserPermissions,
  UserSession,
  BelaBlueSharedData,
  MultiTenantDashboard,
  TenantAPIResponse,
  TenantOnboarding,
  TenantHealth
}; 