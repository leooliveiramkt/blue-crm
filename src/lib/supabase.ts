import { createClient } from '@supabase/supabase-js';
// import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função auxiliar para verificar se o Supabase está conectado
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1).single();
    if (error) {
      console.error("Erro ao verificar conexão com Supabase:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Exceção ao verificar conexão com Supabase:", error);
    return false;
  }
};

// Tipos para as tabelas
export type Tables = {
  tenant_api_configs: {
    Row: {
      id: string;
      tenant_id: string;
      integration_id: string;
      api_key: string;
      api_url: string | null;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      tenant_id: string;
      integration_id: string;
      api_key: string;
      api_url?: string | null;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      tenant_id?: string;
      integration_id?: string;
      api_key?: string;
      api_url?: string | null;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    };
  };
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenant_api_configs: {
        Row: {
          id: string
          tenant_id: string
          provider: string
          api_url: string
          api_key: string
          store_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          provider: string
          api_url: string
          api_key: string
          store_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          provider?: string
          api_url?: string
          api_key?: string
          store_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_api_configs_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      bela_blue_configs: {
        Row: {
          id: string
          company_name: string
          wbuy_api_url: string
          wbuy_api_key: string
          wbuy_store_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          wbuy_api_url: string
          wbuy_api_key: string
          wbuy_store_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          wbuy_api_url?: string
          wbuy_api_key?: string
          wbuy_store_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      wbuy_products: {
        Row: {
          id: string
          wbuy_id: string
          tenant_id: string
          name: string
          description: string | null
          price: number
          stock: number
          status: string
          category: string | null
          images: string[]
          created_at: string
          updated_at: string
          last_sync: string
        }
        Insert: {
          id?: string
          wbuy_id: string
          tenant_id: string
          name: string
          description?: string | null
          price: number
          stock: number
          status: string
          category?: string | null
          images: string[]
          created_at?: string
          updated_at?: string
          last_sync?: string
        }
        Update: {
          id?: string
          wbuy_id?: string
          tenant_id?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          status?: string
          category?: string | null
          images?: string[]
          created_at?: string
          updated_at?: string
          last_sync?: string
        }
        Relationships: [
          {
            foreignKeyName: "wbuy_products_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      wbuy_orders: {
        Row: {
          id: string
          wbuy_id: string
          tenant_id: string
          customer_id: string
          status: string
          total: number
          payment_method: string
          shipping_address: Json
          items: Json
          created_at: string
          updated_at: string
          last_sync: string
        }
        Insert: {
          id?: string
          wbuy_id: string
          tenant_id: string
          customer_id: string
          status: string
          total: number
          payment_method: string
          shipping_address: Json
          items: Json
          created_at?: string
          updated_at?: string
          last_sync?: string
        }
        Update: {
          id?: string
          wbuy_id?: string
          tenant_id?: string
          customer_id?: string
          status?: string
          total?: number
          payment_method?: string
          shipping_address?: Json
          items?: Json
          created_at?: string
          updated_at?: string
          last_sync?: string
        }
        Relationships: [
          {
            foreignKeyName: "wbuy_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      wbuy_customers: {
        Row: {
          id: string
          wbuy_id: string
          tenant_id: string
          name: string
          email: string
          phone: string | null
          document: string | null
          address: Json | null
          created_at: string
          updated_at: string
          last_sync: string
        }
        Insert: {
          id?: string
          wbuy_id: string
          tenant_id: string
          name: string
          email: string
          phone?: string | null
          document?: string | null
          address?: Json | null
          created_at?: string
          updated_at?: string
          last_sync?: string
        }
        Update: {
          id?: string
          wbuy_id?: string
          tenant_id?: string
          name?: string
          email?: string
          phone?: string | null
          document?: string | null
          address?: Json | null
          created_at?: string
          updated_at?: string
          last_sync?: string
        }
        Relationships: [
          {
            foreignKeyName: "wbuy_customers_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      wbuy_stats: {
        Row: {
          id: string
          tenant_id: string
          date: string
          total_sales: number
          total_orders: number
          total_customers: number
          top_products: Json
          customer_acquisition: Json
          created_at: string
          updated_at: string
          last_sync: string
        }
        Insert: {
          id?: string
          tenant_id: string
          date: string
          total_sales: number
          total_orders: number
          total_customers: number
          top_products: Json
          customer_acquisition: Json
          created_at?: string
          updated_at?: string
          last_sync?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          date?: string
          total_sales?: number
          total_orders?: number
          total_customers?: number
          top_products?: Json
          customer_acquisition?: Json
          created_at?: string
          updated_at?: string
          last_sync?: string
        }
        Relationships: [
          {
            foreignKeyName: "wbuy_stats_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      wbuy_sync_status: {
        Row: {
          id: string
          tenant_id: string
          last_sync: string
          status: string
          error: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          last_sync?: string
          status: string
          error?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          last_sync?: string
          status?: string
          error?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wbuy_sync_status_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
