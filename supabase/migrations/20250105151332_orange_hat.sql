/*
  # Update activities table and policies

  1. Changes:
    - Add visibility and description fields if they don't exist
    - Update policies for public/private activities
    
  2. Security:
    - Drop existing policies first to avoid conflicts
    - Create new policies for visibility control
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view activities" ON activities;
DROP POLICY IF EXISTS "Only owners can modify activities" ON activities;
DROP POLICY IF EXISTS "Users can create their own activities" ON activities;
DROP POLICY IF EXISTS "Users can update their own activities" ON activities;
DROP POLICY IF EXISTS "Users can delete their own activities" ON activities;
DROP POLICY IF EXISTS "Only owners can update activities" ON activities;
DROP POLICY IF EXISTS "Only owners can delete activities" ON activities;

-- Add new columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'activities' AND column_name = 'visibility'
  ) THEN
    ALTER TABLE activities ADD COLUMN visibility text NOT NULL DEFAULT 'private';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'activities' AND column_name = 'description'
  ) THEN
    ALTER TABLE activities ADD COLUMN description text;
  END IF;
END $$;

-- Create new policies
CREATE POLICY "Users can view own and public activities"
  ON activities
  FOR SELECT
  USING (
    auth.uid() = user_id -- Own activities
    OR
    visibility = 'public' -- Public activities
  );

CREATE POLICY "Users can create activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON activities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities"
  ON activities
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);