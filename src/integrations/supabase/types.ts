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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_ratings: {
        Row: {
          comment: string | null
          created_at: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contribution_clicks: {
        Row: {
          clicked_at: string
          id: string
          user_id: string
        }
        Insert: {
          clicked_at?: string
          id?: string
          user_id: string
        }
        Update: {
          clicked_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      library_items: {
        Row: {
          cover_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_paid: boolean
          item_type: Database["public"]["Enums"]["library_item_type"]
          price_cents: number | null
          published: boolean
          sort_order: number
          title: string
          module_type: string
          updated_at: string
          url: string
          slides: Json | null
          narrated: boolean
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_paid?: boolean
          item_type: Database["public"]["Enums"]["library_item_type"]
          price_cents?: number | null
          published?: boolean
          sort_order?: number
          title: string
          module_type?: string
          updated_at?: string
          url: string
          slides?: Json | null
          narrated?: boolean
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_paid?: boolean
          item_type?: Database["public"]["Enums"]["library_item_type"]
          price_cents?: number | null
          published?: boolean
          sort_order?: number
          title?: string
          module_type?: string
          updated_at?: string
          url?: string
          slides?: Json | null
          narrated?: boolean
        }
        Relationships: []
      }
profiles: {
        Row: {
           cpf: string | null
           created_at: string
           display_name: string | null
           email: string | null
           employment_other: string | null
           employment_status: string | null
           expires_at: string | null
           free_trial_enabled: boolean | null
           id: string
           is_first_access: boolean | null
           is_migrated: boolean | null
           needs_new_password: boolean | null
           phone: string | null
           studies: boolean | null
           status: string
            selos: string[] | null
            updated_at: string
             access_status: string | null
             access_reason: string | null
             group_status: string | null
             whatsapp_invite_later_at: string | null
             whatsapp_invite_status: string
         }
          Insert: {
            cpf?: string | null
            created_at?: string
            display_name?: string | null
            email?: string | null
            employment_other?: string | null
            employment_status?: string | null
            expires_at?: string | null
            free_trial_enabled?: boolean | null
            id: string
            is_first_access?: boolean | null
            is_migrated?: boolean | null
            needs_new_password?: boolean | null
            phone?: string | null
            studies?: boolean | null
            status?: string
            selos?: string[]
            updated_at?: string
            access_status?: string | null
            access_reason?: string | null
            group_status?: string | null
            whatsapp_invite_later_at?: string | null
            whatsapp_invite_status?: string
           }
           Update: {
            cpf?: string | null
            created_at?: string
            display_name?: string | null
            email?: string | null
            employment_other?: string | null
            employment_status?: string | null
            expires_at?: string | null
            free_trial_enabled?: boolean | null
            id?: string
            is_first_access?: boolean | null
            is_migrated?: boolean | null
            needs_new_password?: boolean | null
            phone?: string | null
            studies?: boolean | null
            status?: string
            selos?: string[]
            updated_at?: string
            access_status?: string | null
            access_reason?: string | null
            group_status?: string | null
            whatsapp_invite_later_at?: string | null
            whatsapp_invite_status?: string
          }
          Relationships: []
        }
        app_settings: {
          Row: {
            key: string
            value: string
            updated_at: string
          }
          Insert: {
            key: string
            value: string
            updated_at?: string
          }
          Update: {
            key?: string
            value?: string
            updated_at?: string
          }
          Relationships: []
        }
        system_settings: {
          Row: {
            id: string
            key: string
            value: string | null
            updated_at: string
          }
          Insert: {
            id?: string
            key: string
            value?: string | null
            updated_at?: string
          }
          Update: {
            id?: string
            key?: string
            value?: string | null
            updated_at?: string
          }
          Relationships: []
        }
      estudo_config: {
        Row: {
          id: string
          user_id: string
          exam_date: string | null
          no_exam_date: boolean
          days_of_week: Json | null
          daily_time: number
          reading_habit: string
          is_intensive_mode: boolean
          current_chapter: number
          current_page: number
          completed_pages: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exam_date?: string | null
          no_exam_date?: boolean
          days_of_week?: Json | null
          daily_time?: number
          reading_habit?: string
          is_intensive_mode?: boolean
          current_chapter?: number
          current_page?: number
          completed_pages?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exam_date?: string | null
          no_exam_date?: boolean
          days_of_week?: Json | null
          daily_time?: number
          reading_habit?: string
          is_intensive_mode?: boolean
          current_chapter?: number
          current_page?: number
          completed_pages?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          current_session_index: number
          last_access_date: string | null
          completed_pages: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_session_index?: number
          last_access_date?: string | null
          completed_pages?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_session_index?: number
          last_access_date?: string | null
          completed_pages?: number
          updated_at?: string
        }
        Relationships: []
      }
      cronograma_dias: {
        Row: {
          id: string
          user_id: string
          dia_numero: number
          data_agendada: string
          paginas_leitura: string
          qtd_simulados_meta: number
          concluido: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dia_numero: number
          data_agendada: string
          paginas_leitura: string
          qtd_simulados_meta?: number
          concluido?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          dia_numero?: number
          data_agendada?: string
          paginas_leitura?: string
          qtd_simulados_meta?: number
          concluido?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      historico_ranking: {
        Row: {
          id: string
          user_id: string
          data: string
          pontuacao_dia: number
          simulados_aprovados_hoje: number
          simulados_gabaritados_hoje: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          data: string
          pontuacao_dia?: number
          simulados_aprovados_hoje?: number
          simulados_gabaritados_hoje?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          data?: string
          pontuacao_dia?: number
          simulados_aprovados_hoje?: number
          simulados_gabaritados_hoje?: number
          updated_at?: string
        }
        Relationships: []
      }
      pix_transactions: {
        Row: {
          id: string
          user_id: string
          txid: string
          amount: number
          plan_type: string
          status: string
          pix_copia_e_cola: string
          qrcode_base64: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          txid: string
          amount: number
          plan_type: string
          status?: string
          pix_copia_e_cola: string
          qrcode_base64?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          txid?: string
          amount?: number
          plan_type?: string
          status?: string
          pix_copia_e_cola?: string
          qrcode_base64?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      library_item_type: "pdf" | "heyzine" | "link" | "video" | "image" | "carousel"
      reading_habit: "raramente" | "as_vezes" | "frequentemente"
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
      app_role: ["admin", "user"],
      library_item_type: ["pdf", "heyzine", "link", "video", "image", "carousel"],
      reading_habit: ["raramente", "as_vezes", "frequentemente"],
    },
  },
} as const
