import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any; message?: string }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to generate random display names
const generateRandomDisplayName = (): string => {
  const adjectives = [
    'Brilliant', 'Curious', 'Eager', 'Focused', 'Genius', 'Inspired', 'Keen', 'Motivated',
    'Quick', 'Sharp', 'Smart', 'Studious', 'Thoughtful', 'Wise', 'Bright', 'Creative',
    'Dedicated', 'Enthusiastic', 'Innovative', 'Persistent', 'Resourceful', 'Strategic'
  ];
  
  const nouns = [
    'Learner', 'Scholar', 'Student', 'Thinker', 'Explorer', 'Researcher', 'Achiever',
    'Discoverer', 'Innovator', 'Pioneer', 'Seeker', 'Analyst', 'Creator', 'Builder',
    'Problem-Solver', 'Knowledge-Hunter', 'Mind', 'Brain', 'Intellect', 'Genius'
  ];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  return `${randomAdjective} ${randomNoun} ${randomNumber}`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle magic link sign-in for new users
      if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user;
        
        // Check if this is a new user (no full_name in metadata)
        if (!user.user_metadata?.full_name) {
          const randomName = generateRandomDisplayName();
          
          // Update the user's metadata with a random display name
          await supabase.auth.updateUser({
            data: {
              full_name: randomName,
            }
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          // If this is a new user, they'll get a random name assigned after sign-in
          full_name: generateRandomDisplayName(),
        }
      },
    });

    if (error) {
      return { error };
    }

    return { 
      error: null, 
      message: 'Check your email for the magic link! If you\'re a new user, we\'ll create an account for you automatically.' 
    };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithMagicLink,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}