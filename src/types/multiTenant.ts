// 🏢 BLUE CRM - TIPOS MULTI-TENANT
// Hierarquia definida por Léo Oliveira

/**
 * 👑 HIERARQUIA DE USUÁRIOS OFICIAL:
 * 
 * 1. SUPER ADMIN (leooliveiramktd@gmail.com)
 *    - Altera TUDO em TODAS as empresas
 *    - Gerencia APIs de qualquer tenant
 *    - Acesso completo ao sistema
 * 
 * 2. ADMIN EMPRESA (por tenant)
 *    - Altera dados da própria empresa
 *    - Cadastra/edita APIs da própria empresa
 *    - Gerencia usuários da empresa
 * 
 * 3. ADMIN (CRM Geral)
 *    - Cadastro geral e edição no CRM
 *    - SEM acesso a dados de API
 *    - Operações administrativas básicas
 * 
 * 4. DIRETOR
 *    - Cadastro de afiliados
 *    - Cadastro de novas promoções
 *    - SEM acesso a API
 * 
 * 5. SUPERVISOR
 *    - Edição básica no sistema
 *    - SEM acesso a API
 *    - Supervisão operacional
 * 
 * 6. AUXILIAR
 *    - SOMENTE consulta de dados e relatórios
 *    - SEM qualquer alteração
 *    - Acesso read-only
 */

export type UserRole = 
  | 'super_admin'      // Você - acesso total a tudo
  | 'admin_empresa'    // Admin da empresa - APIs + dados empresa
  | 'admin'            // Admin CRM - sem APIs
  | 'diretor'          // Afiliados + promoções - sem APIs  
  | 'supervisor'       // Edição básica - sem APIs
  | 'auxiliar';        // Somente consulta

export type AccessLevel = 
  | 'full'             // Acesso completo (Super Admin)
  | 'company_admin'    // Admin da empresa (APIs + dados)
  | 'admin_crm'        // Admin CRM (sem APIs)
  | 'operational'      // Diretor/Supervisor (operacional)
  | 'read_only';       // Auxiliar (apenas consulta)

/**
 * Permissões detalhadas por role
 */
export interface RolePermissions {
  // === DADOS E CRM ===
  can_view_data: boolean;
  can_edit_general_data: boolean;
  can_delete_data: boolean;
  can_export_data: boolean;
  
  // === APIS ===
  can_view_api_configs: boolean;
  can_edit_api_configs: boolean;
  can_test_apis: boolean;
  
  // === USUÁRIOS ===
  can_view_users: boolean;
  can_create_users: boolean;
  can_edit_users: boolean;
  can_delete_users: boolean;
  
  // === ESPECÍFICOS POR ROLE ===
  can_manage_affiliates: boolean;    // Diretor+
  can_create_promotions: boolean;    // Diretor+
  can_supervise_operations: boolean; // Supervisor+
  
  // === RELATÓRIOS ===
  can_view_reports: boolean;
  can_create_reports: boolean;
  can_schedule_reports: boolean;
  
  // === BELA BLUE ===
  can_view_bela_blue: boolean;
  
  // === SISTEMA ===
  can_access_admin_panel: boolean;
  can_manage_tenants: boolean;       // Só Super Admin
}

export interface WBuyConfig {
  url: string;
  token: string;
  store_id: string;
  enabled: boolean;
}

export interface TinyConfig {
  url: string;
  token: string;
  enabled: boolean;
}

export interface ActiveCampaignConfig {
  url: string;
  key: string;
  enabled: boolean;
}

export interface TenantAPIs {
  wbuy?: WBuyConfig;
  tiny?: TinyConfig;
  activecampaign?: ActiveCampaignConfig;
}

export interface TenantConfig {
  tenant_id: string;
  company_name: string;
  is_master: boolean;
  is_active: boolean;
  apis: TenantAPIs;
  access_bela_blue: boolean;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  created_at: Date;
  updated_at: Date;
}

export interface UserPermissions {
  id: string;
  user_id: string;
  tenant_id: string;
  role: UserRole;
  permissions: RolePermissions;
  access_level: AccessLevel;
  created_at: Date;
  updated_at: Date;
}

