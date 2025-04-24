
import { supabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { Tenant, TenantUser } from './types';

/**
 * Gerenciador de multi-tenancy
 */
class TenantManager {
  private static instance: TenantManager;
  private currentTenant: Tenant | null = null;
  private tenantsCache: Map<string, Tenant> = new Map();
  private userTenantsCache: Map<string, TenantUser[]> = new Map();

  private constructor() {}

  public static getInstance(): TenantManager {
    if (!TenantManager.instance) {
      TenantManager.instance = new TenantManager();
    }
    return TenantManager.instance;
  }

  /**
   * Define o tenant atual
   */
  public setCurrentTenant(tenant: Tenant): void {
    this.currentTenant = tenant;
    localStorage.setItem('currentTenantId', tenant.id);
    this.tenantsCache.set(tenant.id, tenant);
    
    // Propaga o tenantId para o gerenciador de integrações
    const { integrationManager } = require('../integrations/integrationManager');
    integrationManager.setTenantId(tenant.id);
  }

  /**
   * Retorna o tenant atual
   */
  public getCurrentTenant(): Tenant | null {
    return this.currentTenant;
  }

  /**
   * Carrega o tenant atual do localStorage ou Supabase
   */
  public async loadCurrentTenant(): Promise<Tenant | null> {
    const tenantId = localStorage.getItem('currentTenantId');
    if (!tenantId) return null;

    // Verifica o cache primeiro
    if (this.tenantsCache.has(tenantId)) {
      const tenant = this.tenantsCache.get(tenantId) || null;
      if (tenant) {
        this.currentTenant = tenant;
        return tenant;
      }
    }

    // Carrega do Supabase ou localStorage
    const tenant = await this.getTenant(tenantId);
    if (tenant) {
      this.currentTenant = tenant;
      return tenant;
    }

    return null;
  }

  /**
   * Busca um tenant pelo ID
   */
  public async getTenant(tenantId: string): Promise<Tenant | null> {
    // Verifica o cache primeiro
    if (this.tenantsCache.has(tenantId)) {
      return this.tenantsCache.get(tenantId) || null;
    }

    if (!isSupabaseConfigured) {
      // Fallback para localStorage
      const savedTenants = localStorage.getItem('tenants');
      if (savedTenants) {
        const tenants = JSON.parse(savedTenants) as Tenant[];
        const tenant = tenants.find(t => t.id === tenantId);
        if (tenant) {
          this.tenantsCache.set(tenantId, tenant);
          return tenant;
        }
      }
      return null;
    }

    try {
      const { data, error } = await supabaseClient
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (error) throw error;

      if (data) {
        const tenant = data as Tenant;
        this.tenantsCache.set(tenantId, tenant);
        return tenant;
      }
      
      return null;
    } catch (error) {
      console.error(`Erro ao buscar tenant ${tenantId}:`, error);
      return null;
    }
  }

  /**
   * Lista todos os tenants disponíveis para um usuário
   */
  public async getUserTenants(userId: string): Promise<TenantUser[]> {
    // Verifica o cache primeiro
    if (this.userTenantsCache.has(userId)) {
      return this.userTenantsCache.get(userId) || [];
    }

    if (!isSupabaseConfigured) {
      // Fallback para localStorage
      const savedTenantUsers = localStorage.getItem(`tenant_users_${userId}`);
      if (savedTenantUsers) {
        const tenantUsers = JSON.parse(savedTenantUsers) as TenantUser[];
        this.userTenantsCache.set(userId, tenantUsers);
        return tenantUsers;
      }
      return [];
    }

    try {
      const { data, error } = await supabaseClient
        .from('tenant_users')
        .select('*')
        .eq('userId', userId);

      if (error) throw error;

      if (data && data.length > 0) {
        const tenantUsers = data as TenantUser[];
        this.userTenantsCache.set(userId, tenantUsers);
        return tenantUsers;
      }
      
      return [];
    } catch (error) {
      console.error(`Erro ao buscar tenants do usuário ${userId}:`, error);
      return [];
    }
  }

  /**
   * Cria um novo tenant
   */
  public async createTenant(tenant: Partial<Tenant>): Promise<Tenant | null> {
    if (!tenant.name) {
      throw new Error('Nome do tenant é obrigatório');
    }

    const now = new Date().toISOString();
    const newTenant: Tenant = {
      id: tenant.id || `tenant_${Date.now()}`,
      name: tenant.name,
      domain: tenant.domain,
      plan: tenant.plan || 'free',
      status: tenant.status || 'active',
      createdAt: now,
      updatedAt: now,
      metadata: tenant.metadata || {},
      ownerId: tenant.ownerId,
      logo: tenant.logo,
      settings: tenant.settings || {
        theme: {
          primaryColor: '#3b82f6',
          secondaryColor: '#1e40af'
        },
        features: {},
        integrations: {}
      }
    };

    if (!isSupabaseConfigured) {
      // Salva no localStorage
      const savedTenants = localStorage.getItem('tenants');
      const tenants = savedTenants ? JSON.parse(savedTenants) as Tenant[] : [];
      tenants.push(newTenant);
      localStorage.setItem('tenants', JSON.stringify(tenants));
      
      // Se for o primeiro tenant, define como atual
      if (tenants.length === 1) {
        this.setCurrentTenant(newTenant);
      }
      
      this.tenantsCache.set(newTenant.id, newTenant);
      return newTenant;
    }

    try {
      const { data, error } = await supabaseClient
        .from('tenants')
        .insert(newTenant)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const createdTenant = data as Tenant;
        this.tenantsCache.set(createdTenant.id, createdTenant);
        return createdTenant;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao criar tenant:', error);
      return null;
    }
  }

  /**
   * Adiciona um usuário a um tenant
   */
  public async addUserToTenant(userId: string, tenantId: string, role: TenantUser['role'] = 'member'): Promise<boolean> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error(`Tenant ${tenantId} não encontrado`);
    }

    const now = new Date().toISOString();
    const tenantUser: TenantUser = {
      userId,
      tenantId,
      role,
      status: 'active',
      joinedAt: now,
      metadata: {}
    };

    if (!isSupabaseConfigured) {
      // Salva no localStorage
      const savedTenantUsers = localStorage.getItem(`tenant_users_${userId}`);
      const tenantUsers = savedTenantUsers ? JSON.parse(savedTenantUsers) as TenantUser[] : [];
      
      // Verifica se já existe
      const existingIndex = tenantUsers.findIndex(tu => tu.tenantId === tenantId);
      if (existingIndex >= 0) {
        tenantUsers[existingIndex] = tenantUser;
      } else {
        tenantUsers.push(tenantUser);
      }
      
      localStorage.setItem(`tenant_users_${userId}`, JSON.stringify(tenantUsers));
      
      // Atualiza o cache
      this.userTenantsCache.set(userId, tenantUsers);
      return true;
    }

    try {
      const { error } = await supabaseClient
        .from('tenant_users')
        .upsert(tenantUser, { onConflict: 'userId, tenantId' });

      if (error) throw error;

      // Atualiza o cache
      const cachedTenantUsers = this.userTenantsCache.get(userId) || [];
      const existingIndex = cachedTenantUsers.findIndex(tu => tu.tenantId === tenantId);
      
      if (existingIndex >= 0) {
        cachedTenantUsers[existingIndex] = tenantUser;
      } else {
        cachedTenantUsers.push(tenantUser);
      }
      
      this.userTenantsCache.set(userId, cachedTenantUsers);
      return true;
    } catch (error) {
      console.error(`Erro ao adicionar usuário ${userId} ao tenant ${tenantId}:`, error);
      return false;
    }
  }

  /**
   * Lista todos os tenants disponíveis
   */
  public async listAllTenants(): Promise<Tenant[]> {
    if (!isSupabaseConfigured) {
      // Fallback para localStorage
      const savedTenants = localStorage.getItem('tenants');
      return savedTenants ? JSON.parse(savedTenants) as Tenant[] : [];
    }

    try {
      const { data, error } = await supabaseClient
        .from('tenants')
        .select('*')
        .order('name');

      if (error) throw error;

      return data as Tenant[] || [];
    } catch (error) {
      console.error('Erro ao listar tenants:', error);
      return [];
    }
  }
}

export const tenantManager = TenantManager.getInstance();
