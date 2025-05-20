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
          metadata: Json
          last_sync_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          wbuy_id: string
          tenant_id: string
          name: string
          description?: string | null
          price: number
          stock: number
          status: string
          category?: string | null
          images: string[]
          metadata: Json
          last_sync_at: string
          created_at?: string
          updated_at?: string
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
          metadata?: Json
          last_sync_at?: string
          created_at?: string
          updated_at?: string
        }
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
          metadata: Json
          last_sync_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          wbuy_id: string
          tenant_id: string
          customer_id: string
          status: string
          total: number
          payment_method: string
          shipping_address: Json
          items: Json
          metadata: Json
          last_sync_at: string
          created_at?: string
          updated_at?: string
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
          metadata?: Json
          last_sync_at?: string
          created_at?: string
          updated_at?: string
        }
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
          metadata: Json
          last_sync_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          wbuy_id: string
          tenant_id: string
          name: string
          email: string
          phone?: string | null
          document?: string | null
          address?: Json | null
          metadata: Json
          last_sync_at: string
          created_at?: string
          updated_at?: string
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
          metadata?: Json
          last_sync_at?: string
          created_at?: string
          updated_at?: string
        }
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
          metadata: Json
          updated_at: string
          created_at: string
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
          metadata: Json
          updated_at: string
          created_at?: string
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
          metadata?: Json
          updated_at?: string
          created_at?: string
        }
      }
      wbuy_sync_status: {
        Row: {
          id: string
          tenant_id: string
          entity_type: string
          status: string
          error: string | null
          last_sync_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          entity_type: string
          status: string
          error?: string | null
          last_sync_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          entity_type?: string
          status?: string
          error?: string | null
          last_sync_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      wbuy_sync_errors: {
        Row: {
          id: string
          tenant_id: string
          entity_type: string
          error: string
          stack: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          entity_type: string
          error: string
          stack?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          entity_type?: string
          error?: string
          stack?: string | null
          created_at?: string
        }
      }
      wbuy_integrations: {
        Row: {
          id: string;
          empresa: string;
          owner_email: string;
          api_url: string;
          authorization: string;
          store_id: string;
          api_user: string;
          api_password: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          empresa: string;
          owner_email: string;
          api_url: string;
          authorization: string;
          store_id: string;
          api_user: string;
          api_password: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          empresa?: string;
          owner_email?: string;
          api_url?: string;
          authorization?: string;
          store_id?: string;
          api_user?: string;
          api_password?: string;
          created_at?: string;
          updated_at?: string;
        };
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