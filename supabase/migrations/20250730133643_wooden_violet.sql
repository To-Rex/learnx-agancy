/*
  # Admin parol yangilash funksiyasi

  1. Funksiyalar
    - `update_admin_password` - Admin parolini yangilash
  
  2. Xavfsizlik
    - Parolni hash qilish
    - Faqat mavjud adminlarni yangilash
*/

-- Admin parolini yangilash funksiyasi
CREATE OR REPLACE FUNCTION update_admin_password(
  admin_id uuid,
  new_password text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Admin mavjudligini tekshirish
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE id = admin_id) THEN
    RAISE EXCEPTION 'Admin topilmadi';
  END IF;

  -- Parolni yangilash
  UPDATE admin_users 
  SET password_hash = crypt(new_password, gen_salt('bf'))
  WHERE id = admin_id;
END;
$$;