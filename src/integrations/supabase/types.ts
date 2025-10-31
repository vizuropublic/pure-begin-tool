export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          additional_context: Json | null
          changes: Json | null
          created_at: string | null
          id: number
          ip_address: unknown
          location: Json | null
          new_value: Json | null
          old_value: Json | null
          operation_timestamp: string | null
          record_id: number | null
          session_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          additional_context?: Json | null
          changes?: Json | null
          created_at?: string | null
          id?: never
          ip_address?: unknown
          location?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          operation_timestamp?: string | null
          record_id?: number | null
          session_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          additional_context?: Json | null
          changes?: Json | null
          created_at?: string | null
          id?: never
          ip_address?: unknown
          location?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          operation_timestamp?: string | null
          record_id?: number | null
          session_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          comment: string | null
          created_at: string
          est_price: number
          family: string
          id: string
          location: string
          make: string | null
          name: string
          possibility: string
          remark: string | null
          seller_id: string | null
          source: string
          status: Database["public"]["Enums"]["inventory_status"]
          subcategory: string | null
          type: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          est_price: number
          family: string
          id?: string
          location: string
          make?: string | null
          name: string
          possibility: string
          remark?: string | null
          seller_id?: string | null
          source: string
          status?: Database["public"]["Enums"]["inventory_status"]
          subcategory?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          est_price?: number
          family?: string
          id?: string
          location?: string
          make?: string | null
          name?: string
          possibility?: string
          remark?: string | null
          seller_id?: string | null
          source?: string
          status?: Database["public"]["Enums"]["inventory_status"]
          subcategory?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_photo: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          file_name: string
          file_path: string
          file_type: string | null
          id: number
          inventory_id: string
          is_primary: boolean | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_type?: string | null
          id?: never
          inventory_id: string
          is_primary?: boolean | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_type?: string | null
          id?: never
          inventory_id?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventory"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_photo_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          inventory_id: string
          order_id: string
          quantity: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_id: string
          order_id: string
          quantity?: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          inventory_id?: string
          order_id?: string
          quantity?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_items_inventory"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cancellation_reason: string[] | null
          delivery_address: string | null
          delivery_name: string | null
          id: string
          items_number: number | null
          order_number: string
          ordering_staff: string
          ordering_time: string
          seller_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number | null
          total_quantity: number | null
          update_time: string
        }
        Insert: {
          cancellation_reason?: string[] | null
          delivery_address?: string | null
          delivery_name?: string | null
          id?: string
          items_number?: number | null
          order_number: string
          ordering_staff: string
          ordering_time?: string
          seller_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number | null
          total_quantity?: number | null
          update_time?: string
        }
        Update: {
          cancellation_reason?: string[] | null
          delivery_address?: string | null
          delivery_name?: string | null
          id?: string
          items_number?: number | null
          order_number?: string
          ordering_staff?: string
          ordering_time?: string
          seller_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number | null
          total_quantity?: number | null
          update_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_ordering_staff_fkey"
            columns: ["ordering_staff"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          created_at: string
          email: string
          field: string | null
          full_name: string
          id: string
          identify: string | null
          last_login: string | null
          passcode: string | null
          phone_number: string | null
          position: string | null
          privilege: string | null
          role: string | null
          status: boolean | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          field?: string | null
          full_name: string
          id?: string
          identify?: string | null
          last_login?: string | null
          passcode?: string | null
          phone_number?: string | null
          position?: string | null
          privilege?: string | null
          role?: string | null
          status?: boolean | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          field?: string | null
          full_name?: string
          id?: string
          identify?: string | null
          last_login?: string | null
          passcode?: string | null
          phone_number?: string | null
          position?: string | null
          privilege?: string | null
          role?: string | null
          status?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      order_items_inventory: {
        Row: {
          buyer: string | null
          family: string | null
          make: string | null
          name: string | null
          order_id: string | null
          order_number: string | null
          ordering_staff: string | null
          seller: string | null
          seller_id: string | null
          type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_ordering_staff_fkey"
            columns: ["ordering_staff"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_monthly_growth: {
        Args: { p_date: string }
        Returns: {
          current_total: number
          growth_rate_percent: number
          previous_total: number
        }[]
      }
      get_current_monthly_inventory_total: { Args: never; Returns: number }
      get_distinct_locations: { Args: never; Returns: string[] }
      get_monthly_inventory_total: {
        Args: { target_month: string }
        Returns: number
      }
      get_order_seller_ids: {
        Args: { input_order_id: string }
        Returns: string[]
      }
      get_seller_from_inventory: {
        Args: { p_inventory_id: string }
        Returns: string
      }
      jsonb_object_diff: { Args: { val1: Json; val2: Json }; Returns: Json }
    }
    Enums: {
      inventory_status: "available" | "listed" | "ordered" | "sold" | "deleted"
      order_status: "Pending" | "Confirmed" | "Completed" | "Cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      inventory_status: ["available", "listed", "ordered", "sold", "deleted"],
      order_status: ["Pending", "Confirmed", "Completed", "Cancelled"],
    },
  },
} as const
