/*
  # Default admin foydalanuvchini qo'shish

  1. Admin Users
    - Default admin user yaratish
    - Login: admin, Parol: admin
    - Role: super_admin
*/

-- Default admin foydalanuvchini qo'shish
INSERT INTO admin_users (username, password_hash, role) 
VALUES ('admin', 'admin', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- Qo'shimcha test foydalanuvchilar
INSERT INTO admin_users (username, password_hash, role) VALUES
  ('manager', 'manager123', 'manager'),
  ('sales', 'sales123', 'sales')
ON CONFLICT (username) DO NOTHING;