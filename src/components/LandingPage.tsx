import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Target, BarChart3, Clock, Users, Check, ArrowRight, Play, RefreshCw, BookOpen, Zap, Star, CreditCard, X } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FlashPalAI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/30">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Learning Revolution</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Study Smarter,
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
                Remember Forever
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your learning with AI-powered flashcards that adapt to your mind. 
              Experience active recall like never before with personalized study sessions 
              that maximize retention and minimize study time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/signup"
                className="group bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group bg-white/70 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/90 transition-all duration-300 border border-white/30 flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-2xl max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <span className="text-white/80 text-sm ml-auto">FlashPalAI Chat</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-sm">👋 Hi! I'm ready to help you master any subject. What would you like to learn today?</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 ml-8">
                    <p className="text-sm">I want to learn organic chemistry for my upcoming exam</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why FlashPalAI Changes Everything
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built on proven learning science, powered by cutting-edge AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Personalization</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced algorithms learn your strengths and weaknesses, creating personalized study paths that adapt in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Active Recall Mastery</h3>
              <p className="text-gray-600 leading-relaxed">
                Question-Review-Question cycles proven to boost retention by 300% compared to passive reading.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Forgetting Curve</h3>
              <p className="text-gray-600 leading-relaxed">
                SM-2 and FSRS algorithms ensure you review at the perfect moment before you forget.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Beautiful insights into your learning journey with detailed progress tracking and performance metrics.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                AI creates optimal study schedules based on your timeline and sends gentle reminders to keep you on track.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multiple Question Types</h3>
              <p className="text-gray-600 leading-relaxed">
                From multiple choice to deep "why" and "how" questions that challenge your understanding at every level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Learning Journey, Perfected
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the proven Question → Review → Question cycle that maximizes retention
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 group-hover:bg-white transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Assessment Questions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Start with targeted questions to assess your current understanding and identify knowledge gaps.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 group-hover:bg-white transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Focused Review</h3>
                <p className="text-gray-600 leading-relaxed">
                  Study personalized flashcards targeting exactly what you need to learn, nothing more, nothing less.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/40 group-hover:bg-white transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Reinforcement Test</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cement your learning with follow-up questions that test your newly acquired knowledge.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <RefreshCw className="w-5 h-5 text-indigo-500" />
              <span className="text-gray-700">Cycle continues based on your mastery level</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you're ready to unlock your full potential
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 relative">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">Free Plan</h3>
              </div>
              
              <p className="text-gray-600 mb-6">For occasional learners or test prep in small doses</p>
              
              <div className="mb-8">
                <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
                <p className="text-gray-600">/month</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>1 AI-generated subject per month</strong> (includes flashcards + smart questions)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Up to 2 AI-assessed exam-type questions per subject</strong></span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Basic flashcard customization</strong></span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Advanced spaced repetition</strong> (FSRS algorithm)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Smart study scheduling</strong> with reminders</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Basic progress insights</strong> (mastery tracking)</span>
                </li>
              </ul>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                    <X className="w-3 h-3 text-gray-400" />
                  </div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                    <X className="w-3 h-3 text-gray-400" />
                  </div>
                  <span>Upgrade anytime</span>
                </div>
              </div>
              
              <Link 
                to="/signup"
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors block text-center"
              >
                Start Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>POPULAR</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <h3 className="text-2xl font-bold">Premium Plan</h3>
              </div>
              
              <p className="text-indigo-100 mb-6">For committed learners preparing for serious goals</p>
              
              <div className="mb-8">
                <div className="text-4xl font-bold mb-1">$9.99</div>
                <p className="text-indigo-100">/month</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-indigo-100 font-medium">✨ Everything in Free, plus:</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span><strong>Up to 10 AI-generated subjects per month</strong></span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span><strong>Up to 20 AI-assessed exam-type questions per subject</strong></span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span><strong>Enhanced flashcard customization</strong> with AI assistant</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span><strong>Access to premium study decks</strong> crafted for exams (GCSE, ALEVEL, AS, SAT, GRE, PMP, etc.)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span><strong>Advanced FSRS-based scheduling</strong> with adaptive pacing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span><strong>Full analytics dashboard</strong> (efficiency metrics, forgetting curve, trends)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span><strong>Priority email support</strong></span>
                </li>
              </ul>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 border border-white/20">
                <p className="text-sm text-indigo-100 italic">
                  💡 "Maximize your retention. Focus where it matters. Study smarter."
                </p>
              </div>
              
              <Link 
                to="/signup"
                className="w-full bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors block text-center"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of students who've already discovered the power of AI-enhanced active recall
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/signup"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            >
              Start Learning Free
            </Link>
            <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm border-t border-white/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FlashPalAI
              </span>
            </div>
            <p className="text-gray-600">© 2024 FlashPalAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;