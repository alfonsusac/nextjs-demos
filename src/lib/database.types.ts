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
          id: string
          views: number
        }
        Insert: {
          id: string
          views?: number
        }
        Update: {
          id?: string
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
      incrementpageview:
        | {
            Args: Record<PropertyKey, never>
            Returns: undefined
          }
        | {
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
