@@ .. @@
 -- Create admin_users table
 CREATE TABLE IF NOT EXISTS admin_users (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   username text UNIQUE NOT NULL,
   password_hash text NOT NULL,
+  role text DEFAULT 'admin',
   created_at timestamptz DEFAULT now()
 );
@@ .. @@
 -- Insert default admin user (username: admin, password: admin)
 -- Note: In production, use a proper password hashing library
-INSERT INTO admin_users (username, password_hash) VALUES
-('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
+INSERT INTO admin_users (username, password_hash, role) VALUES
+('admin', 'admin', 'super_admin'),
+('manager', 'manager123', 'manager'),
+('sales', 'sales123', 'sales');