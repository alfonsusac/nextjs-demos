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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Article: {
        Row: {
          content: Json | null
          id: string
          slug: string
          views: number
        }
        Insert: {
          content?: Json | null
          id: string
          slug: string
          views?: number
        }
        Update: {
          content?: Json | null
          id?: string
          slug?: string
          views?: number
        }
        Relationships: []
      }
      Links: {
        Row: {
          description: string | null
          faviconURL: string | null
          thumbnailURL: string | null
          title: string | null
          url: string
        }
        Insert: {
          description?: string | null
          faviconURL?: string | null
          thumbnailURL?: string | null
          title?: string | null
          url: string
        }
        Update: {
          description?: string | null
          faviconURL?: string | null
          thumbnailURL?: string | null
          title?: string | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      incrementpageview: {
        Args: {
          row_id: string
        }
        Returns: undefined
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
