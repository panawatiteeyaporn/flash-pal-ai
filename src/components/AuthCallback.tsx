import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AuthCallback() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in, redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // User is not logged in after callback, redirect to login
        navigate('/login', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-4 h-4 bg-white rounded"></div>
        </div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}

export default AuthCallback;