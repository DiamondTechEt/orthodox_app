/*
  # Ethiopian Orthodox Mezmur Application Database Schema

  ## Overview
  Complete database schema for a mobile application that manages Ethiopian Orthodox spiritual songs (Mezmurs) with authentication, categories, favorites, and offline download tracking.

  ## Tables Created

  1. **profiles**
     - Extends Supabase auth.users with custom profile data
     - Fields: id (uuid), username (text), avatar_url (text), created_at, updated_at
     - Links to auth.users via foreign key

  2. **categories**
     - Organizes Mezmurs into groups (Saint, Holy Days, Praise, etc.)
     - Fields: id (uuid), name (text), description (text), icon (text), created_at

  3. **mezmurs**
     - Core table storing Mezmur information
     - Fields: id (uuid), title, artist, category_id, audio_url, poem (lyrics), duration, image_url, play_count, created_at, updated_at
     - Related to categories table

  4. **favorites**
     - Tracks user's favorite Mezmurs
     - Fields: id (uuid), user_id, mezmur_id, created_at
     - Junction table between users and mezmurs

  5. **downloads**
     - Tracks offline downloads for each user
     - Fields: id (uuid), user_id, mezmur_id, local_path, downloaded_at
     - Enables offline playback functionality

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies restrict access based on authentication and ownership
  - Public read access for mezmurs and categories
  - Private access for user-specific data (profiles, favorites, downloads)

  ## Important Notes
  - All timestamps use timestamptz for timezone awareness
  - Foreign keys ensure referential integrity
  - Indexes added for performance on frequently queried columns
  - Triggers maintain updated_at timestamps automatically
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create mezmurs table
CREATE TABLE IF NOT EXISTS mezmurs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  audio_url text NOT NULL,
  poem text,
  duration integer DEFAULT 0,
  image_url text,
  play_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE mezmurs ENABLE ROW LEVEL SECURITY;

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mezmur_id uuid REFERENCES mezmurs(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, mezmur_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create downloads table (for offline tracking)
CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mezmur_id uuid REFERENCES mezmurs(id) ON DELETE CASCADE NOT NULL,
  local_path text NOT NULL,
  downloaded_at timestamptz DEFAULT now(),
  UNIQUE(user_id, mezmur_id)
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mezmurs_category ON mezmurs(category_id);
CREATE INDEX IF NOT EXISTS idx_mezmurs_title ON mezmurs(title);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON downloads(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mezmurs_updated_at ON mezmurs;
CREATE TRIGGER update_mezmurs_updated_at
  BEFORE UPDATE ON mezmurs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for mezmurs (public read)
CREATE POLICY "Anyone can view mezmurs"
  ON mezmurs FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for downloads
CREATE POLICY "Users can view own downloads"
  ON downloads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own downloads"
  ON downloads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own downloads"
  ON downloads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own downloads"
  ON downloads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);