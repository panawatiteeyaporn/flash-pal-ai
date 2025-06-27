import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Brain, ArrowLeft, Save, AlertCircle, BookOpen, Zap, Edit3, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FlashcardService } from '../lib/flashcardService';
import { DeckWithCards } from '../types/flashcard';
import TiptapEditor from './TiptapEditor';

interface FlashcardData {
  id: string;
  front: any;
  back: any;
  frontImageUrl: string;
  backImageUrl: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface ReviewCardData {
  id: string;
  name: string;
  content: any;
  imageUrl: string;
  flashcards: FlashcardData[];
  isNew?: boolean;
  isDeleted?: boolean;
}

function EditDeck() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [originalDeck, setOriginalDeck] = useState<DeckWithCards | null>(null);
  
  // Deck data
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  
  // Review cards data
  const [reviewCards, setReviewCards] = useState<ReviewCardData[]>([]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [currentFlashcardSide, setCurrentFlashcardSide] = useState<'front' | 'back'>('front');

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
      setLoading(false);
      return;
    }

    if (!data) {
      setError('Deck not found');
      setLoading(false);
      return;
    }

    setOriginalDeck(data);
    setDeckName(data.name);
    setDeckDescription(data.description || '');

    // Transform the data to match our editing structure
    const transformedReviewCards: ReviewCardData[] = data.review_cards?.map((reviewCard, index) => ({
      id: reviewCard.id,
      name: `Review Card ${index + 1}`,
      content: reviewCard.content,
      imageUrl: reviewCard.image_url || '',
      flashcards: reviewCard.flashcards?.map(flashcard => ({
        id: flashcard.id,
        front: flashcard.content, // In the current structure, we store both front and back in the same content field
        back: flashcard.content,  // This will need to be adjusted based on your actual data structure
        frontImageUrl: flashcard.image_url || '',
        backImageUrl: '',
      })) || []
    })) || [];

