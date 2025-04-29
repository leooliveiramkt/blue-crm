export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      affiliates: {
        Row: {
          affiliate_code: string | null
          affiliate_link: string | null
          attends_mentoring: boolean | null
          campaign_participation: string[] | null
          content_type: string[] | null
          created_at: string
          email: string
          experience_level: string | null
          feedback: string | null
          full_name: string
          id: string
          in_support_groups: boolean | null
          interested_in_upgrade: boolean | null
          internal_ranking: number | null
          last_contact_date: string | null
          last_sale_date: string | null
          location: string | null
          promoted_products: string[] | null
          received_initial_training: boolean | null
          registration_date: string
          reported_issues: string | null
          social_media: string | null
          status: string | null
          support_provided: string | null
          target_reached: boolean | null
          updated_at: string
          user_id: string | null
          username: string | null
          whatsapp: string | null
        }
        Insert: {
          affiliate_code?: string | null
          affiliate_link?: string | null
          attends_mentoring?: boolean | null
          campaign_participation?: string[] | null
          content_type?: string[] | null
          created_at?: string
          email: string
          experience_level?: string | null
          feedback?: string | null
          full_name: string
          id?: string
          in_support_groups?: boolean | null
          interested_in_upgrade?: boolean | null
          internal_ranking?: number | null
          last_contact_date?: string | null
          last_sale_date?: string | null
          location?: string | null
          promoted_products?: string[] | null
          received_initial_training?: boolean | null
          registration_date?: string
          reported_issues?: string | null
          social_media?: string | null
          status?: string | null
          support_provided?: string | null
          target_reached?: boolean | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
          whatsapp?: string | null
        }
        Update: {
          affiliate_code?: string | null
          affiliate_link?: string | null
          attends_mentoring?: boolean | null
          campaign_participation?: string[] | null
          content_type?: string[] | null
          created_at?: string
          email?: string
          experience_level?: string | null
          feedback?: string | null
          full_name?: string
          id?: string
          in_support_groups?: boolean | null
          interested_in_upgrade?: boolean | null
          internal_ranking?: number | null
          last_contact_date?: string | null
          last_sale_date?: string | null
          location?: string | null
          promoted_products?: string[] | null
          received_initial_training?: boolean | null
          registration_date?: string
          reported_issues?: string | null
          social_media?: string | null
          status?: string | null
          support_provided?: string | null
          target_reached?: boolean | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          created_at: string
          credentials: Json
          id: string
          last_sync: string | null
          metadata: Json | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at: string
          credentials: Json
          id: string
          last_sync?: string | null
          metadata?: Json | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Update: {
          created_at?: string
          credentials?: Json
          id?: string
          last_sync?: string | null
          metadata?: Json | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          affiliate_id: string
          commission_amount: number
          created_at: string
          id: string
          platform: string
          product_name: string
          product_type: string
          sale_amount: number
          sale_date: string
        }
        Insert: {
          affiliate_id: string
          commission_amount: number
          created_at?: string
          id?: string
          platform: string
          product_name: string
          product_type: string
          sale_amount: number
          sale_date?: string
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          created_at?: string
          id?: string
          platform?: string
          product_name?: string
          product_type?: string
          sale_amount?: number
          sale_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "monthly_ranking"
            referencedColumns: ["affiliate_id"]
          },
          {
            foreignKeyName: "sales_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "overall_ranking"
            referencedColumns: ["affiliate_id"]
          },
          {
            foreignKeyName: "sales_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "weekly_digital_ranking"
            referencedColumns: ["affiliate_id"]
          },
          {
            foreignKeyName: "sales_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "weekly_physical_ranking"
            referencedColumns: ["affiliate_id"]
          },
        ]
      }
      theme_config: {
        Row: {
          config: Json
          created_at: string | null
          id: number
        }
        Insert: {
          config: Json
          created_at?: string | null
          id?: number
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      monthly_ranking: {
        Row: {
          affiliate_id: string | null
          full_name: string | null
          product_type: string | null
          total_commission: number | null
          total_sale_amount: number | null
          total_sales: number | null
        }
        Relationships: []
      }
      overall_ranking: {
        Row: {
          affiliate_id: string | null
          full_name: string | null
          product_type: string | null
          total_commission: number | null
          total_sale_amount: number | null
          total_sales: number | null
        }
        Relationships: []
      }
      weekly_digital_ranking: {
        Row: {
          affiliate_id: string | null
          full_name: string | null
          total_commission: number | null
          total_sale_amount: number | null
          total_sales: number | null
        }
        Relationships: []
      }
      weekly_physical_ranking: {
        Row: {
          affiliate_id: string | null
          full_name: string | null
          total_commission: number | null
          total_sale_amount: number | null
          total_sales: number | null
        }
        Relationships: []
      }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
