export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {

  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string | null
          country: string | null
          county: string | null
          created_at: string
          formatted_address: string
          id: string
          is_saved: boolean
          label: string | null
          last_used_at: string
          latitude: number
          longitude: number
          postal_code: string | null
          profile_id: string | null
          updated_at: string
          usage_count: number
        }
        Insert: {
          city?: string | null
          country?: string | null
          county?: string | null
          created_at?: string
          formatted_address: string
          id?: string
          is_saved?: boolean
          label?: string | null
          last_used_at?: string
          latitude: number
          longitude: number
          postal_code?: string | null
          profile_id?: string | null
          updated_at?: string
          usage_count?: number
        }
        Update: {
          city?: string | null
          country?: string | null
          county?: string | null
          created_at?: string
          formatted_address?: string
          id?: string
          is_saved?: boolean
          label?: string | null
          last_used_at?: string
          latitude?: number
          longitude?: number
          postal_code?: string | null
          profile_id?: string | null
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "addresses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          actor_profile_id: string | null
          actor_role: string
          changes: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          occurred_at: string
        }
        Insert: {
          action: string
          actor_profile_id?: string | null
          actor_role: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          occurred_at?: string
        }
        Update: {
          action?: string
          actor_profile_id?: string | null
          actor_role?: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          occurred_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_actor_profile_id_fkey"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          body: string
          category: string | null
          created_at: string
          id: string
          internal_note: string | null
          read_at: string | null
          sender_email: string
          sender_name: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string
          id?: string
          internal_note?: string | null
          read_at?: string | null
          sender_email: string
          sender_name?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string
          id?: string
          internal_note?: string | null
          read_at?: string | null
          sender_email?: string
          sender_name?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      mission_events: {
        Row: {
          created_at: string
          description: string | null
          event_type: string
          id: string
          metadata: Json
          mission_id: string
          occurred_at: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_type: string
          id?: string
          metadata?: Json
          mission_id: string
          occurred_at?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          metadata?: Json
          mission_id?: string
          occurred_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_events_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          completed_at: string | null
          created_at: string
          current_status: string
          drone_telemetry_snapshot: Json
          dropoff_pin: string | null
          dropoff_pin_attempts: number
          dropoff_pin_verified_at: string | null
          fallback_reason: string | null
          id: string
          order_id: string
          pickup_pin: string | null
          pickup_pin_attempts: number
          pickup_pin_verified_at: string | null
          started_at: string | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_status?: string
          drone_telemetry_snapshot?: Json
          dropoff_pin?: string | null
          dropoff_pin_attempts?: number
          dropoff_pin_verified_at?: string | null
          fallback_reason?: string | null
          id?: string
          order_id: string
          pickup_pin?: string | null
          pickup_pin_attempts?: number
          pickup_pin_verified_at?: string | null
          started_at?: string | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_status?: string
          drone_telemetry_snapshot?: Json
          dropoff_pin?: string | null
          dropoff_pin_attempts?: number
          dropoff_pin_verified_at?: string | null
          fallback_reason?: string | null
          id?: string
          order_id?: string
          pickup_pin?: string | null
          pickup_pin_attempts?: number
          pickup_pin_verified_at?: string | null
          started_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          metadata: Json
          profile_id: string | null
          read: boolean
          read_at: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          metadata?: Json
          profile_id?: string | null
          read?: boolean
          read_at?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          metadata?: Json
          profile_id?: string | null
          read?: boolean
          read_at?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_settings: {
        Row: {
          base_price_minor: number
          confirmation_timer_minutes: number
          created_at: string
          hub_latitude: number
          hub_longitude: number
          id: string
          is_active: boolean
          is_singleton: boolean | null
          last_saved_at: string
          last_saved_by: string | null
          loading_timer_minutes: number
          price_per_km_minor: number
          service_radius_km: number
          unloading_timer_minutes: number
          updated_at: string
        }
        Insert: {
          base_price_minor?: number
          confirmation_timer_minutes?: number
          created_at?: string
          hub_latitude?: number
          hub_longitude?: number
          id?: string
          is_active?: boolean
          is_singleton?: boolean | null
          last_saved_at?: string
          last_saved_by?: string | null
          loading_timer_minutes?: number
          price_per_km_minor?: number
          service_radius_km?: number
          unloading_timer_minutes?: number
          updated_at?: string
        }
        Update: {
          base_price_minor?: number
          confirmation_timer_minutes?: number
          created_at?: string
          hub_latitude?: number
          hub_longitude?: number
          id?: string
          is_active?: boolean
          is_singleton?: boolean | null
          last_saved_at?: string
          last_saved_by?: string | null
          loading_timer_minutes?: number
          price_per_km_minor?: number
          service_radius_km?: number
          unloading_timer_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operational_settings_last_saved_by_fkey"
            columns: ["last_saved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          delivery_configuration_id: string
          dispatch_timing: string
          drone_class: string
          dropoff_address_id: string
          eta_max_minutes: number | null
          eta_min_minutes: number | null
          fulfillment_status: string | null
          handoff_points_snapshot: Json | null
          id: string
          local_order_id: string
          notes: string | null
          parcel_id: string
          payment_status: string
          pickup_address_id: string
          pricing_snapshot: Json
          public_tracking_code: string
          recipient_email: string | null
          recipient_name: string | null
          recipient_phone: string | null
          recipient_tracking_token: string
          refund_status: string | null
          scheduled_at: string | null
          selected_dropoff_handoff_point: Json | null
          selected_pickup_handoff_point: Json | null
          sender_profile_id: string
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          total_amount_minor: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          delivery_configuration_id: string
          dispatch_timing?: string
          drone_class: string
          dropoff_address_id: string
          eta_max_minutes?: number | null
          eta_min_minutes?: number | null
          fulfillment_status?: string | null
          handoff_points_snapshot?: Json | null
          id?: string
          local_order_id: string
          notes?: string | null
          parcel_id: string
          payment_status?: string
          pickup_address_id: string
          pricing_snapshot: Json
          public_tracking_code: string
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          recipient_tracking_token: string
          refund_status?: string | null
          scheduled_at?: string | null
          selected_dropoff_handoff_point?: Json | null
          selected_pickup_handoff_point?: Json | null
          sender_profile_id: string
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          total_amount_minor: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          delivery_configuration_id?: string
          dispatch_timing?: string
          drone_class?: string
          dropoff_address_id?: string
          eta_max_minutes?: number | null
          eta_min_minutes?: number | null
          fulfillment_status?: string | null
          handoff_points_snapshot?: Json | null
          id?: string
          local_order_id?: string
          notes?: string | null
          parcel_id?: string
          payment_status?: string
          pickup_address_id?: string
          pricing_snapshot?: Json
          public_tracking_code?: string
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          recipient_tracking_token?: string
          refund_status?: string | null
          scheduled_at?: string | null
          selected_dropoff_handoff_point?: Json | null
          selected_pickup_handoff_point?: Json | null
          sender_profile_id?: string
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          total_amount_minor?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_dropoff_address_id_fkey"
            columns: ["dropoff_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_pickup_address_id_fkey"
            columns: ["pickup_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_sender_profile_id_fkey"
            columns: ["sender_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parcels: {
        Row: {
          approximate_size: string | null
          contents_description: string
          created_at: string
          declared_dimensions_cm: Json | null
          declared_weight_kg: number | null
          estimated_weight_range: string | null
          fragility_level: string
          id: string
          packaging_type: string | null
          security_module: string
          thermal_protection: string
        }
        Insert: {
          approximate_size?: string | null
          contents_description: string
          created_at?: string
          declared_dimensions_cm?: Json | null
          declared_weight_kg?: number | null
          estimated_weight_range?: string | null
          fragility_level?: string
          id?: string
          packaging_type?: string | null
          security_module?: string
          thermal_protection?: string
        }
        Update: {
          approximate_size?: string | null
          contents_description?: string
          created_at?: string
          declared_dimensions_cm?: Json | null
          declared_weight_kg?: number | null
          estimated_weight_range?: string | null
          fragility_level?: string
          id?: string
          packaging_type?: string | null
          security_module?: string
          thermal_protection?: string
        }
        Relationships: []
      }
      payment_records: {
        Row: {
          amount_minor: number
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          order_id: string
          profile_id: string
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_refund_id: string | null
          type: string
        }
        Insert: {
          amount_minor: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          order_id: string
          profile_id: string
          status: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          type: string
        }
        Update: {
          amount_minor?: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          order_id?: string
          profile_id?: string
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          clerk_user_id: string
          created_at: string
          email: string
          full_name: string | null
          id: string
          notification_preferences: Json
          role: string
          updated_at: string
        }
        Insert: {
          clerk_user_id: string
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          notification_preferences?: Json
          role?: string
          updated_at?: string
        }
        Update: {
          clerk_user_id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          notification_preferences?: Json
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_profile_id: { Args: never; Returns: string }
      current_user_role: { Args: never; Returns: string }
      ensure_profile_exists: {
        Args: { p_clerk_user_id: string; p_email: string; p_full_name?: string }
        Returns: string
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
    Enums: {},
  },
} as const
