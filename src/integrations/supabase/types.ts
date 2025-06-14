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
      complaint_portals: {
        Row: {
          department_id: number | null
          escalation_path: string | null
          help_doc_url: string | null
          id: number
          portal_url: string | null
        }
        Insert: {
          department_id?: number | null
          escalation_path?: string | null
          help_doc_url?: string | null
          id?: number
          portal_url?: string | null
        }
        Update: {
          department_id?: number | null
          escalation_path?: string | null
          help_doc_url?: string | null
          id?: number
          portal_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaint_portals_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      constituencies: {
        Row: {
          boundary_geojson: Json | null
          id: number
          mla_email: string | null
          mla_name: string | null
          mla_party: string | null
          mla_phone: string | null
          mla_photo_url: string | null
          name: string
          office_address: string | null
        }
        Insert: {
          boundary_geojson?: Json | null
          id?: number
          mla_email?: string | null
          mla_name?: string | null
          mla_party?: string | null
          mla_phone?: string | null
          mla_photo_url?: string | null
          name: string
          office_address?: string | null
        }
        Update: {
          boundary_geojson?: Json | null
          id?: number
          mla_email?: string | null
          mla_name?: string | null
          mla_party?: string | null
          mla_phone?: string | null
          mla_photo_url?: string | null
          name?: string
          office_address?: string | null
        }
        Relationships: []
      }
      department_officers: {
        Row: {
          department_id: number | null
          designation: string | null
          email: string | null
          escalation_level: number | null
          id: number
          is_active: boolean | null
          mobile: string | null
          name: string
          zone_id: number | null
        }
        Insert: {
          department_id?: number | null
          designation?: string | null
          email?: string | null
          escalation_level?: number | null
          id?: number
          is_active?: boolean | null
          mobile?: string | null
          name: string
          zone_id?: number | null
        }
        Update: {
          department_id?: number | null
          designation?: string | null
          email?: string | null
          escalation_level?: number | null
          id?: number
          is_active?: boolean | null
          mobile?: string | null
          name?: string
          zone_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "department_officers_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_officers_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "department_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      department_zones: {
        Row: {
          department_id: number | null
          id: number
          office_address: string | null
          region: string | null
          zone_name: string
        }
        Insert: {
          department_id?: number | null
          id?: number
          office_address?: string | null
          region?: string | null
          zone_name: string
        }
        Update: {
          department_id?: number | null
          id?: number
          office_address?: string | null
          region?: string | null
          zone_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_zones_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          description: string | null
          id: number
          name: string
          website: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          website?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
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
