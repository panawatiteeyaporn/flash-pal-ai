import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, ChevronRight, RotateCcw, CheckCircle, BookOpen, Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ProgressService } from '../lib/progressService';
import { DeckWithCards } from '../types/flashcard';
import TiptapEditor from './TiptapEditor';

type ReviewPhase = 'flashcard-front' | 'flashcard-back' | 'review-card' | 'completed';

interface ReviewState {
  currentReviewCardIndex: number;
  currentFlashcardIndex: number;
  phase: ReviewPhase;
  showingFirstFlashcard: boolean;
}

function ReviewSession() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [deck, setDeck] = useState<DeckWithCards | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewState, setReviewState] = useState<ReviewState>({
    currentReviewCardIndex: 0,
    currentFlashcardIndex: 0,
    phase: 'flashcard-front',
    showingFirstFlashcard: true
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (id) {
      loadSeenContent();
    }
  }, [id]);

  const loadSeenContent = async () => {
    if (!id) return;
    
    setLoading(true);
    const { data, error } = await ProgressService.getSeenContent(id);
    
    if (error) {
      setError(error.message);
    } else if (data && data.review_cards && data.review_cards.length > 0) {
      setDeck(data);
    } else {
      setError('No content available for review. Complete a study session first!');
    }
    
    setLoading(false);
  };

  const markContentAsReviewed = async (contentType: 'review_card' | 'flashcard', flashcardId?: string) => {
    if (!id || !deck?.review_cards) return;
    
    const currentReviewCard = deck.review_cards[reviewState.currentReviewCardIndex];
    if (!currentReviewCard) return;

    await ProgressService.markContentAsReviewed(
      id,
      currentReviewCard.id,
      contentType,
      flashcardId
    );
  };

  const getCurrentReviewCard = () => {
    if (!deck?.review_cards) return null;
    return deck.review_cards[reviewState.currentReviewCardIndex];
  };

  const getCurrentFlashcard = () => {
    const reviewCard = getCurrentReviewCard();
    if (!reviewCard?.flashcards) return null;
    return reviewCard.flashcards[reviewState.currentFlashcardIndex];
  };

  const getAvailableFlashcards = () => {
    const reviewCard = getCurrentReviewCard();
    if (!reviewCard?.flashcards) return [];
    
    // If showing first flashcard, return all flashcards
    // If in review phase, exclude the first flashcard (already shown)
    return reviewState.showingFirstFlashcard 
      ? reviewCard.flashcards 
      : reviewCard.flashcards.slice(1);
  };

  const handleFlashcardClick = async () => {
    if (reviewState.phase === 'flashcard-front') {
      setReviewState(prev => ({ ...prev, phase: 'flashcard-back' }));
      
      // Mark flashcard as reviewed when user views the back
      const currentFlashcard = getCurrentFlashcard();
      if (currentFlashcard) {
        await markContentAsReviewed('flashcard', currentFlashcard.id);
      }
    }
  };

  const handleNext = async () => {
    const reviewCard = getCurrentReviewCard();
    const availableFlashcards = getAvailableFlashcards();
    
    if (reviewState.phase === 'flashcard-back') {
      if (reviewState.showingFirstFlashcard) {
        // Move to review card after first flashcard
        setReviewState(prev => ({ 
          ...prev, 
          phase: 'review-card',
          showingFirstFlashcard: false
        }));
      } else {
        // Move to next flashcard or complete review card
        if (reviewState.currentFlashcardIndex < availableFlashcards.length - 1) {
          setReviewState(prev => ({ 
            ...prev, 
            currentFlashcardIndex: prev.currentFlashcardIndex + 1,
            phase: 'flashcard-front'
          }));
        } else {
          // Completed all flashcards for this review card
          moveToNextReviewCard();
        }
      }
    } else if (reviewState.phase === 'review-card') {
      // Mark review card as reviewed
      await markContentAsReviewed('review_card');
      
      // Start with remaining flashcards (excluding the first one)
      if (availableFlashcards.length > 0) {
        setReviewState(prev => ({ 
          ...prev, 
          currentFlashcardIndex: 1, // Start from second flashcard
          phase: 'flashcard-front'
        }));
      } else {
        // No more flashcards, move to next review card
        moveToNextReviewCard();
      }
    }
  };

  const moveToNextReviewCard = () => {
    if (!deck?.review_cards) return;
    
    if (reviewState.currentReviewCardIndex < deck.review_cards.length - 1) {
      // Show notification and move to next review card
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setReviewState({
          currentReviewCardIndex: reviewState.currentReviewCardIndex + 1,
          currentFlashcardIndex: 0,
          phase: 'flashcard-front',
          showingFirstFlashcard: true
        });
      }, 2000);
    } else {
      // Completed all review cards
      setReviewState(prev => ({ ...prev, phase: 'completed' }));
    }
  };

  const getProgressPercentage = () => {
    if (!deck?.review_cards) return 0;
    
    const totalReviewCards = deck.review_cards.length;
    const currentProgress = reviewState.currentReviewCardIndex;
    
    // Add partial progress within current review card
    const reviewCard = getCurrentReviewCard();
    if (reviewCard?.flashcards) {
      const totalFlashcards = reviewCard.flashcards.length;
      let currentFlashcardProgress = 0;
      
      if (reviewState.showingFirstFlashcard) {
        currentFlashcardProgress = reviewState.phase === 'flashcard-back' ? 0.5 : 0;
      } else {
        currentFlashcardProgress = reviewState.phase === 'review-card' ? 0.5 : 
          (reviewState.currentFlashcardIndex + (reviewState.phase === 'flashcard-back' ? 0.5 : 0)) / totalFlashcards;
      }
      
      return ((currentProgress + currentFlashcardProgress) / totalReviewCards) * 100;
    }
    
    return (currentProgress / totalReviewCards) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-4 h-4 bg-white rounded"></div>
          </div>
          <p className="text-gray-600">Loading review session...</p>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Cannot start review session</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/deck/${id}`}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              Back to Deck
            </Link>
            {error.includes('Complete a study session first') && (
              <Link
                to={`/study/${id}`}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
              >
                Start Study Session
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentReviewCard = getCurrentReviewCard();
  const currentFlashcard = getCurrentFlashcard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to={`/deck/${id}`} 
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Exit Review</span>
              </Link>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  FlashPalAI
                </span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 hidden sm:block">
              Review Session: {deck.name}
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Review Card {reviewState.currentReviewCardIndex + 1} of {deck.review_cards?.length || 0}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(getProgressPercentage())}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reviewState.phase === 'completed' ? (
          // Completion Screen
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Review Session Complete!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Excellent work! You've reviewed all your studied content. Keep up the great learning!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setReviewState({
                    currentReviewCardIndex: 0,
                    currentFlashcardIndex: 0,
                    phase: 'flashcard-front',
                    showingFirstFlashcard: true
                  });
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Review Again</span>
              </button>
              <Link
                to={`/deck/${id}`}
                className="bg-white/70 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 border border-white/30 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Deck</span>
              </Link>
            </div>
          </div>
        ) : reviewState.phase === 'review-card' ? (
          // Review Card Phase
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">Review Content</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Review Card {reviewState.currentReviewCardIndex + 1}
              </h1>
              <p className="text-gray-600">
                Review this content before continuing with the flashcards
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
              <TiptapEditor
                value={currentReviewCard?.content}
                onChange={() => {}}
                readOnly={true}
                className="mb-6"
              />
              
              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Continue to Flashcards</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Flashcard Phase
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full mb-4">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {reviewState.showingFirstFlashcard ? 'Review Flashcard' : 'Practice Flashcard'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Flashcard {reviewState.currentFlashcardIndex + 1}
              </h1>
              <p className="text-gray-600">
                {reviewState.phase === 'flashcard-front' 
                  ? 'Click the card to reveal the answer' 
                  : 'Review the answer and click Next to continue'
                }
              </p>
            </div>

            {/* Flashcard */}
            <div className="flex justify-center">
              <div 
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 max-w-2xl w-full min-h-[300px] flex flex-col justify-center cursor-pointer transition-all duration-300 hover:scale-105 ${
                  reviewState.phase === 'flashcard-front' ? 'hover:shadow-lg' : ''
                }`}
                onClick={handleFlashcardClick}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {reviewState.phase === 'flashcard-front' ? (
                      <Eye className="w-5 h-5 text-purple-500" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-pink-500" />
                    )}
                    <span className="text-sm font-medium text-gray-600">
                      {reviewState.phase === 'flashcard-front' ? 'Front' : 'Back'}
                    </span>
                  </div>
                  {reviewState.phase === 'flashcard-front' && (
                    <span className="text-xs text-gray-500">Click to flip</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <TiptapEditor
                    value={reviewState.phase === 'flashcard-front' 
                      ? currentFlashcard?.front_content 
                      : currentFlashcard?.back_content
                    }
                    onChange={() => {}}
                    readOnly={true}
                  />
                </div>
              </div>
            </div>

            {/* Next Button */}
            {reviewState.phase === 'flashcard-back' && (
              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notification Modal */}
      {showNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Great Review!</h3>
            <p className="text-gray-600">
              Moving to the next review card...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewSession;