import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import AuthCallback from './components/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import CreateDeck from './components/CreateDeck';
import EditDeck from './components/EditDeck';
import DeckList from './components/DeckList';
import DeckView from './components/DeckView';

function AppRoutes() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in and on landing page
    if (user && window.location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
	    <Route path="/create-deck" element={ <ProtectedRoute> <CreateDeck /> </ProtectedRoute> } />
	    <Route path="/edit-deck/:id" element={ <ProtectedRoute> <EditDeck /> </ProtectedRoute> } />
	    <Route path="/decks" element={ <ProtectedRoute> <DeckList /> </ProtectedRoute> } />
	    <Route path="/deck/:id" element={ <ProtectedRoute> <DeckView /> </ProtectedRoute> } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;