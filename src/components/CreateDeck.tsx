import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Plus, Trash2, Save, Check, AlertCircle, BookOpen, Zap, Edit3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FlashcardService } from '../lib/flashcardService';
import TiptapEditor from './TiptapEditor';

interface FlashcardData {
  id: string;
  frontContent: any;
  backContent: any;
  frontImageUrl: string;
  backImageUrl: string;
}

interface ReviewCardData {
  id: string;
  name: string;
  content: any;
  imageUrl: string;
  flashcards: FlashcardData[];
}

function CreateDeck() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Deck data
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  
  // Study cards data
  const [reviewCards, setReviewCards] = useState<ReviewCardData[]>([
    {
      id: 'temp-1',
      name: 'Study Card 1',
      content: null,
      imageUrl: '',
      flashcards: [
        { 
          id: 'temp-1-1', 
          frontContent: null, 
          backContent: null, 
          frontImageUrl: '', 
          backImageUrl: '' 
        }
      ]
    }
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [currentFlashcardSide, setCurrentFlashcardSide] = useState<'front' | 'back'>('front');

  const addReviewCard = () => {
    const newCardNumber = reviewCards.length + 1;
    const newCard: ReviewCardData = {
      id: `temp-${Date.now()}`,
      name: `Study Card ${newCardNumber}`,
      content: null,
      imageUrl: '',
      flashcards: [
        { 
          id: `temp-${Date.now()}-1`, 
          frontContent: null, 
          backContent: null, 
          frontImageUrl: '', 
          backImageUrl: '' 
        }
      ]
    };
    setReviewCards([...reviewCards, newCard]);
    setCurrentCardIndex(reviewCards.length);
    setCurrentFlashcardIndex(0);
    setCurrentFlashcardSide('front');
  };

  const removeReviewCard = (index: number) => {
    if (reviewCards.length <= 1) return;
    const newCards = reviewCards.filter((_, i) => i !== index);
    setReviewCards(newCards);
    if (currentCardIndex >= newCards.length) {
      setCurrentCardIndex(newCards.length - 1);
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
      id: `temp-${Date.now()}-${reviewCards[cardIndex].flashcards.length + 1}`,
      frontContent: null,
      backContent: null,
      frontImageUrl: '',
      backImageUrl: ''
    };
    
    const updatedCards = [...reviewCards];
    // Add new flashcard at the beginning of the array (above existing ones)
    updatedCards[cardIndex].flashcards.unshift(newFlashcard);
    setReviewCards(updatedCards);
    setCurrentFlashcardIndex(0); // Select the newly created flashcard
    setCurrentFlashcardSide('front');
  };

  const removeFlashcard = (cardIndex: number, flashcardIndex: number) => {
    if (reviewCards[cardIndex].flashcards.length <= 1) return;
    
    const updatedCards = [...reviewCards];
    updatedCards[cardIndex].flashcards = updatedCards[cardIndex].flashcards.filter((_, i) => i !== flashcardIndex);
    setReviewCards(updatedCards);
    
    if (currentFlashcardIndex >= updatedCards[cardIndex].flashcards.length) {
      setCurrentFlashcardIndex(updatedCards[cardIndex].flashcards.length - 1);
    }
  };

  const updateReviewCardContent = (content: any) => {
    const updatedCards = [...reviewCards];
    updatedCards[currentCardIndex].content = content;
    setReviewCards(updatedCards);
  };

  const updateFlashcardContent = (content: any) => {
    const updatedCards = [...reviewCards];
    if (currentFlashcardSide === 'front') {
      updatedCards[currentCardIndex].flashcards[currentFlashcardIndex].frontContent = content;
    } else {
      updatedCards[currentCardIndex].flashcards[currentFlashcardIndex].backContent = content;
    }
    setReviewCards(updatedCards);
  };

  // Helper function to get current flashcard content
  const getCurrentFlashcardContent = () => {
    const currentCard = reviewCards[currentCardIndex];
    const currentFlashcard = currentCard?.flashcards[currentFlashcardIndex];
    
    if (!currentFlashcard) return null;
    
    return currentFlashcardSide === 'front' ? currentFlashcard.frontContent : currentFlashcard.backContent;
  };

  // Helper function to check if content has actual text
  const hasContent = (content: any) => {
    if (!content) return false;
    
    // For Tiptap JSON format
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

  // Helper function to get text preview from Tiptap content
  const getTextPreview = (content: any, maxLength: number = 100) => {
    if (!content || !content.content) return '';
    
    let text = '';
    const extractText = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.type === 'text') {
          text += node.text;
        } else if (node.content) {
          extractText(node.content);
        }
      }
    };
    
    extractText(content.content);
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return deckName.trim().length > 0;
      case 2:
        return reviewCards.every(card => {
          const hasReviewContent = hasContent(card.content);
          const hasValidFlashcards = card.flashcards.length >= 1 && 
                                   card.flashcards.every(fc => {
                                     const hasFront = hasContent(fc.frontContent);
                                     const hasBack = hasContent(fc.backContent);
                                     return hasFront && hasBack;
                                   });
          return hasReviewContent && hasValidFlashcards;
        });
      default:
        return true;
    }
  };

  const handleCreateDeck = async () => {
    setLoading(true);
    setError('');

    try {
      // Create the deck
      const { data: deck, error: deckError } = await FlashcardService.createDeck(deckName, deckDescription);
      
      if (deckError || !deck) {
        throw new Error(deckError?.message || 'Failed to create deck');
      }

      // Create study cards and flashcards
      for (const reviewCard of reviewCards) {
        const { data: createdReviewCard, error: reviewCardError } = await FlashcardService.createReviewCard(
          deck.id,
          reviewCard.content,
          reviewCard.imageUrl
        );

        if (reviewCardError || !createdReviewCard) {
          throw new Error(reviewCardError?.message || 'Failed to create study card');
        }

        // Create flashcards for this study card
        for (const flashcard of reviewCard.flashcards) {
          // Create single flashcard with both front and back content
          const { error: flashcardError } = await FlashcardService.createFlashcard(
            createdReviewCard.id,
            flashcard.frontContent,
            flashcard.frontImageUrl,
            flashcard.backContent,
            flashcard.backImageUrl
          );

          if (flashcardError) {
            throw new Error(flashcardError.message || 'Failed to create flashcard');
          }
        }
      }

      // Navigate to the created deck
      navigate(`/deck/${deck.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentCard = reviewCards[currentCardIndex];
  const currentFlashcard = currentCard?.flashcards[currentFlashcardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Dashboard</span>
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
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="font-medium">Deck Details</span>
            </div>
            
            <div className={`h-px w-16 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="font-medium">Create Cards</span>
            </div>
            
            <div className={`h-px w-16 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step > 3 ? <Check className="w-5 h-5" /> : '3'}
              </div>
              <span className="font-medium">Review & Create</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Step 1: Deck Details */}
        {step === 1 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Study Deck</h1>
                <p className="text-gray-600">Give your deck a name and description to get started</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="deckName" className="block text-sm font-medium text-gray-700 mb-2">
                    Deck Name *
                  </label>
                  <input
                    type="text"
                    id="deckName"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    placeholder="e.g., Organic Chemistry Basics"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label htmlFor="deckDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    id="deckDescription"
                    value={deckDescription}
                    onChange={(e) => setDeckDescription(e.target.value)}
                    placeholder="Brief description of what this deck covers..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                    maxLength={500}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!isStepValid(1)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Continue to Cards
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Create Cards */}
        {step === 2 && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 sticky top-6">
                <h3 className="font-semibold text-gray-900 mb-4">Study Cards</h3>
                
                <div className="space-y-2 mb-4">
                  {reviewCards.map((card, index) => (
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
                            updateReviewCardName(index, e.target.value);
                          }}
                          className="text-sm font-medium bg-transparent border-none outline-none flex-1 mr-2"
                          maxLength={50}
                        />
                        {reviewCards.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeReviewCard(index);
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {card.flashcards.length} flashcard{card.flashcards.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addReviewCard}
                  className="w-full bg-white/70 border-2 border-dashed border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-white/90 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Study Card</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Study Card Editor */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  <input
                    type="text"
                    value={currentCard?.name || ''}
                    onChange={(e) => updateReviewCardName(currentCardIndex, e.target.value)}
                    className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none"
                    maxLength={50}
                  />
                  <Edit3 className="w-4 h-4 text-gray-400" />
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Create content that teaches a concept. This will be shown to students before they practice with flashcards.
                </p>

                <TiptapEditor
                  value={currentCard?.content}
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
                      Flashcards for {currentCard?.name}
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => addFlashcard(currentCardIndex)}
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
                  {currentCard?.flashcards.map((flashcard, index) => (
                    <div key={flashcard.id} className="bg-white/50 rounded-xl p-4 border border-white/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-purple-600">
                          Flashcard {index + 1}
                        </div>
                        {currentCard.flashcards.length > 1 && (
                          <button
                            onClick={() => removeFlashcard(currentCardIndex, index)}
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
                            {hasContent(flashcard.frontContent)
                              ? getTextPreview(flashcard.frontContent, 100)
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
                            {hasContent(flashcard.backContent)
                              ? getTextPreview(flashcard.backContent, 100)
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

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-white/70 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 border border-white/30"
                >
                  Back to Details
                </button>
                
                <button
                  onClick={() => setStep(3)}
                  disabled={!isStepValid(2)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Review & Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Create */}
        {step === 3 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Your Deck</h1>
              <p className="text-gray-600">Make sure everything looks good before creating your deck</p>
            </div>

            {/* Deck Summary */}
            <div className="bg-white/50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{deckName}</h3>
              {deckDescription && (
                <p className="text-gray-600 mb-4">{deckDescription}</p>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{reviewCards.length} Study Cards</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>{reviewCards.reduce((total, card) => total + card.flashcards.length, 0)} Flashcards</span>
                </div>
              </div>
            </div>

            {/* Cards Preview */}
            <div className="space-y-4 mb-8">
              {reviewCards.map((card, cardIndex) => (
                <div key={card.id} className="bg-white/50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{card.name}</h4>
                  <div className="text-sm text-gray-600 mb-3">
                    <TiptapEditor
                      value={card.content}
                      onChange={() => {}}
                      readOnly={true}
                      className="mb-2"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {card.flashcards.map((flashcard, flashcardIndex) => (
                      <div key={flashcard.id} className="bg-white/70 rounded-lg p-3">
                        <div className="text-xs font-medium text-purple-600 mb-2">
                          Flashcard {flashcardIndex + 1}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Front</div>
                            <TiptapEditor
                              value={flashcard.frontContent}
                              onChange={() => {}}
                              readOnly={true}
                            />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Back</div>
                            <TiptapEditor
                              value={flashcard.backContent}
                              onChange={() => {}}
                              readOnly={true}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="bg-white/70 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 border border-white/30"
              >
                Back to Edit
              </button>
              
              <button
                onClick={handleCreateDeck}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Creating Deck...' : 'Create Deck'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateDeck;