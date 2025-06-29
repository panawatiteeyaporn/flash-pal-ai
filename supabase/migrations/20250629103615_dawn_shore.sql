/*
  # Add user progress tracking for study sessions

  1. New Tables
    - `user_study_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `deck_id` (uuid, foreign key to decks)
      - `review_card_id` (uuid, foreign key to review_cards)
      - `flashcard_id` (uuid, foreign key to flashcards, nullable)
      - `content_type` (text, 'review_card' or 'flashcard')
      - `seen_at` (timestamp)
      - `last_reviewed_at` (timestamp, nullable)

  2. Security
    - Enable RLS on user_study_progress table
    - Add policies for authenticated users to manage their own progress
*/

-- Create user_study_progress table
CREATE TABLE IF NOT EXISTS user_study_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  deck_id uuid REFERENCES decks(id) ON DELETE CASCADE NOT NULL,
  review_card_id uuid REFERENCES review_cards(id) ON DELETE CASCADE NOT NULL,
  flashcard_id uuid REFERENCES flashcards(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('review_card', 'flashcard')),
  seen_at timestamptz DEFAULT now(),
  last_reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_study_progress ENABLE ROW LEVEL SECURITY;

-- Policies for user_study_progress table
CREATE POLICY "Users can read their own study progress"
  ON user_study_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study progress"
  ON user_study_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study progress"
  ON user_study_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study progress"
  ON user_study_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_study_progress_user_id ON user_study_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_study_progress_deck_id ON user_study_progress(deck_id);
CREATE INDEX IF NOT EXISTS idx_user_study_progress_review_card_id ON user_study_progress(review_card_id);
CREATE INDEX IF NOT EXISTS idx_user_study_progress_flashcard_id ON user_study_progress(flashcard_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_study_progress_updated_at 
  BEFORE UPDATE ON user_study_progress 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create unique constraint to prevent duplicate progress entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_study_progress_unique 
  ON user_study_progress(user_id, deck_id, review_card_id, flashcard_id, content_type);