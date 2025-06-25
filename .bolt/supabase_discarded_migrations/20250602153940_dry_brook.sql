/*
  # Initial Schema Setup

  1. New Tables
    - leads
      - All lead tracking fields including status, contact info, and engagement details
    - clients
      - Client information and engagement details
    - partners
      - Partner information and contract details
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL,
  name text NOT NULL,
  company_name text NOT NULL,
  phone text,
  email text,
  products_services_interested text,
  bd_representative text,
  action_on timestamp with time zone,
  date_last_communication timestamp with time zone,
  last_remarks text,
  website text,
  location text,
  date_lead_acquisition timestamp with time zone,
  ticket_amount decimal,
  reference_name text,
  proposal_shared boolean DEFAULT false,
  proposal_link text,
  next_action_date timestamp with time zone,
  vertical text,
  industry text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_name text NOT NULL,
  mobile text,
  email text,
  address text,
  city text,
  country text,
  engagement_details text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  acceptance_status text,
  engagement_letter_reference text,
  company_name text NOT NULL,
  contact_person text,
  nature_of_contract text,
  bd_representative text,
  email_address text,
  contact_number text,
  status text,
  business_remark text,
  internal_remark text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own partners"
  ON partners FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own partners"
  ON partners FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own partners"
  ON partners FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);