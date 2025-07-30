/*
  # Hash existing admin passwords

  1. Updates
    - Hash all existing plain text passwords using crypt function
    - Ensures all passwords are consistently hashed

  2. Security
    - Uses PostgreSQL's crypt function with bcrypt
    - Salt rounds: 12 for high security
*/

-- Update existing admin users with hashed passwords
UPDATE admin_users 
SET password_hash = crypt(password_hash, gen_salt('bf', 12))
WHERE password_hash NOT LIKE '$2%'; -- Only update if not already hashed

-- Insert test admin with hashed password if not exists
INSERT INTO admin_users (username, password_hash, role)
SELECT 'admin', crypt('admin123', gen_salt('bf', 12)), 'super_admin'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin');

-- Insert manager with hashed password if not exists  
INSERT INTO admin_users (username, password_hash, role)
SELECT 'manager', crypt('manager123', gen_salt('bf', 12)), 'manager'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'manager');

-- Insert sales with hashed password if not exists
INSERT INTO admin_users (username, password_hash, role)
SELECT 'sales', crypt('sales123', gen_salt('bf', 12)), 'sales'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'sales');