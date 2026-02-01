/**
 * Database types for Lead-to-Quote Engine v2
 *
 * These are placeholder types matching the PRD schema.
 * Regenerate from Supabase after DEV-005 migrations:
 * npx supabase gen types typescript --project-id bwvrtypzcvuojfsyiwch > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          address: string | null;
          city: string | null;
          postal_code: string | null;
          project_type: string | null;
          project_description: string | null;
          timeline: string | null;
          budget_range: string | null;
          status: 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost';
          source: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          notes: string | null;
          assigned_to: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          project_type?: string | null;
          project_description?: string | null;
          timeline?: string | null;
          budget_range?: string | null;
          status?: 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost';
          source?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          notes?: string | null;
          assigned_to?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          project_type?: string | null;
          project_description?: string | null;
          timeline?: string | null;
          budget_range?: string | null;
          status?: 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost';
          source?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          notes?: string | null;
          assigned_to?: string | null;
        };
        Relationships: [];
      };
      quote_drafts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          lead_id: string;
          version: number;
          line_items: Json;
          subtotal: number;
          hst_amount: number;
          total: number;
          deposit_amount: number;
          valid_until: string;
          notes: string | null;
          status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
          sent_at: string | null;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          lead_id: string;
          version?: number;
          line_items: Json;
          subtotal: number;
          hst_amount: number;
          total: number;
          deposit_amount: number;
          valid_until: string;
          notes?: string | null;
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
          sent_at?: string | null;
          accepted_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          lead_id?: string;
          version?: number;
          line_items?: Json;
          subtotal?: number;
          hst_amount?: number;
          total?: number;
          deposit_amount?: number;
          valid_until?: string;
          notes?: string | null;
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
          sent_at?: string | null;
          accepted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'quote_drafts_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          }
        ];
      };
      chat_sessions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          lead_id: string | null;
          session_token: string;
          messages: Json;
          extracted_data: Json | null;
          status: 'active' | 'completed' | 'abandoned';
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          lead_id?: string | null;
          session_token: string;
          messages?: Json;
          extracted_data?: Json | null;
          status?: 'active' | 'completed' | 'abandoned';
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          lead_id?: string | null;
          session_token?: string;
          messages?: Json;
          extracted_data?: Json | null;
          status?: 'active' | 'completed' | 'abandoned';
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_sessions_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          }
        ];
      };
      audit_log: {
        Row: {
          id: string;
          created_at: string;
          user_id: string | null;
          action: string;
          table_name: string;
          record_id: string;
          old_data: Json | null;
          new_data: Json | null;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          action: string;
          table_name: string;
          record_id: string;
          old_data?: Json | null;
          new_data?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          action?: string;
          table_name?: string;
          record_id?: string;
          old_data?: Json | null;
          new_data?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      lead_status: 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost';
      quote_status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
      chat_session_status: 'active' | 'completed' | 'abandoned';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper types for convenience
export type Lead = Database['public']['Tables']['leads']['Row'];
export type LeadInsert = Database['public']['Tables']['leads']['Insert'];
export type LeadUpdate = Database['public']['Tables']['leads']['Update'];

export type QuoteDraft = Database['public']['Tables']['quote_drafts']['Row'];
export type QuoteDraftInsert = Database['public']['Tables']['quote_drafts']['Insert'];
export type QuoteDraftUpdate = Database['public']['Tables']['quote_drafts']['Update'];

export type ChatSession = Database['public']['Tables']['chat_sessions']['Row'];
export type ChatSessionInsert = Database['public']['Tables']['chat_sessions']['Insert'];
export type ChatSessionUpdate = Database['public']['Tables']['chat_sessions']['Update'];

export type AuditLog = Database['public']['Tables']['audit_log']['Row'];
export type AuditLogInsert = Database['public']['Tables']['audit_log']['Insert'];

export type LeadStatus = Database['public']['Enums']['lead_status'];
export type QuoteStatus = Database['public']['Enums']['quote_status'];
export type ChatSessionStatus = Database['public']['Enums']['chat_session_status'];
