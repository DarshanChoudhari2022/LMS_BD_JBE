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
      leads: {
        Row: {
          id: string
          status: string
          name: string
          company_name: string
          phone: string | null
          email: string | null
          products_services_interested: string | null
          bd_representative: string | null
          date_of_last_contact: string | null
          last_remarks: string | null
          location: string | null
          date_of_lead_acquisition: string | null
          proposal_shared: boolean
          next_action_date: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          status: string
          name: string
          company_name: string
          phone?: string | null
          email?: string | null
          products_services_interested?: string | null
          bd_representative?: string | null
          date_of_last_contact?: string | null
          last_remarks?: string | null
          location?: string | null
          date_of_lead_acquisition?: string | null
          proposal_shared?: boolean
          next_action_date?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          status?: string
          name?: string
          company_name?: string
          phone?: string | null
          email?: string | null
          products_services_interested?: string | null
          bd_representative?: string | null
          date_of_last_contact?: string | null
          last_remarks?: string | null
          location?: string | null
          date_of_lead_acquisition?: string | null
          proposal_shared?: boolean
          next_action_date?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}