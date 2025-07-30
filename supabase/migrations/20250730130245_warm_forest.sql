/*
  # Create admin_users table

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `role` (text, default 'admin')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for authenticated users to read admin data

  3. Initial Data
    - Insert default admin users with different roles
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policy for admin_users
CREATE POLICY "Admin users are viewable by authenticated users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default admin users
INSERT INTO admin_users (username, password_hash, role) VALUES
('admin', 'admin', 'super_admin'),
('manager', 'manager123', 'manager'),
('sales', 'sales123', 'sales');