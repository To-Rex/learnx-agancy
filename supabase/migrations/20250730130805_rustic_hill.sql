/*
  # Create admin_users table with properly hashed passwords

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text) - bcrypt hashed passwords
      - `role` (text, default 'admin')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on admin_users table
    - Add policy for authenticated users to read admin data

  3. Initial Data
    - Insert admin users with properly hashed passwords
    - Default admin: username=admin, password=admin123
    - Manager: username=manager, password=manager123
    - Sales: username=sales, password=sales123
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create admin_users table
CREATE TABLE admin_users (
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

-- Insert admin users with bcrypt hashed passwords
-- Note: These are properly hashed using bcrypt with salt rounds 12
INSERT INTO admin_users (username, password_hash, role) VALUES
-- admin / admin123 (bcrypt hashed)
('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPyV8Cpu', 'super_admin'),
-- manager / manager123 (bcrypt hashed)  
('manager', '$2a$12$4NVJ9n8qMudMQFjfcoIDXOuAMf.xvtjfNyOXLhvHGOMeoCpvhEYUW', 'manager'),
-- sales / sales123 (bcrypt hashed)
('sales', '$2a$12$8HqAR6PM9sgAt3fEOFk0/.VxORGpUK2OuILxFFqQNuKs.HNDSUhoy', 'sales');