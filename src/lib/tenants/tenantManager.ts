import { createClient } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface TenantUser {
  tenant_id: string;
  user_id: string;
  role: string;
  created_at?: string;
}

// Implementação do gerenciador de tenants
class TenantManager {
  private storageKey = 'current_tenant';

  // Carrega o tenant atual do localStorage
  async loadCurrentTenant(): Promise<Tenant | null> {
    try {
      const storedTenant = localStorage.getItem(this.storageKey);
      if (storedTenant) {
        return JSON.parse(storedTenant);
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar tenant do localStorage:', error);
      return null;
    }
  }

  // Define o tenant atual no localStorage
  setCurrentTenant(tenant: Tenant): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tenant));
  }

  // Obtém um tenant específico pelo ID
  async getTenant(tenantId: string): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (error) throw error;
      return data as Tenant;
    } catch (error) {
      console.error('Erro ao buscar tenant:', error);
      return null;
    }
  }

  // Cria um novo tenant
  async createTenant(tenant: Partial<Tenant>): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert([tenant])
        .select()
        .single();

      if (error) throw error;
      return data as Tenant;
    } catch (error) {
      console.error('Erro ao criar tenant:', error);
      return null;
    }
  }

  // Adiciona um usuário a um tenant
  async addUserToTenant(userId: string, tenantId: string, role: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tenant_users')
        .insert([{ tenant_id: tenantId, user_id: userId, role }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao adicionar usuário ao tenant:', error);
      return false;
    }
  }

  // Obtém todos os tenants de um usuário específico
  async getUserTenants(userId: string): Promise<Tenant[]> {
    try {
      const { data, error } = await supabase
        .from('tenant_users')
        .select('tenant_id')
        .eq('user_id', userId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      const tenantIds = data.map((item: TenantUser) => item.tenant_id);
      
      const { data: tenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .in('id', tenantIds);

      if (tenantsError) throw tenantsError;

      return tenants as Tenant[];
    } catch (error) {
      console.error('Erro ao buscar tenants do usuário:', error);
      return [];
    }
  }

  // Remove usuário de um tenant
  async removeUserFromTenant(userId: string, tenantId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tenant_users')
        .delete()
        .eq('tenant_id', tenantId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao remover usuário do tenant:', error);
      return false;
    }
  }
}

// Exporta uma instância única do TenantManager
export const tenantManager = new TenantManager(); 