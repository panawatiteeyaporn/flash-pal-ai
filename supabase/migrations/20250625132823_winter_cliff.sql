/*
  # Create flashcard system tables

  1. New Tables
    - `decks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, not null)
      - `description` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `review_cards`
      - `id` (uuid, primary key)
      - `deck_id` (uuid, foreign key to decks)
      - `content` (jsonb, stores Quill Delta format)
      - `image_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `flashcards`
      - `id` (uuid, primary key)
      - `review_card_id` (uuid, foreign key to review_cards)
      - `content` (jsonb, stores Quill Delta format)
      - `image_url` (text, optional)
      - `feedback` (text, stores Easy/Medium/Hard)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Ensure users can only access decks they own
    - Cascade permissions through deck ownership
*/

-- Create decks table
CREATE TABLE IF NOT EXISTS decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create review_cards table
CREATE TABLE IF NOT EXISTS review_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid REFERENCES decks(id) ON DELETE CASCADE NOT NULL,
  content jsonb NOT NULL DEFAULT '{"ops":[]}',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_card_id uuid REFERENCES review_cards(id) ON DELETE CASCADE NOT NULL,
  content jsonb NOT NULL DEFAULT '{"ops":[]}',
  image_url text DEFAULT '',
  feedback text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Policies for decks table
CREATE POLICY "Users can read their own decks"
  ON decks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own decks"
  ON decks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks"
  ON decks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decks"
  ON decks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for review_cards table
CREATE POLICY "Users can read review cards from their decks"
  ON review_cards
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = review_cards.deck_id 
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert review cards to their decks"
  ON review_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = review_cards.deck_id 
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update review cards in their decks"
  ON review_cards
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = review_cards.deck_id 
      AND decks.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = review_cards.deck_id 
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete review cards from their decks"
  ON review_cards
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM decks 
      WHERE decks.id = review_cards.deck_id 
      AND decks.user_id = auth.uid()
    )
  );

-- Policies for flashcards table
CREATE POLICY "Users can read flashcards from their review cards"
  ON flashcards
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM review_cards rc
      JOIN decks d ON rc.deck_id = d.id
      WHERE rc.id = flashcards.review_card_id 
      AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert flashcards to their review cards"
  ON flashcards
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM review_cards rc
      JOIN decks d ON rc.deck_id = d.id
      WHERE rc.id = flashcards.review_card_id 
      AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update flashcards in their review cards"
  ON flashcards
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM review_cards rc
      JOIN decks d ON rc.deck_id = d.id
      WHERE rc.id = flashcards.review_card_id 
      AND d.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM review_cards rc
      JOIN decks d ON rc.deck_id = d.id
      WHERE rc.id = flashcards.review_card_id 
      AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete flashcards from their review cards"
  ON flashcards
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM review_cards rc
      JOIN decks d ON rc.deck_id = d.id
      WHERE rc.id = flashcards.review_card_id 
      AND d.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON decks(user_id);
CREATE INDEX IF NOT EXISTS idx_review_cards_deck_id ON review_cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_review_card_id ON flashcards(review_card_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_decks_updated_at 
  BEFORE UPDATE ON decks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_cards_updated_at 
  BEFORE UPDATE ON review_cards 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at 
  BEFORE UPDATE ON flashcards 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();