    setReviewCards(transformedReviewCards);
    setLoading(false);
  };

  const addReviewCard = () => {
    const newCardNumber = reviewCards.length + 1;
    const newCard: ReviewCardData = {
      id: `new-${Date.now()}`,
      name: `Review Card ${newCardNumber}`,
      content: null,
      imageUrl: '',
      flashcards: [
        { 
          id: `new-${Date.now()}-1`, 
          front: null, 
          back: null, 
          frontImageUrl: '', 
          backImageUrl: '',
          isNew: true
        }
      ],
      isNew: true
    };
    setReviewCards([...reviewCards, newCard]);
    setCurrentCardIndex(reviewCards.length);
    setCurrentFlashcardIndex(0);
    setCurrentFlashcardSide('front');
  };

  const removeReviewCard = (index: number) => {
    if (reviewCards.length <= 1) return;
    
    const updatedCards = [...reviewCards];
    const cardToRemove = updatedCards[index];
    
    if (cardToRemove.isNew) {
      // If it's a new card, just remove it from the array
      updatedCards.splice(index, 1);
    } else {
      // If it's an existing card, mark it for deletion
      updatedCards[index] = { ...cardToRemove, isDeleted: true };
    }
    
    setReviewCards(updatedCards);
    
    // Adjust current selection
    const visibleCards = updatedCards.filter(card => !card.isDeleted);
    if (currentCardIndex >= visibleCards.length) {
      setCurrentCardIndex(Math.max(0, visibleCards.length - 1));
    }
    setCurrentFlashcardIndex(0);
    setCurrentFlashcardSide('front');
  };

  const updateReviewCardName = (index: number, name: string) => {
    const updatedCards = [...reviewCards];
    updatedCards[index].name = name;
    setReviewCards(updatedCards);
  };

  const addFlashcard = (cardIndex: number) => {
    const newFlashcard: FlashcardData = {
      id: `new-${Date.now()}-${reviewCards[cardIndex].flashcards.length + 1}`,
      front: null,
      back: null,
      frontImageUrl: '',
      backImageUrl: '',
      isNew: true
    };
    
    const updatedCards = [...reviewCards];
    updatedCards[cardIndex].flashcards.unshift(newFlashcard);
    setReviewCards(updatedCards);
    setCurrentFlashcardIndex(0);
    setCurrentFlashcardSide('front');
  };

  const removeFlashcard = (cardIndex: number, flashcardIndex: number) => {
    const updatedCards = [...reviewCards];
    const flashcardToRemove = updatedCards[cardIndex].flashcards[flashcardIndex];
    
    if (flashcardToRemove.isNew) {
      // If it's a new flashcard, just remove it from the array
      updatedCards[cardIndex].flashcards.splice(flashcardIndex, 1);
    } else {
      // If it's an existing flashcard, mark it for deletion
      updatedCards[cardIndex].flashcards[flashcardIndex] = { 
        ...flashcardToRemove, 
        isDeleted: true 
      };
    }
    
    setReviewCards(updatedCards);
    
    // Adjust current selection
    const visibleFlashcards = updatedCards[cardIndex].flashcards.filter(fc => !fc.isDeleted);
    if (currentFlashcardIndex >= visibleFlashcards.length) {
      setCurrentFlashcardIndex(Math.max(0, visibleFlashcards.length - 1));
    }
  };

  const updateReviewCardContent = (content: any) => {
    const updatedCards = [...reviewCards];
    updatedCards[currentCardIndex].content = content;
    setReviewCards(updatedCards);
  };

  const updateFlashcardContent = (content: any) => {
    const updatedCards = [...reviewCards];
    const visibleCards = updatedCards.filter(card => !card.isDeleted);
    const actualCardIndex = updatedCards.findIndex(card => card.id === visibleCards[currentCardIndex].id);
    
    const visibleFlashcards = updatedCards[actualCardIndex].flashcards.filter(fc => !fc.isDeleted);
    const actualFlashcardIndex = updatedCards[actualCardIndex].flashcards.findIndex(
      fc => fc.id === visibleFlashcards[currentFlashcardIndex].id
    );
    
    if (currentFlashcardSide === 'front') {
      updatedCards[actualCardIndex].flashcards[actualFlashcardIndex].front = content;
    } else {
      updatedCards[actualCardIndex].flashcards[actualFlashcardIndex].back = content;
    }
    setReviewCards(updatedCards);
  };

  // Helper function to get current flashcard content
  const getCurrentFlashcardContent = () => {
    const visibleCards = reviewCards.filter(card => !card.isDeleted);
    const currentCard = visibleCards[currentCardIndex];
    
    if (!currentCard) return null;
    
    const visibleFlashcards = currentCard.flashcards.filter(fc => !fc.isDeleted);
    const currentFlashcard = visibleFlashcards[currentFlashcardIndex];
    
    if (!currentFlashcard) return null;
    
    return currentFlashcardSide === 'front' ? currentFlashcard.front : currentFlashcard.back;
  };

  // Helper function to check if content has actual text
  const hasContent = (content: any) => {
    if (!content) return false;
    
    if (content.type === 'doc' && content.content) {
      return content.content.some((node: any) => {
        if (node.type === 'paragraph' && node.content) {
          return node.content.some((textNode: any) => textNode.text && textNode.text.trim().length > 0);
        }
        return node.content && node.content.length > 0;
      });
    }
    
    return false;
  };

  const isFormValid = () => {
    if (!deckName.trim()) return false;
    
    const visibleCards = reviewCards.filter(card => !card.isDeleted);
    return visibleCards.every(card => {
      const hasReviewContent = hasContent(card.content);
      const visibleFlashcards = card.flashcards.filter(fc => !fc.isDeleted);
      const hasValidFlashcards = visibleFlashcards.length >= 1 && 
                               visibleFlashcards.every(fc => {
                                 const hasFront = hasContent(fc.front);
                                 const hasBack = hasContent(fc.back);
                                 return hasFront && hasBack;
                               });
      return hasReviewContent && hasValidFlashcards;
    });
  };

  const handleSaveDeck = async () => {
    if (!id || !originalDeck) return;
    
    setSaving(true);
    setError('');

    try {
      // Update deck details
      const { error: deckError } = await FlashcardService.updateDeck(id, {
        name: deckName,
        description: deckDescription
      });

      if (deckError) {
        throw new Error(deckError.message);
      }

      // Process review cards
      for (const reviewCard of reviewCards) {
        if (reviewCard.isDeleted && !reviewCard.isNew) {
          // Delete existing review card
          await FlashcardService.deleteReviewCard(reviewCard.id);
        } else if (reviewCard.isNew && !reviewCard.isDeleted) {
          // Create new review card
          const { data: createdReviewCard, error: reviewCardError } = await FlashcardService.createReviewCard(
            id,
            reviewCard.content,
            reviewCard.imageUrl
          );

          if (reviewCardError || !createdReviewCard) {
            throw new Error(reviewCardError?.message || 'Failed to create review card');
          }

          // Create flashcards for the new review card
          const visibleFlashcards = reviewCard.flashcards.filter(fc => !fc.isDeleted);
          for (const flashcard of visibleFlashcards) {
            // Create front flashcard
            await FlashcardService.createFlashcard(
              createdReviewCard.id,
              flashcard.front,
              flashcard.frontImageUrl
            );

            // Create back flashcard
            await FlashcardService.createFlashcard(
              createdReviewCard.id,
              flashcard.back,
              flashcard.backImageUrl
            );
          }
        } else if (!reviewCard.isNew && !reviewCard.isDeleted) {
          // Update existing review card
          await FlashcardService.updateReviewCard(reviewCard.id, {
            content: reviewCard.content,
            image_url: reviewCard.imageUrl
          });

          // Process flashcards for this review card
          for (const flashcard of reviewCard.flashcards) {
            if (flashcard.isDeleted && !flashcard.isNew) {
              // Delete existing flashcard
              await FlashcardService.deleteFlashcard(flashcard.id);
            } else if (flashcard.isNew && !flashcard.isDeleted) {
              // Create new flashcard
              await FlashcardService.createFlashcard(
                reviewCard.id,
                flashcard.front,
                flashcard.frontImageUrl
              );
              await FlashcardService.createFlashcard(
                reviewCard.id,
                flashcard.back,
                flashcard.backImageUrl
              );
            } else if (!flashcard.isNew && !flashcard.isDeleted) {
              // Update existing flashcard
              await FlashcardService.updateFlashcard(flashcard.id, {
                content: flashcard.front, // You may need to adjust this based on your data structure
                image_url: flashcard.frontImageUrl
              });
            }
          }
        }
      }

      // Navigate back to deck view
      navigate(`/deck/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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

  if (error && !originalDeck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Deck not found</h3>
          <p className="text-gray-600 mb-6">{error}</p>
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

  const visibleCards = reviewCards.filter(card => !card.isDeleted);
  const currentCard = visibleCards[currentCardIndex];
  const visibleFlashcards = currentCard?.flashcards.filter(fc => !fc.isDeleted) || [];
  const currentFlashcard = visibleFlashcards[currentFlashcardIndex];

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
            
            <div className="text-sm text-gray-600">
              Welcome, {user?.user_metadata?.full_name || user?.email}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Deck</h1>
          <p className="text-gray-600">Make changes to your study deck</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 sticky top-6">
              {/* Deck Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Deck Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deck Name *
                    </label>
                    <input
                      type="text"
                      value={deckName}
                      onChange={(e) => setDeckName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={deckDescription}
                      onChange={(e) => setDeckDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                      maxLength={500}
                    />
                  </div>
                </div>
              </div>

              {/* Review Cards List */}
              <h3 className="font-semibold text-gray-900 mb-4">Review Cards</h3>
              
              <div className="space-y-2 mb-4">
                {visibleCards.map((card, index) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setCurrentCardIndex(index);
                      setCurrentFlashcardIndex(0);
                      setCurrentFlashcardSide('front');
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentCardIndex === index
                        ? 'bg-indigo-100 border-2 border-indigo-300'
                        : 'bg-white/50 hover:bg-white/70 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={card.name}
                        onChange={(e) => {
                          e.stopPropagation();
                          const actualIndex = reviewCards.findIndex(c => c.id === card.id);
                          updateReviewCardName(actualIndex, e.target.value);
                        }}
                        className="text-sm font-medium bg-transparent border-none outline-none flex-1 mr-2"
                        maxLength={50}
                      />
                      {visibleCards.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const actualIndex = reviewCards.findIndex(c => c.id === card.id);
                            removeReviewCard(actualIndex);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {visibleFlashcards.length} flashcard{visibleFlashcards.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addReviewCard}
                className="w-full bg-white/70 border-2 border-dashed border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-white/90 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Review Card</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {currentCard && (
              <>
                {/* Review Card Editor */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <div className="flex items-center space-x-2 mb-4">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <input
                      type="text"
                      value={currentCard.name}
                      onChange={(e) => {
                        const actualIndex = reviewCards.findIndex(c => c.id === currentCard.id);
                        updateReviewCardName(actualIndex, e.target.value);
                      }}
                      className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none"
                      maxLength={50}
                    />
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Create content that teaches a concept. This will be shown to students before they practice with flashcards.
                  </p>

                  <TiptapEditor
                    value={currentCard.content}
                    onChange={updateReviewCardContent}
                    placeholder="Explain the concept, provide examples, or share key information..."
                    maxWords={350}
                    className="mb-4"
                  />
                </div>

                {/* Flashcards */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-purple-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Flashcards for {currentCard.name}
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => {
                        const actualIndex = reviewCards.findIndex(c => c.id === currentCard.id);
                        addFlashcard(actualIndex);
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Flashcard</span>
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Create practice questions or prompts. Students will use these to test their understanding.
                  </p>

                  {/* Flashcard List */}
                  <div className="space-y-4 mb-6">
                    {visibleFlashcards.map((flashcard, index) => (
                      <div key={flashcard.id} className="bg-white/50 rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-medium text-purple-600">
                            Flashcard {index + 1}
                          </div>
                          {visibleFlashcards.length > 1 && (
                            <button
                              onClick={() => {
                                const actualCardIndex = reviewCards.findIndex(c => c.id === currentCard.id);
                                const actualFlashcardIndex = reviewCards[actualCardIndex].flashcards.findIndex(fc => fc.id === flashcard.id);
                                removeFlashcard(actualCardIndex, actualFlashcardIndex);
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div 
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              currentFlashcardIndex === index && currentFlashcardSide === 'front'
                                ? 'bg-indigo-100 border-2 border-indigo-300'
                                : 'bg-white/70 hover:bg-white/90 border-2 border-transparent'
                            }`}
                            onClick={() => {
                              setCurrentFlashcardIndex(index);
                              setCurrentFlashcardSide('front');
                            }}
                          >
                            <div className="text-xs font-medium text-gray-600 mb-2">Front</div>
                            <div className="text-sm text-gray-700 line-clamp-3">
                              {hasContent(flashcard.front)
                                ? 'Click to edit front side'
                                : 'Click to edit front side'
                              }
                            </div>
                          </div>
                          
                          <div 
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              currentFlashcardIndex === index && currentFlashcardSide === 'back'
                                ? 'bg-indigo-100 border-2 border-indigo-300'
                                : 'bg-white/70 hover:bg-white/90 border-2 border-transparent'
                            }`}
                            onClick={() => {
                              setCurrentFlashcardIndex(index);
                              setCurrentFlashcardSide('back');
                            }}
                          >
                            <div className="text-xs font-medium text-gray-600 mb-2">Back</div>
                            <div className="text-sm text-gray-700 line-clamp-3">
                              {hasContent(flashcard.back)
                                ? 'Click to edit back side'
                                : 'Click to edit back side'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Current Flashcard Editor */}
                  {currentFlashcard && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center space-x-2 mb-4">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <h4 className="text-lg font-semibold text-gray-900">
                          Editing Flashcard {currentFlashcardIndex + 1} - {currentFlashcardSide === 'front' ? 'Front' : 'Back'}
                        </h4>
                      </div>
                      
                      <div className="flex space-x-2 mb-4">
                        <button
                          onClick={() => setCurrentFlashcardSide('front')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentFlashcardSide === 'front'
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/70 text-gray-600 hover:bg-white/90'
                          }`}
                        >
                          Front
                        </button>
                        <button
                          onClick={() => setCurrentFlashcardSide('back')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentFlashcardSide === 'back'
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/70 text-gray-600 hover:bg-white/90'
                          }`}
                        >
                          Back
                        </button>
                      </div>

                      <TiptapEditor
                        key={`${currentCardIndex}-${currentFlashcardIndex}-${currentFlashcardSide}`}
                        value={getCurrentFlashcardContent()}
                        onChange={updateFlashcardContent}
                        placeholder={`Create the ${currentFlashcardSide} side of your flashcard...`}
                        maxWords={350}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveDeck}
                disabled={saving || !isFormValid()}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditDeck;