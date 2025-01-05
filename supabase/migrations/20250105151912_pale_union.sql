/*
  # Add status column to activities table

  1. Changes
    - Add status column using existing activity_status enum type
    - Update existing policies to handle status field

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control
*/

-- Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'activities' AND column_name = 'status'
  ) THEN
    ALTER TABLE activities ADD COLUMN status activity_status NOT NULL DEFAULT 'aguardando_atendimento';
  END IF;
END $$;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own and public activities" ON activities;
DROP POLICY IF EXISTS "Users can create activities" ON activities;
DROP POLICY IF EXISTS "Users can update own activities" ON activities;
DROP POLICY IF EXISTS "Users can delete own activities" ON activities;

-- Recreate policies
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