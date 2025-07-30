/*
  # Create admin user function

  1. Function
    - create_admin_user: Creates new admin user with hashed password
    - Uses PostgreSQL crypt for secure hashing

  2. Security
    - Server-side password hashing
    - Prevents duplicate usernames
*/

-- Create function to create admin user with hashed password
CREATE OR REPLACE FUNCTION create_admin_user(
    input_username TEXT,
    input_password TEXT,
    input_role TEXT DEFAULT 'sales'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if username already exists
    IF EXISTS (SELECT 1 FROM admin_users WHERE username = input_username) THEN
        RAISE EXCEPTION 'Username already exists';
    END IF;
    
    -- Insert new admin user with hashed password
    INSERT INTO admin_users (username, password_hash, role)
    VALUES (input_username, crypt(input_password, gen_salt('bf', 12)), input_role);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_admin_user(TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION create_admin_user(TEXT, TEXT, TEXT) TO authenticated;