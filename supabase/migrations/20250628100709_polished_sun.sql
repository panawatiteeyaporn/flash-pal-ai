/*
  # Fix flashcard schema to support front and back sides

  1. Schema Changes
    - Rename existing `content` column to `front_content`
    - Rename existing `image_url` column to `front_image_url`
    - Add `back_content` column (jsonb)
    - Add `back_image_url` column (text)

  2. Data Migration
    - Existing flashcards will have their content moved to front_content
    - Back content will be initialized as empty
    - This is a breaking change that requires data cleanup

  3. Security
    - RLS policies remain the same as they reference table structure, not column names
*/

-- Add new columns for back content
DO $$
BEGIN
  -- Add back_content column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'flashcards' AND column_name = 'back_content'
  ) THEN
    ALTER TABLE flashcards ADD COLUMN back_content jsonb NOT NULL DEFAULT '{"ops":[]}';
  END IF;

  -- Add back_image_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'flashcards' AND column_name = 'back_image_url'
  ) THEN
    ALTER TABLE flashcards ADD COLUMN back_image_url text DEFAULT '';
  END IF;
END $$;

-- Rename existing columns to front_* if they haven't been renamed yet
DO $$
BEGIN
  -- Rename content to front_content if content column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'flashcards' AND column_name = 'content'
  ) THEN
    ALTER TABLE flashcards RENAME COLUMN content TO front_content;
  END IF;

  -- Rename image_url to front_image_url if image_url column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'flashcards' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE flashcards RENAME COLUMN image_url TO front_image_url;
  END IF;
END $$;