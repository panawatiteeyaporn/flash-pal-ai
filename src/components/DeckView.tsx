import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, BookOpen, Zap, Play, BarChart3, Edit3, Trash2, AlertTriangle, X, Calendar, Clock, Target, TrendingUp, Award, CheckCircle, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FlashcardService } from '../lib/flashcardService';
import { ProgressService } from '../lib/progressService';
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
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progressData, setProgressData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadDeck();
      loadProgressData();
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

  const loadProgressData = async () => {
    if (!id) return;
    
    const { data, error } = await ProgressService.getDeckProgress(id);
    
    if (!error && data) {
      setProgressData(data);
    }
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

  const handleStartReview = () => {
    if (id) {
      navigate(`/review/${id}`);
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

  const canStartReview = () => {
    return progressData && progressData.seenContent > 0;
  };

  // Mock progress data - replace with real data when available
  const getMockProgressData = () => {
    const totalFlashcards = deck?.review_cards?.reduce((total, card) => total + (card.flashcards?.length || 0), 0) || 0;
    const masteredCards = Math.floor(totalFlashcards * 0.65);
    const reviewingCards = Math.floor(totalFlashcards * 0.25);
    const newCards = totalFlashcards - masteredCards - reviewingCards;
    
    return {
      totalCards: totalFlashcards,
      masteredCards,
      reviewingCards,
      newCards,
      accuracy: 87,
      studyStreak: 5,
      totalStudyTime: 142, // minutes
      lastStudied: '2 hours ago',
      weeklyProgress: [
        { day: 'Mon', cards: 12, time: 25 },
        { day: 'Tue', cards: 8, time: 18 },
        { day: 'Wed', cards: 15, time: 32 },
        { day: 'Thu', cards: 10, time: 22 },
        { day: 'Fri', cards: 18, time: 35 },
        { day: 'Sat', cards: 6, time: 12 },
        { day: 'Sun', cards: 14, time: 28 }
      ],
      difficultyBreakdown: {
        easy: 45,
        medium: 35,
        hard: 20
      }
    };
  };

  const mockProgressData = getMockProgressData();

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
                <span>{deck.review_cards?.length || 0} Study Cards</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>{totalFlashcards} Flashcards</span>
              </div>
              {progressData && (
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>{progressData.seenContent}/{progressData.totalContent} Studied</span>
                </div>
              )}
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
              
              <button 
                onClick={handleStartReview}
                disabled={!canStartReview()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Start Review Session</span>
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowProgressModal(true)}
                  className="bg-white/70 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 border border-white/30 flex items-center justify-center space-x-2"
                >
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
                  <strong>Note:</strong> Add study cards and flashcards to start studying this deck.
                </p>
              </div>
            )}

            {!canStartReview() && progressData && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-700 text-sm">
                  <strong>Review Session:</strong> Complete a study session first to unlock review mode.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Study Cards */}
        {deck.review_cards && deck.review_cards.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Cards</h2>
            </div>
            
            {deck.review_cards.map((reviewCard, index) => (
              <div key={reviewCard.id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Study Card {index + 1}</h3>
                  </div>
                </div>
                
                <div className="mb-6">
                  <TiptapEditor
                    value={reviewCard.content}
                    onChange={() => {}}
                    readOnly={true}
                  />
                </div>
                
                {/* Flashcards for this study card */}
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
              Start building your deck by adding study cards and flashcards
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

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Study Progress</h3>
                  <p className="text-sm text-gray-600">{deck.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowProgressModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Real Progress Stats */}
              {progressData && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                      <span className="text-2xl font-bold text-emerald-700">{progressData.seenContent}</span>
                    </div>
                    <p className="text-sm font-medium text-emerald-600">Content Studied</p>
                    <p className="text-xs text-emerald-500">
                      {progressData.totalContent > 0 ? Math.round((progressData.seenContent / progressData.totalContent) * 100) : 0}% of total
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <RotateCcw className="w-8 h-8 text-purple-600" />
                      <span className="text-2xl font-bold text-purple-700">{progressData.reviewedContent}</span>
                    </div>
                    <p className="text-sm font-medium text-purple-600">Content Reviewed</p>
                    <p className="text-xs text-purple-500">
                      {progressData.seenContent > 0 ? Math.round((progressData.reviewedContent / progressData.seenContent) * 100) : 0}% of studied
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                      <span className="text-2xl font-bold text-blue-700">{progressData.seenReviewCards}</span>
                    </div>
                    <p className="text-sm font-medium text-blue-600">Study Cards</p>
                    <p className="text-xs text-blue-500">
                      {progressData.totalReviewCards > 0 ? Math.round((progressData.seenReviewCards / progressData.totalReviewCards) * 100) : 0}% completed
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-8 h-8 text-orange-600" />
                      <span className="text-2xl font-bold text-orange-700">{progressData.seenFlashcards}</span>
                    </div>
                    <p className="text-sm font-medium text-orange-600">Flashcards</p>
                    <p className="text-xs text-orange-500">
                      {progressData.totalFlashcards > 0 ? Math.round((progressData.seenFlashcards / progressData.totalFlashcards) * 100) : 0}% completed
                    </p>
                  </div>
                </div>
              )}

              {/* Mock Progress Data for Demo */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-8 h-8 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-700">{mockProgressData.accuracy}%</span>
                  </div>
                  <p className="text-sm font-medium text-blue-600">Accuracy Rate</p>
                  <p className="text-xs text-blue-500">Last 30 days</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-8 h-8 text-orange-600" />
                    <span className="text-2xl font-bold text-orange-700">{mockProgressData.studyStreak}</span>
                  </div>
                  <p className="text-sm font-medium text-orange-600">Study Streak</p>
                  <p className="text-xs text-orange-500">Days in a row</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-purple-600" />
                    <span className="text-2xl font-bold text-purple-700">{Math.floor(mockProgressData.totalStudyTime / 60)}h {mockProgressData.totalStudyTime % 60}m</span>
                  </div>
                  <p className="text-sm font-medium text-purple-600">Total Study Time</p>
                  <p className="text-xs text-purple-500">All time</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                    <span className="text-2xl font-bold text-emerald-700">{mockProgressData.masteredCards}</span>
                  </div>
                  <p className="text-sm font-medium text-emerald-600">Mastered Cards</p>
                  <p className="text-xs text-emerald-500">Mock data</p>
                </div>
              </div>

              {/* Weekly Progress Chart */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity (Mock Data)</h4>
                <div className="space-y-4">
                  {mockProgressData.weeklyProgress.map((day, index) => (
                    <div key={day.day} className="flex items-center space-x-4">
                      <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                      <div className="flex-1 flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${(day.cards / 20) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-600 w-16">{day.cards} cards</div>
                        <div className="text-sm text-gray-500 w-16">{day.time}min</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last Study Session */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Study Sessions</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Study Session:</span> Learn new content
                    </p>
                    <p className="text-sm text-gray-500">
                      {progressData && progressData.seenContent < progressData.totalContent 
                        ? `${progressData.totalContent - progressData.seenContent} items remaining`
                        : 'All content studied!'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Review Session:</span> Practice studied content
                    </p>
                    <p className="text-sm text-gray-500">
                      {progressData && progressData.seenContent > 0 
                        ? `${progressData.seenContent} items available for review`
                        : 'Complete a study session first'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowProgressModal(false)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
              Are you sure you want to delete "<strong>{deck.name}</strong>"? This will permanently remove the deck and all its study cards and flashcards.
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