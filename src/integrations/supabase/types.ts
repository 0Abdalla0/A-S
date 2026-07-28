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
      couples: {
        Row: {
          bride_bio_ar: string | null
          bride_bio_en: string | null
          bride_first_name_ar: string | null
          bride_first_name_en: string
          bride_last_name_en: string | null
          bride_photo_url: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          groom_bio_ar: string | null
          groom_bio_en: string | null
          groom_first_name_ar: string | null
          groom_first_name_en: string
          groom_last_name_en: string | null
          groom_photo_url: string | null
          hashtag: string | null
          id: string
          is_published: boolean
          main_event_at: string
          slug: string
          timezone: string
          updated_at: string
        }
        Insert: {
          bride_bio_ar?: string | null
          bride_bio_en?: string | null
          bride_first_name_ar?: string | null
          bride_first_name_en: string
          bride_last_name_en?: string | null
          bride_photo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          groom_bio_ar?: string | null
          groom_bio_en?: string | null
          groom_first_name_ar?: string | null
          groom_first_name_en: string
          groom_last_name_en?: string | null
          groom_photo_url?: string | null
          hashtag?: string | null
          id?: string
          is_published?: boolean
          main_event_at: string
          slug: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          bride_bio_ar?: string | null
          bride_bio_en?: string | null
          bride_first_name_ar?: string | null
          bride_first_name_en?: string
          bride_last_name_en?: string | null
          bride_photo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          groom_bio_ar?: string | null
          groom_bio_en?: string | null
          groom_first_name_ar?: string | null
          groom_first_name_en?: string
          groom_last_name_en?: string | null
          groom_photo_url?: string | null
          hashtag?: string | null
          id?: string
          is_published?: boolean
          main_event_at?: string
          slug?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          capacity: number | null
          couple_id: string
          created_at: string
          description_ar: string | null
          description_en: string | null
          display_order: number
          dress_code_ar: string | null
          dress_code_en: string | null
          ends_at: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          is_public: boolean
          requires_rsvp: boolean
          starts_at: string
          title_ar: string | null
          title_en: string
          updated_at: string
          venue_id: string | null
        }
        Insert: {
          capacity?: number | null
          couple_id: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          dress_code_ar?: string | null
          dress_code_en?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          is_public?: boolean
          requires_rsvp?: boolean
          starts_at: string
          title_ar?: string | null
          title_en: string
          updated_at?: string
          venue_id?: string | null
        }
        Update: {
          capacity?: number | null
          couple_id?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          dress_code_ar?: string | null
          dress_code_en?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          is_public?: boolean
          requires_rsvp?: boolean
          starts_at?: string
          title_ar?: string | null
          title_en?: string
          updated_at?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_groups: {
        Row: {
          couple_id: string
          created_at: string
          id: string
          max_guests: number
          name: string
          notes: string | null
          side: Database["public"]["Enums"]["guest_side"]
          updated_at: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          id?: string
          max_guests?: number
          name: string
          notes?: string | null
          side?: Database["public"]["Enums"]["guest_side"]
          updated_at?: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          id?: string
          max_guests?: number
          name?: string
          notes?: string | null
          side?: Database["public"]["Enums"]["guest_side"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_groups_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          couple_id: string
          created_at: string
          dietary_notes: string | null
          email: string | null
          full_name: string
          full_name_ar: string | null
          group_id: string | null
          id: string
          is_child: boolean
          is_plus_one: boolean
          language_preference: string
          notes: string | null
          phone: string | null
          plus_one_of: string | null
          relationship: string | null
          side: Database["public"]["Enums"]["guest_side"]
          updated_at: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          dietary_notes?: string | null
          email?: string | null
          full_name: string
          full_name_ar?: string | null
          group_id?: string | null
          id?: string
          is_child?: boolean
          is_plus_one?: boolean
          language_preference?: string
          notes?: string | null
          phone?: string | null
          plus_one_of?: string | null
          relationship?: string | null
          side?: Database["public"]["Enums"]["guest_side"]
          updated_at?: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          dietary_notes?: string | null
          email?: string | null
          full_name?: string
          full_name_ar?: string | null
          group_id?: string | null
          id?: string
          is_child?: boolean
          is_plus_one?: boolean
          language_preference?: string
          notes?: string | null
          phone?: string | null
          plus_one_of?: string | null
          relationship?: string | null
          side?: Database["public"]["Enums"]["guest_side"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "guest_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guests_plus_one_of_fkey"
            columns: ["plus_one_of"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          allowed_guests: number
          channel: string
          code: string
          couple_id: string
          created_at: string
          expires_at: string | null
          first_opened_at: string | null
          group_id: string | null
          guest_id: string | null
          id: string
          opened_count: number
          personal_message_ar: string | null
          personal_message_en: string | null
          responded_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["invitation_status"]
          updated_at: string
        }
        Insert: {
          allowed_guests?: number
          channel?: string
          code: string
          couple_id: string
          created_at?: string
          expires_at?: string | null
          first_opened_at?: string | null
          group_id?: string | null
          guest_id?: string | null
          id?: string
          opened_count?: number
          personal_message_ar?: string | null
          personal_message_en?: string | null
          responded_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          updated_at?: string
        }
        Update: {
          allowed_guests?: number
          channel?: string
          code?: string
          couple_id?: string
          created_at?: string
          expires_at?: string | null
          first_opened_at?: string | null
          group_id?: string | null
          guest_id?: string | null
          id?: string
          opened_count?: number
          personal_message_ar?: string | null
          personal_message_en?: string | null
          responded_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "guest_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rsvp_responses: {
        Row: {
          couple_id: string
          created_at: string
          dietary_notes: string | null
          display_name: string
          email: string | null
          event_id: string | null
          guest_id: string | null
          id: string
          invitation_id: string | null
          language: string
          meal_preference: string | null
          message: string | null
          needs_accommodation: boolean
          needs_transport: boolean
          party_size: number
          phone: string | null
          responded_at: string
          song_request: string | null
          source: string
          status: Database["public"]["Enums"]["rsvp_status"]
          updated_at: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          dietary_notes?: string | null
          display_name: string
          email?: string | null
          event_id?: string | null
          guest_id?: string | null
          id?: string
          invitation_id?: string | null
          language?: string
          meal_preference?: string | null
          message?: string | null
          needs_accommodation?: boolean
          needs_transport?: boolean
          party_size?: number
          phone?: string | null
          responded_at?: string
          song_request?: string | null
          source?: string
          status?: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          dietary_notes?: string | null
          display_name?: string
          email?: string | null
          event_id?: string | null
          guest_id?: string | null
          id?: string
          invitation_id?: string | null
          language?: string
          meal_preference?: string | null
          message?: string | null
          needs_accommodation?: boolean
          needs_transport?: boolean
          party_size?: number
          phone?: string | null
          responded_at?: string
          song_request?: string | null
          source?: string
          status?: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_responses_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvp_responses_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvp_responses_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvp_responses_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_items: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          display_order: number
          duration_minutes: number | null
          event_id: string
          icon: string | null
          id: string
          starts_at: string
          title_ar: string | null
          title_en: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          duration_minutes?: number | null
          event_id: string
          icon?: string | null
          id?: string
          starts_at: string
          title_ar?: string | null
          title_en: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          duration_minutes?: number | null
          event_id?: string
          icon?: string | null
          id?: string
          starts_at?: string
          title_ar?: string | null
          title_en?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
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
      venues: {
        Row: {
          address_ar: string | null
          address_en: string | null
          city: string | null
          country: string | null
          couple_id: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          maps_query: string | null
          name_ar: string | null
          name_en: string
          parking_notes_ar: string | null
          parking_notes_en: string | null
          phone: string | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          address_ar?: string | null
          address_en?: string | null
          city?: string | null
          country?: string | null
          couple_id: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          maps_query?: string | null
          name_ar?: string | null
          name_en: string
          parking_notes_ar?: string | null
          parking_notes_en?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          address_ar?: string | null
          address_en?: string | null
          city?: string | null
          country?: string | null
          couple_id?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          maps_query?: string | null
          name_ar?: string | null
          name_en?: string
          parking_notes_ar?: string | null
          parking_notes_en?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "venues_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "admin" | "editor" | "viewer"
      event_type:
        | "engagement"
        | "ceremony"
        | "reception"
        | "after_party"
        | "henna"
        | "rehearsal"
        | "brunch"
        | "other"
      guest_side: "bride" | "groom" | "both"
      invitation_status: "draft" | "sent" | "opened" | "responded" | "cancelled"
      rsvp_status: "pending" | "attending" | "tentative" | "declined"
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
      app_role: ["admin", "editor", "viewer"],
      event_type: [
        "engagement",
        "ceremony",
        "reception",
        "after_party",
        "henna",
        "rehearsal",
        "brunch",
        "other",
      ],
      guest_side: ["bride", "groom", "both"],
      invitation_status: ["draft", "sent", "opened", "responded", "cancelled"],
      rsvp_status: ["pending", "attending", "tentative", "declined"],
    },
  },
} as const
