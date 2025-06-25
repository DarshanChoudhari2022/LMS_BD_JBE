/*
  # Initial Schema Setup for Leads

  1. New Tables
    - `leads`
      - All fields from the Excel sheet
      - `assigned_to` references auth.users
      - Timestamps for tracking

  2. Security
    - Enable RLS
    - Basic read access policy for authenticated users
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL,
  name text NOT NULL,
  company_name text NOT NULL,
  phone text,
  email text,
  products_services_interested text,
  bd_representative text,
  date_of_last_contact date,
  last_remarks text,
  location text,
  date_of_lead_acquisition date,
  proposal_shared boolean DEFAULT false,
  next_action_date date,
  assigned_to uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Enable read access for authenticated users"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

-- Function to update updated_at timestamp (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $trigger$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $trigger$ language 'plpgsql';
  END IF;
END $$;

-- Drop trigger if it exists and recreate it
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();