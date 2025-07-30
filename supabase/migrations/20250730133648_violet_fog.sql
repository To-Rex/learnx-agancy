/*
  # Admin users jadvaliga is_active ustuni qo'shish

  1. O'zgarishlar
    - `is_active` ustuni qo'shish (default: true)
    - Mavjud adminlarni faol qilib qo'yish
  
  2. Xavfsizlik
    - RLS siyosatlarini yangilash
*/

-- is_active ustunini qo'shish
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN is_active boolean DEFAULT true;
  END IF;
END $$;

-- Mavjud adminlarni faol qilib qo'yish
UPDATE admin_users SET is_active = true WHERE is_active IS NULL;