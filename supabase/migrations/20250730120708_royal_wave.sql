/*
  # Admin System Setup

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `role` (text) - super_admin, admin, manager, sales
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policies for admin access

  3. Initial Data
    - Create super admin user
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'sales' CHECK (role IN ('super_admin', 'admin', 'manager', 'sales')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users are viewable by authenticated users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial super admin (password: admin123)
INSERT INTO admin_users (username, password_hash, role) 
VALUES ('superadmin', 'admin123', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Insert demo users
INSERT INTO admin_users (username, password_hash, role) 
VALUES 
  ('admin', 'admin123', 'admin'),
  ('manager', 'manager123', 'manager'),
  ('sales', 'sales123', 'sales')
ON CONFLICT (username) DO NOTHING;