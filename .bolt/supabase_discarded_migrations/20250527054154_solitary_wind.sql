/*
  # Fix user_profiles RLS policies

  1. Changes
    - Drop existing problematic policies that cause infinite recursion
    - Create new policies that avoid recursion:
      - Allow users to view their own profile
      - Allow admins to view all profiles using a non-recursive condition
  
  2. Security
    - Maintains RLS protection
    - Ensures users can only access appropriate data
    - Prevents infinite recursion in policy evaluation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;

-- Create new policies that avoid recursion
CREATE POLICY "Users can view their own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- For admin access, we'll use a simpler condition that checks the user's role
-- without causing a recursive query
CREATE POLICY "Admin can view all profiles"
ON user_profiles
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
);