export interface UserSession {
  user_id: string;
  email: string;
  tenant_id: string;
  role: UserRole;
  permissions: RolePermissions;
  can_access_bela_blue: boolean;
  is_super_admin: boolean;
  access_level: AccessLevel;
}

export interface BelaBlueSharedData {
  monthly_sales: number;
  total_orders: number;
  avg_order_value: number;
  conversion_rate: number;
  top_products: Array<{
    product_name: string;
    category: string;
    sales_volume: number;
  }>;
  market_insights: Array<{
    title: string;
    description: string;
    impact_score: number;
  }>;
}

/**
 * Factory para criar permissões baseadas no role
 */
export const createRolePermissions = (role: UserRole): RolePermissions => {
  const basePermissions: RolePermissions = {
    can_view_data: false,
    can_edit_general_data: false,
    can_delete_data: false,
    can_export_data: false,
    can_view_api_configs: false,
    can_edit_api_configs: false,
    can_test_apis: false,
    can_view_users: false,
    can_create_users: false,
    can_edit_users: false,
    can_delete_users: false,
    can_manage_affiliates: false,
    can_create_promotions: false,
    can_supervise_operations: false,
    can_view_reports: false,
    can_create_reports: false,
    can_schedule_reports: false,
    can_view_bela_blue: true, // Todos veem Bela Blue por padrão
    can_access_admin_panel: false,
    can_manage_tenants: false,
  };

  switch (role) {
    case 'super_admin':
      // 👑 SUPER ADMIN - TUDO LIBERADO
      return {
        ...basePermissions,
        can_view_data: true,
        can_edit_general_data: true,
        can_delete_data: true,
        can_export_data: true,
        can_view_api_configs: true,
        can_edit_api_configs: true,
        can_test_apis: true,
        can_view_users: true,
        can_create_users: true,
        can_edit_users: true,
        can_delete_users: true,
        can_manage_affiliates: true,
        can_create_promotions: true,
        can_supervise_operations: true,
        can_view_reports: true,
        can_create_reports: true,
        can_schedule_reports: true,
        can_access_admin_panel: true,
        can_manage_tenants: true,
      };

    case 'admin_empresa':
      // 🏢 ADMIN EMPRESA - APIs + dados da empresa
      return {
        ...basePermissions,
        can_view_data: true,
        can_edit_general_data: true,
        can_delete_data: true,
        can_export_data: true,
        can_view_api_configs: true,
        can_edit_api_configs: true,
        can_test_apis: true,
        can_view_users: true,
        can_create_users: true,
        can_edit_users: true,
        can_manage_affiliates: true,
        can_create_promotions: true,
        can_supervise_operations: true,
        can_view_reports: true,
        can_create_reports: true,
        can_schedule_reports: true,
      };

    case 'admin':
      // 🔧 ADMIN CRM - sem APIs
      return {
        ...basePermissions,
        can_view_data: true,
        can_edit_general_data: true,
        can_export_data: true,
        can_view_users: true,
        can_create_users: true,
        can_edit_users: true,
        can_manage_affiliates: true,
        can_supervise_operations: true,
        can_view_reports: true,
        can_create_reports: true,
      };

    case 'diretor':
      // 👔 DIRETOR - afiliados + promoções
      return {
        ...basePermissions,
        can_view_data: true,
        can_edit_general_data: true,
        can_export_data: true,
        can_manage_affiliates: true,
        can_create_promotions: true,
        can_view_reports: true,
        can_create_reports: true,
      };

    case 'supervisor':
      // 📊 SUPERVISOR - edição básica
      return {
        ...basePermissions,
        can_view_data: true,
        can_edit_general_data: true,
        can_supervise_operations: true,
        can_view_reports: true,
      };

    case 'auxiliar':
      // 👀 AUXILIAR - somente consulta
      return {
        ...basePermissions,
        can_view_data: true,
        can_view_reports: true,
      };

    default:
      return basePermissions;
  }
}; 