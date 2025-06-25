export interface Deck {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewCard {
  id: string;
  deck_id: string;
  content: any; // Quill Delta format
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  review_card_id: string;
  content: any; // Quill Delta format
  image_url: string;
  feedback: 'Easy' | 'Medium' | 'Hard' | '';
  created_at: string;
  updated_at: string;
}

export interface DeckWithCards extends Deck {
  review_cards?: ReviewCardWithFlashcards[];
}

export interface ReviewCardWithFlashcards extends ReviewCard {
  flashcards?: Flashcard[];
}