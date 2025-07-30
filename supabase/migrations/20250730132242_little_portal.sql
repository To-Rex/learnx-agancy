/*
  # Create password verification function

  1. Function
    - verify_admin_password: Verifies admin password using crypt
    - Returns boolean true/false

  2. Security
    - Uses PostgreSQL's crypt function for verification
    - Secure password comparison
*/

-- Create function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(input_username TEXT, input_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    -- Get the stored password hash
    SELECT password_hash INTO stored_hash
    FROM admin_users
    WHERE username = input_username;
    
    -- If user not found, return false
    IF stored_hash IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Verify password using crypt
    RETURN stored_hash = crypt(input_password, stored_hash);
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION verify_admin_password(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_admin_password(TEXT, TEXT) TO authenticated;