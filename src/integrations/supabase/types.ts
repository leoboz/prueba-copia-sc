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
      action_logs: {
        Row: {
          action: string
          details: Json | null
          id: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      crops: {
        Row: {
          created_at: string | null
          id: string
          name: string
          scientific_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          scientific_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          scientific_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lot_labels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      lot_type_unit_permissions: {
        Row: {
          id: string
          is_allowed: boolean
          lot_type_id: string
          unit_id: string
        }
        Insert: {
          id?: string
          is_allowed?: boolean
          lot_type_id: string
          unit_id: string
        }
        Update: {
          id?: string
          is_allowed?: boolean
          lot_type_id?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lot_type_unit_permissions_lot_type_id_fkey"
            columns: ["lot_type_id"]
            isOneToOne: false
            referencedRelation: "lot_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lot_type_unit_permissions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      lot_types: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      lots: {
        Row: {
          amount: number | null
          calculated_label_id: string | null
          campaign_id: string | null
          category_id: string | null
          code: string
          company_id: string | null
          created_at: string | null
          final_label_id: string | null
          id: string
          lot_type_id: string | null
          origin_lot_id: string | null
          origin_text: string | null
          overridden: boolean | null
          overridden_by: string | null
          override_reason: string | null
          pgo_overridden_at: string | null
          pgo_overridden_by: string | null
          pgo_override_reason: string | null
          plant_id: string | null
          qr_url: string | null
          unit_id: string | null
          updated_at: string | null
          user_id: string
          variety_id: string
        }
        Insert: {
          amount?: number | null
          calculated_label_id?: string | null
          campaign_id?: string | null
          category_id?: string | null
          code: string
          company_id?: string | null
          created_at?: string | null
          final_label_id?: string | null
          id?: string
          lot_type_id?: string | null
          origin_lot_id?: string | null
          origin_text?: string | null
          overridden?: boolean | null
          overridden_by?: string | null
          override_reason?: string | null
          pgo_overridden_at?: string | null
          pgo_overridden_by?: string | null
          pgo_override_reason?: string | null
          plant_id?: string | null
          qr_url?: string | null
          unit_id?: string | null
          updated_at?: string | null
          user_id: string
          variety_id: string
        }
        Update: {
          amount?: number | null
          calculated_label_id?: string | null
          campaign_id?: string | null
          category_id?: string | null
          code?: string
          company_id?: string | null
          created_at?: string | null
          final_label_id?: string | null
          id?: string
          lot_type_id?: string | null
          origin_lot_id?: string | null
          origin_text?: string | null
          overridden?: boolean | null
          overridden_by?: string | null
          override_reason?: string | null
          pgo_overridden_at?: string | null
          pgo_overridden_by?: string | null
          pgo_override_reason?: string | null
          plant_id?: string | null
          qr_url?: string | null
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string
          variety_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_lots_campaign_id"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lots_category_id"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lots_lot_type_id"
            columns: ["lot_type_id"]
            isOneToOne: false
            referencedRelation: "lot_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lots_origin_lot_id"
            columns: ["origin_lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lots_plant_id"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lots_unit_id"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lots_calculated_label_id_fkey"
            columns: ["calculated_label_id"]
            isOneToOne: false
            referencedRelation: "lot_labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lots_final_label_id_fkey"
            columns: ["final_label_id"]
            isOneToOne: false
            referencedRelation: "lot_labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lots_variety_id_fkey"
            columns: ["variety_id"]
            isOneToOne: false
            referencedRelation: "varieties"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          created_at: string | null
          id: string
          lot_id: string
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lot_id: string
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lot_id?: string
          type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          created_at: string
          description: string | null
          href: string
          icon_name: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          href: string
          icon_name: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          href?: string
          icon_name?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      parameters: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          test_id: string
          type: string | null
          updated_at: string | null
          validation: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          test_id: string
          type?: string | null
          updated_at?: string | null
          validation?: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          test_id?: string
          type?: string | null
          updated_at?: string | null
          validation?: Json
        }
        Relationships: [
          {
            foreignKeyName: "parameters_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      plants: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          is_verified: boolean
          multiplier_id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          multiplier_id: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          multiplier_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plants_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_configs: {
        Row: {
          created_at: string | null
          display_fields: string[] | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_fields?: string[] | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_fields?: string[] | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_menu_permissions: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          menu_item_id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          menu_item_id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          menu_item_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_menu_permissions_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_labels: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sample_statuses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sample_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      samples: {
        Row: {
          company_id: string | null
          created_at: string | null
          estimated_result_date: string | null
          id: string
          internal_code: string | null
          label_id: string | null
          lot_id: string
          sample_type_id: string
          status: string | null
          test_ids: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          estimated_result_date?: string | null
          id?: string
          internal_code?: string | null
          label_id?: string | null
          lot_id: string
          sample_type_id: string
          status?: string | null
          test_ids: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          estimated_result_date?: string | null
          id?: string
          internal_code?: string | null
          label_id?: string | null
          lot_id?: string
          sample_type_id?: string
          status?: string | null
          test_ids?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_sample_type"
            columns: ["sample_type_id"]
            isOneToOne: false
            referencedRelation: "sample_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_status"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "sample_statuses"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "samples_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "samples_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "sample_labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "samples_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
        ]
      }
      standards: {
        Row: {
          created_at: string | null
          created_by: string
          criteria: Json
          id: string
          label_id: string
          parameter_id: string
          test_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          criteria: Json
          id?: string
          label_id: string
          parameter_id: string
          test_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          criteria?: Json
          id?: string
          label_id?: string
          parameter_id?: string
          test_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "standards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standards_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "sample_labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standards_parameter_id_fkey"
            columns: ["parameter_id"]
            isOneToOne: false
            referencedRelation: "parameters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standards_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      technologies: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      test_result_labels: {
        Row: {
          created_at: string | null
          id: string
          label_id: string
          test_result_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label_id: string
          test_result_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label_id?: string
          test_result_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_result_labels_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "sample_labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_result_labels_test_result_id_fkey"
            columns: ["test_result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          created_at: string | null
          id: string
          is_valid: boolean | null
          parameter_id: string
          sample_id: string
          source: string
          test_id: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_valid?: boolean | null
          parameter_id: string
          sample_id: string
          source?: string
          test_id: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_valid?: boolean | null
          parameter_id?: string
          sample_id?: string
          source?: string
          test_id?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_parameter_id_fkey"
            columns: ["parameter_id"]
            isOneToOne: false
            referencedRelation: "parameters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_sample_id_fkey"
            columns: ["sample_id"]
            isOneToOne: false
            referencedRelation: "samples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_template: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_company_associations: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_company_associations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          role: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: string
          token?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          active_company_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active_company_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active_company_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_active_company_id_fkey"
            columns: ["active_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_system_admin: boolean
          last_login_at: string | null
          name: string | null
          organization_id: string | null
          parent_user_id: string | null
          password_changed_at: string | null
          requires_password_change: boolean | null
          role: string | null
          temporary_password: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          is_active?: boolean | null
          is_system_admin?: boolean
          last_login_at?: string | null
          name?: string | null
          organization_id?: string | null
          parent_user_id?: string | null
          password_changed_at?: string | null
          requires_password_change?: boolean | null
          role?: string | null
          temporary_password?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_system_admin?: boolean
          last_login_at?: string | null
          name?: string | null
          organization_id?: string | null
          parent_user_id?: string | null
          password_changed_at?: string | null
          requires_password_change?: boolean | null
          role?: string | null
          temporary_password?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_parent_user_id_fkey"
            columns: ["parent_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      varieties: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          crop_id: string | null
          description: string | null
          id: string
          name: string
          technology_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          crop_id?: string | null
          description?: string | null
          id?: string
          name: string
          technology_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          crop_id?: string | null
          description?: string | null
          id?: string
          name?: string
          technology_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "varieties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "varieties_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "varieties_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "varieties_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      variety_permissions: {
        Row: {
          constraints: Json | null
          created_at: string | null
          expires_at: string | null
          granted_at: string
          granted_by: string
          id: string
          updated_at: string | null
          user_id: string
          variety_id: string
        }
        Insert: {
          constraints?: Json | null
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string
          granted_by: string
          id?: string
          updated_at?: string | null
          user_id: string
          variety_id: string
        }
        Update: {
          constraints?: Json | null
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string
          granted_by?: string
          id?: string
          updated_at?: string | null
          user_id?: string
          variety_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_granted_by"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variety_permissions_variety_id_fkey"
            columns: ["variety_id"]
            isOneToOne: false
            referencedRelation: "varieties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_organization: {
        Args: { org_id: string }
        Returns: boolean
      }
      get_current_user_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_organization: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_no_analizado_label_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_system_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_action: string
          p_table_name: string
          p_record_id?: string
          p_details?: Json
        }
        Returns: string
      }
      log_user_activity: {
        Args: {
          p_user_id: string
          p_action: string
          p_details?: Json
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: string
      }
      user_has_company_access: {
        Args: { company_id: string }
        Returns: boolean
      }
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
