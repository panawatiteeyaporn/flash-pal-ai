import { supabase } from './supabase';
import { Deck, ReviewCard, Flashcard } from '../types/flashcard';

export class FlashcardService {
  // Deck operations
  static async createDeck(name: string, description: string = ''): Promise<{ data: Deck | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('decks')
      .insert([
        {
          user_id: user.id,
          name,
          description
        }
      ])
      .select()
      .single();

    return { data, error };
  }

  static async getUserDecks(): Promise<{ data: Deck[] | null; error: any }> {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .order('updated_at', { ascending: false });

    return { data, error };
  }

  static async getDeckById(id: string): Promise<{ data: Deck | null; error: any }> {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }

  static async updateDeck(id: string, updates: Partial<Deck>): Promise<{ data: Deck | null; error: any }> {
    const { data, error } = await supabase
      .from('decks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  static async deleteDeck(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', id);

    return { error };
  }

  // Review Card operations
  static async createReviewCard(deckId: string, content: any, imageUrl: string = ''): Promise<{ data: ReviewCard | null; error: any }> {
    const { data, error } = await supabase
      .from('review_cards')
      .insert([
        {
          deck_id: deckId,
          content,
          image_url: imageUrl
        }
      ])
      .select()
      .single();

    return { data, error };
  }

  static async getReviewCardsByDeck(deckId: string): Promise<{ data: ReviewCard[] | null; error: any }> {
    const { data, error } = await supabase
      .from('review_cards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: true });

    return { data, error };
  }

  static async updateReviewCard(id: string, updates: Partial<ReviewCard>): Promise<{ data: ReviewCard | null; error: any }> {
    const { data, error } = await supabase
      .from('review_cards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  static async deleteReviewCard(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('review_cards')
      .delete()
      .eq('id', id);

    return { error };
  }

  // Flashcard operations
  static async createFlashcard(reviewCardId: string, content: any, imageUrl: string = ''): Promise<{ data: Flashcard | null; error: any }> {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([
        {
          review_card_id: reviewCardId,
          content,
          image_url: imageUrl
        }
      ])
      .select()
      .single();

    return { data, error };
  }

  static async getFlashcardsByReviewCard(reviewCardId: string): Promise<{ data: Flashcard[] | null; error: any }> {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('review_card_id', reviewCardId)
      .order('created_at', { ascending: true });

    return { data, error };
  }

  static async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<{ data: Flashcard | null; error: any }> {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  static async updateFlashcardFeedback(id: string, feedback: 'Easy' | 'Medium' | 'Hard'): Promise<{ data: Flashcard | null; error: any }> {
    return this.updateFlashcard(id, { feedback });
  }

  static async deleteFlashcard(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id);

    return { error };
  }

  // Complex queries
  static async getDeckWithCards(deckId: string): Promise<{ data: any | null; error: any }> {
    const { data, error } = await supabase
      .from('decks')
      .select(`
        *,
        review_cards (
          *,
          flashcards (*)
        )
      `)
      .eq('id', deckId)
      .single();

    return { data, error };
  }
}