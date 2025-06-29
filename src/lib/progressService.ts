import { supabase } from './supabase';

export interface StudyProgress {
  id: string;
  user_id: string;
  deck_id: string;
  review_card_id: string;
  flashcard_id?: string;
  content_type: 'review_card' | 'flashcard';
  seen_at: string;
  last_reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export class ProgressService {
  // Mark content as seen during study session
  static async markContentAsSeen(
    deckId: string,
    reviewCardId: string,
    contentType: 'review_card' | 'flashcard',
    flashcardId?: string
  ): Promise<{ error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: { message: 'User not authenticated' } };
    }

    const { error } = await supabase
      .from('user_study_progress')
      .upsert([
        {
          user_id: user.id,
          deck_id: deckId,
          review_card_id: reviewCardId,
          flashcard_id: flashcardId,
          content_type: contentType,
          seen_at: new Date().toISOString()
        }
      ], {
        onConflict: 'user_id,deck_id,review_card_id,flashcard_id,content_type'
      });

    return { error };
  }

  // Mark content as reviewed during review session
  static async markContentAsReviewed(
    deckId: string,
    reviewCardId: string,
    contentType: 'review_card' | 'flashcard',
    flashcardId?: string
  ): Promise<{ error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: { message: 'User not authenticated' } };
    }

    const { error } = await supabase
      .from('user_study_progress')
      .upsert([
        {
          user_id: user.id,
          deck_id: deckId,
          review_card_id: reviewCardId,
          flashcard_id: flashcardId,
          content_type: contentType,
          last_reviewed_at: new Date().toISOString()
        }
      ], {
        onConflict: 'user_id,deck_id,review_card_id,flashcard_id,content_type'
      });

    return { error };
  }

  // Get unseen content for study session
  static async getUnseenContent(deckId: string): Promise<{ data: any | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    // Get deck with all content
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .select(`
        *,
        review_cards (
          *,
          flashcards (
            id,
            review_card_id,
            front_content,
            front_image_url,
            back_content,
            back_image_url,
            feedback,
            created_at,
            updated_at
          )
        )
      `)
      .eq('id', deckId)
      .single();

    if (deckError || !deck) {
      return { data: null, error: deckError };
    }

    // Get user's progress for this deck
    const { data: progress, error: progressError } = await supabase
      .from('user_study_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('deck_id', deckId);

    if (progressError) {
      return { data: null, error: progressError };
    }

    // Filter out seen content
    const seenReviewCards = new Set(
      progress?.filter(p => p.content_type === 'review_card').map(p => p.review_card_id) || []
    );
    const seenFlashcards = new Set(
      progress?.filter(p => p.content_type === 'flashcard').map(p => p.flashcard_id) || []
    );

    const filteredReviewCards = deck.review_cards?.map(reviewCard => {
      const isReviewCardSeen = seenReviewCards.has(reviewCard.id);
      const filteredFlashcards = reviewCard.flashcards?.filter(flashcard => 
        !seenFlashcards.has(flashcard.id)
      ) || [];

      // Include review card if either the review card itself is unseen OR it has unseen flashcards
      if (!isReviewCardSeen || filteredFlashcards.length > 0) {
        return {
          ...reviewCard,
          flashcards: filteredFlashcards,
          isReviewCardSeen
        };
      }
      return null;
    }).filter(Boolean) || [];

    return {
      data: {
        ...deck,
        review_cards: filteredReviewCards
      },
      error: null
    };
  }

  // Get seen content for review session
  static async getSeenContent(deckId: string): Promise<{ data: any | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    // Get deck with all content
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .select(`
        *,
        review_cards (
          *,
          flashcards (
            id,
            review_card_id,
            front_content,
            front_image_url,
            back_content,
            back_image_url,
            feedback,
            created_at,
            updated_at
          )
        )
      `)
      .eq('id', deckId)
      .single();

    if (deckError || !deck) {
      return { data: null, error: deckError };
    }

    // Get user's progress for this deck
    const { data: progress, error: progressError } = await supabase
      .from('user_study_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('deck_id', deckId);

    if (progressError) {
      return { data: null, error: progressError };
    }

    // Filter to only show seen content
    const seenReviewCards = new Set(
      progress?.filter(p => p.content_type === 'review_card').map(p => p.review_card_id) || []
    );
    const seenFlashcards = new Set(
      progress?.filter(p => p.content_type === 'flashcard').map(p => p.flashcard_id) || []
    );

    const filteredReviewCards = deck.review_cards?.map(reviewCard => {
      const isReviewCardSeen = seenReviewCards.has(reviewCard.id);
      const filteredFlashcards = reviewCard.flashcards?.filter(flashcard => 
        seenFlashcards.has(flashcard.id)
      ) || [];

      // Include review card only if it has been seen AND has seen flashcards
      if (isReviewCardSeen && filteredFlashcards.length > 0) {
        return {
          ...reviewCard,
          flashcards: filteredFlashcards
        };
      }
      return null;
    }).filter(Boolean) || [];

    return {
      data: {
        ...deck,
        review_cards: filteredReviewCards
      },
      error: null
    };
  }

  // Get progress statistics for a deck
  static async getDeckProgress(deckId: string): Promise<{ data: any | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    // Get total content count
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .select(`
        *,
        review_cards (
          id,
          flashcards (id)
        )
      `)
      .eq('id', deckId)
      .single();

    if (deckError || !deck) {
      return { data: null, error: deckError };
    }

    // Get user's progress
    const { data: progress, error: progressError } = await supabase
      .from('user_study_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('deck_id', deckId);

    if (progressError) {
      return { data: null, error: progressError };
    }

    const totalReviewCards = deck.review_cards?.length || 0;
    const totalFlashcards = deck.review_cards?.reduce((total, card) => total + (card.flashcards?.length || 0), 0) || 0;
    
    const seenReviewCards = progress?.filter(p => p.content_type === 'review_card').length || 0;
    const seenFlashcards = progress?.filter(p => p.content_type === 'flashcard').length || 0;
    
    const reviewedReviewCards = progress?.filter(p => p.content_type === 'review_card' && p.last_reviewed_at).length || 0;
    const reviewedFlashcards = progress?.filter(p => p.content_type === 'flashcard' && p.last_reviewed_at).length || 0;

    return {
      data: {
        totalReviewCards,
        totalFlashcards,
        seenReviewCards,
        seenFlashcards,
        reviewedReviewCards,
        reviewedFlashcards,
        totalContent: totalReviewCards + totalFlashcards,
        seenContent: seenReviewCards + seenFlashcards,
        reviewedContent: reviewedReviewCards + reviewedFlashcards
      },
      error: null
    };
  }
}