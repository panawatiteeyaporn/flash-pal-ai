import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, RotateCcw, ChevronRight, Eye, EyeOff, BookOpen, Zap, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FlashcardService } from '../lib/flashcardService';
import { DeckWithCards, ReviewCard, Flashcard } from '../types/flashcard';
import TiptapEditor from './TiptapEditor';

interface StudyItem {
  type: 'flashcard' | 'review';
  data: Flashcard | ReviewCard;
  reviewCardIndex: number;
  flashcardIndex?: number;
}

function StudySession() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [deck, setDeck] = useState<DeckWithCards | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Study session state
  const [studyItems, setStudyItems] = useState<StudyItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    if (id) {
      loadDeckAndSetupStudy();
    }
  }, [id]);

  const loadDeckAndSetupStudy = async () => {
    if (!id) return;
    
    setLoading(true);
    const { data, error } = await FlashcardService.getDeckWithCards(id);
    
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setError('Deck not found');
      setLoading(false);
      return;
    }

    setDeck(data);
    setupStudySequence(data);
    setLoading(false);
  };

  const setupStudySequence = (deckData: DeckWithCards) => {
    const items: StudyItem[] = [];
    
    if (!deckData.review_cards || deckData.review_cards.length === 0) {
      setSessionComplete(true);
      return;
    }

    deckData.review_cards.forEach((reviewCard, reviewIndex) => {
      const flashcards = reviewCard.flashcards || [];
      
      if (flashcards.length > 0) {
        // Add first flashcard of this review card
        items.push({
          type: 'flashcard',
          data: flashcards[0],
          reviewCardIndex: reviewIndex,
          flashcardIndex: 0
        });
        
        // Add the review card content
        items.push({
          type: 'review',
          data: reviewCard,
          reviewCardIndex: reviewIndex
        });
        
        // Add remaining flashcards (if any)
        for (let i = 1; i < flashcards.length; i++) {
          items.push({
            type: 'flashcard',
            data: flashcards[i],
            reviewCardIndex: reviewIndex,
            flashcardIndex: i
          });
        }
      } else {
        // If no flashcards, just add the review card
        items.push({
          type: 'review',
          data: reviewCard,
          reviewCardIndex: reviewIndex
        });
      }
    });

    setStudyItems(items);
    
    if (items.length === 0) {
      setSessionComplete(true);
    }
  };

  const handleNext = () => {
    if (currentItemIndex < studyItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setShowBack(false);
    } else {
      setSessionComplete(true);
    }
  };

  const handleFlashcardClick = () => {
    if (currentItem?.type === 'flashcard') {
      setShowBack(!showBack);
    }
  };

  const restartSession = () => {
    setCurrentItemIndex(0);
    setShowBack(false);
    setSessionComplete(false);
  };

  const currentItem = studyItems[currentItemIndex];
  const progress = studyItems.length > 0 ? ((currentItemIndex + 1) / studyItems.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-4 h-4 bg-white rounded"></div>
          </div>
          <p className="text-gray-600">Loading study session...</p>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to start study session</h3>
          <p className="text-gray-600 mb-6">{error || 'The deck could not be loaded.'}</p>
          <Link
            to={`/deck/${id}`}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
          >
            Back to Deck
          </Link>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
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
                  <span>Back to Deck</span>
                </Link>
                
                <div className="h-6 w-px bg-gray-300"></div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    FlashPalAI
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 hidden sm:block">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </div>
            </div>
          </div>
        </nav>

        {/* Session Complete */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Session Complete!</h1>
            <p className="text-gray-600 mb-8">
              Great job! You've completed your study session for "{deck.name}".
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restartSession}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Study Again</span>
              </button>
              
              <Link
                to={`/deck/${id}`}
                className="bg-white/70 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 border border-white/30 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Back to Deck</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <span>Exit Study</span>
              </Link>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  FlashPalAI
                </span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 hidden sm:block">
              Welcome, {user?.user_metadata?.full_name || user?.email}
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">{deck.name}</h2>
            <span className="text-sm text-gray-600">
              {currentItemIndex + 1} of {studyItems.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Study Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentItem && (
          <div className="space-y-6">
            {/* Content Type Indicator */}
            <div className="flex items-center justify-center">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                currentItem.type === 'flashcard' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-indigo-100 text-indigo-700'
              }`}>
                {currentItem.type === 'flashcard' ? (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Flashcard {(currentItem.flashcardIndex || 0) + 1}</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Review Content</span>
                  </>
                )}
              </div>
            </div>

            {/* Flashcard */}
            {currentItem.type === 'flashcard' && (
              <div className="flex flex-col items-center space-y-6">
                <div 
                  onClick={handleFlashcardClick}
                  className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl cursor-pointer hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] min-h-[400px] flex flex-col justify-center"
                >
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                      showBack ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {showBack ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showBack ? 'Back' : 'Front'}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full">
                      <TiptapEditor
                        value={showBack 
                          ? (currentItem.data as Flashcard).back_content 
                          : (currentItem.data as Flashcard).front_content
                        }
                        onChange={() => {}}
                        readOnly={true}
                        className="border-none bg-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                      {showBack ? 'Click to see front' : 'Click to reveal answer'}
                    </p>
                  </div>
                </div>

                {/* Show Next button only when back is revealed */}
                {showBack && (
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Review Card */}
            {currentItem.type === 'review' && (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Review Card {currentItem.reviewCardIndex + 1}
                    </h3>
                    <p className="text-gray-600">Study this content carefully</p>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <TiptapEditor
                      value={(currentItem.data as ReviewCard).content}
                      onChange={() => {}}
                      readOnly={true}
                      className="border-none bg-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudySession;