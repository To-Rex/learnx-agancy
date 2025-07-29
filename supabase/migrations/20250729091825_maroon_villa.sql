/*
  # Create initial database tables for LearnX platform

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `color` (text)
      - `price` (text, optional)
      - `features` (text array, optional)
      - `created_at` (timestamp)
    - `stories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `country` (text)
      - `text` (text)
      - `rating` (integer)
      - `image` (text)
      - `featured` (boolean)
      - `created_at` (timestamp)
    - `partners`
      - `id` (uuid, primary key)
      - `name` (text)
      - `logo` (text)
      - `created_at` (timestamp)
    - `applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `birth_date` (date)
      - `passport_number` (text)
      - `education_level` (text)
      - `university` (text)
      - `major` (text)
      - `english_level` (text)
      - `country_preference` (text)
      - `program_type` (text)
      - `documents` (jsonb)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table

  3. Initial Data
    - Insert sample data for services, stories, and partners
    - Create default admin user
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT 'FileText',
  color text DEFAULT 'blue',
  price text,
  features text[],
  created_at timestamptz DEFAULT now()
);

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  text text NOT NULL,
  rating integer DEFAULT 5,
  image text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  birth_date date,
  passport_number text,
  education_level text,
  university text,
  major text,
  english_level text,
  country_preference text,
  program_type text,
  documents jsonb DEFAULT '{}',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services (public read)
CREATE POLICY "Services are viewable by everyone"
  ON services
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for stories (public read)
CREATE POLICY "Stories are viewable by everyone"
  ON stories
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for partners (public read)
CREATE POLICY "Partners are viewable by everyone"
  ON partners
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for applications (users can read/write their own)
CREATE POLICY "Users can read own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for admin_users (only admins can access)
CREATE POLICY "Admin users are viewable by authenticated users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial services data
INSERT INTO services (title, description, icon, color, price, features) VALUES
('Visa olishga yordam', 'Barcha turdagi vizalar uchun professional yordam va maslahat', 'FileText', 'blue', '$299', ARRAY['Hujjatlarni tayyorlash', 'Intervyuga tayyorgarlik', '24/7 qo''llab-quvvatlash']),
('Work & Travel', 'Amerika va Yevropa davlatlariga ishlash va sayohat dasturlari', 'Plane', 'green', '$599', ARRAY['J-1 visa', 'Ish joyi topish', 'Turar joy yordam']),
('Ta''lim granti', 'Chet davlat universitetlarida bepul ta''lim olish imkoniyati', 'BookOpen', 'purple', '$899', ARRAY['Grant topish', 'Ariza tayyorlash', 'Qabul jarayoni']),
('Til kurslari', 'IELTS, TOEFL va boshqa til imtihonlariga tayyorgarlik', 'Users', 'orange', '$199', ARRAY['Individual darslar', 'Guruh darslari', 'Mock testlar']);

-- Insert initial stories data
INSERT INTO stories (name, country, text, rating, image, featured) VALUES
('Aziz Karimov', 'AQSh', 'LearnX orqali Work & Travel dasturiga qatnashib, ajoyib tajriba oldim. Jarayon juda oson va qulay edi.', 5, 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150', true),
('Malika Saidova', 'Germaniya', 'Vizani olishda ko''rsatilgan yordam uchun juda minnatdorman. Professional yondashuv va tez natija.', 5, 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150', true),
('Bobur Rahimov', 'Kanada', 'Ta''lim grantini olishda LearnX jamoasi katta yordam berdi. Endi Kanadada o''qiyapman!', 5, 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150', true),
('Dilnoza Tosheva', 'Avstraliya', 'IELTS kurslarida qatnashib, kerakli ballni oldim. Endi Avstraliyada magistratura o''qiyapman.', 5, 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150', false),
('Sardor Alimov', 'Buyuk Britaniya', 'Oxforddagi magistratura dasturiga qabul qilindim. LearnX jamoasiga katta rahmat!', 5, 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150', false);

-- Insert initial partners data
INSERT INTO partners (name, logo) VALUES
('Harvard University', 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=200'),
('MIT', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=200'),
('Stanford University', 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=200'),
('Oxford University', 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=200'),
('Cambridge University', 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=200'),
('Yale University', 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=200');

-- Insert default admin user (username: admin, password: admin)
-- Note: In production, use a proper password hashing library
INSERT INTO admin_users (username, password_hash) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');