import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, BookOpen, Zap, Play, BarChart3, Edit3, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FlashcardService } from '../lib/flashcardService';
import { DeckWithCards } from '../types/flashcard';
import TiptapEditor from './TiptapEditor';

function DeckView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<DeckWithCards | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadDeck();
    }
  }, [id]);

  const loadDeck = async () => {
    if (!id) return;
    
    setLoading(true);
    const { data, error } = await FlashcardService.getDeckWithCards(id);
    
    if (error) {
      setError(error.message);
    } else {
      setDeck(data);
    }
    
    setLoading(false);
  };

  const handleDeleteDeck = async () => {
    if (!id) return;
    
    setDeleting(true);
    const { error } = await FlashcardService.deleteDeck(id);
    
    if (error) {
      setError(error.message);
      setDeleting(false);
    } else {
      navigate('/decks');
    }
  };

  const handleStartStudy = () => {
    if (id) {
      navigate(`/study/${id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canStartStudy = () => {
    return deck?.review_cards && deck.review_cards.length > 0 && 
           deck.review_cards.some(card => card.flashcards && card.flashcards.length > 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-4 h-4 bg-white rounded"></div>
          </div>
          <p className="text-gray-600">Loading deck...</p>
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Deck not found</h3>
          <p className="text-gray-600 mb-6">{error || 'The deck you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/decks"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
          >
            Back to Decks
          </Link>
        </div>
      </div>
    );
  }

  const totalFlashcards = deck.review_cards?.reduce((total, card) => total + (card.flashcards?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/decks" 
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Decks</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Deck Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/30 mb-8">
          <div className="space-y-6">
            {/* Title and Description */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{deck.name}</h1>
              {deck.description && (
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{deck.description}</p>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>{deck.review_cards?.length || 0} Review Cards</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>{totalFlashcards} Flashcards</span>
              </div>
              <div className="text-gray-400">
                Created {formatDate(deck.created_at)}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleStartStudy}
                disabled={!canStartStudy()}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Play className="w-5 h-5" />
                <span>Start Study Session</span>
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-white/70 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 border border-white/30 flex items-center justify-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>View Progress</span>
                </button>
                
                <Link
                  to={`/edit-deck/${id}`}
                  className="bg-white/70 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 border border-white/30 flex items-center justify-center space-x-2"
                >
                  <Edit3 className="w-5 h-5" />
                  <span>Edit Deck</span>
                </Link>

                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-white/70 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-white/30 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Deck</span>
                </button>
              </div>
            </div>

            {!canStartStudy() && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-700 text-sm">
                  <strong>Note:</strong> Add review cards and flashcards to start studying this deck.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review Cards */}
        {deck.review_cards && deck.review_cards.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Review Cards</h2>
            </div>
            
            {deck.review_cards.map((reviewCard, index) => (
              <div key={reviewCard.id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Review Card {index + 1}</h3>
                  </div>
                </div>
                
                <div className="mb-6">
                  <TiptapEditor
                    value={reviewCard.content}
                    onChange={() => {}}
                    readOnly={true}
                  />
                </div>
                
                {/* Flashcards for this review card */}
                {reviewCard.flashcards && reviewCard.flashcards.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-purple-500" />
                        <h4 className="font-medium text-gray-900">
                          Flashcards ({reviewCard.flashcards.length})
                        </h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviewCard.flashcards.map((flashcard, flashcardIndex) => (
                        <div key={flashcard.id} className="bg-white/50 rounded-xl p-4 border border-white/20">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-xs font-medium text-purple-600">
                              Flashcard {flashcardIndex + 1}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="text-xs font-medium text-gray-500 mb-2">Front</div>
                              <TiptapEditor
                                value={flashcard.front_content}
                                onChange={() => {}}
                                readOnly={true}
                              />
                            </div>
                            
                            <div>
                              <div className="text-xs font-medium text-gray-500 mb-2">Back</div>
                              <TiptapEditor
                                value={flashcard.back_content}
                                onChange={() => {}}
                                readOnly={true}
                              />
                            </div>
                          </div>
                          
                          {flashcard.feedback && (
                            <div className="mt-2 text-xs text-gray-500">
                              Last feedback: {flashcard.feedback}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cards yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your deck by adding review cards and flashcards
            </p>
            <Link
              to={`/edit-deck/${id}`}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto w-fit"
            >
              <BookOpen className="w-5 h-5" />
              <span>Add Your First Card</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Deck</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "<strong>{deck.name}</strong>"? This will permanently remove the deck and all its review cards and flashcards.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDeck}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? 'Deleting...' : 'Delete Deck'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeckView;