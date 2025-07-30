/*
  # Simple admin users table with plain passwords

  1. Drop existing table and recreate
  2. Add simple admin users with plain passwords for testing
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create simple admin_users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Add policy
CREATE POLICY "Admin users are viewable by authenticated users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert simple admin users with plain passwords
INSERT INTO admin_users (username, password_hash, role) VALUES
('admin', 'admin', 'super_admin'),
('manager', 'manager', 'manager'),
('sales', 'sales', 'sales');