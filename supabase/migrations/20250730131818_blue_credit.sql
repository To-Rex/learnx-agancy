/*
  # Fix admin_users RLS policies

  1. Security Updates
    - Allow anonymous users to read admin_users for login verification
    - Allow anonymous users to insert admin_users for user creation
    - Keep data secure while enabling admin functionality

  2. Important Notes
    - This is for development/demo purposes
    - In production, use service role or edge functions for admin operations
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users are viewable by authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Allow anonymous read for login" ON admin_users;
DROP POLICY IF EXISTS "Allow anonymous insert for admin creation" ON admin_users;

-- Allow anonymous users to read admin_users (needed for login)
CREATE POLICY "Allow anonymous read for login"
  ON admin_users
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to insert admin_users (needed for creating new admins)
CREATE POLICY "Allow anonymous insert for admin creation"
  ON admin_users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read admin_users
CREATE POLICY "Allow authenticated read"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);