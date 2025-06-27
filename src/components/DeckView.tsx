import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Brain, ArrowLeft, BookOpen, Zap, Plus, Edit3, Trash2, Play, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FlashcardService } from '../lib/flashcardService';
import { DeckWithCards } from '../types/flashcard';
import TiptapEditor from './TiptapEditor';

function DeckView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [deck, setDeck] = useState<DeckWithCards | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            
            <div className="text-sm text-gray-600">
              Welcome, {user?.user_metadata?.full_name || user?.email}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Deck Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{deck.name}</h1>
              {deck.description && (
                <p className="text-gray-600 mb-4">{deck.description}</p>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{deck.review_cards?.length || 0} Review Cards</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>{totalFlashcards} Flashcards</span>
                </div>
                <div className="text-gray-400">
                  Created {formatDate(deck.created_at)}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Start Study Session</span>
              </button>
              
              <button className="bg-white/70 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 border border-white/30 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>View Progress</span>
              </button>
              
              <button className="bg-white/70 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 border border-white/30 flex items-center space-x-2">
                <Edit3 className="w-5 h-5" />
                <span>Edit Deck</span>
              </button>
            </div>
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
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs font-medium text-purple-600">
                              Flashcard {flashcardIndex + 1}
                            </div>
                          </div>
                          
                          <TiptapEditor
                            value={flashcard.content}
                            onChange={() => {}}
                            readOnly={true}
                          />
                          
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
            <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto">
              <Plus className="w-5 h-5" />
              <span>Add Your First Card</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeckView;