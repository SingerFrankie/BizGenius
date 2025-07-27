import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, signIn, signUp, signOut, getCurrentSession } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

/**
 * Enhanced User Interface
 * 
 * Extends the basic user info with Supabase user data
 * and additional profile information for the application.
 */
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  emailConfirmed?: boolean;
  createdAt?: string;
}

/**
 * Authentication Context Interface
 * 
 * Defines all authentication-related functions and state
 * available throughout the application.
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context.
 * Throws error if used outside of AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * 
 * Provides authentication context to the entire application.
 * Handles JWT tokens, session management, and user state.
 * 
 * Features:
 * - Automatic session restoration on app load
 * - JWT token management via Supabase
 * - Real-time auth state changes
 * - Error handling and loading states
 * - Persistent login across browser sessions
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Convert Supabase User to App User
   * 
   * Transforms Supabase user object into our application's user format.
   * Generates avatar URL and extracts relevant user information.
   */
  const transformUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2`,
      emailConfirmed: !!supabaseUser.email_confirmed_at,
      createdAt: supabaseUser.created_at
    };
  };

  /**
   * Initialize Authentication
   * 
   * Runs on app startup to restore user session if available.
   * Sets up auth state change listener for real-time updates.
   */
  useEffect(() => {
    let mounted = true;

    // Initialize session
    const initializeAuth = async () => {
      try {
        const { session, error } = await getCurrentSession();
        
        if (error) {
          console.error('Session initialization error:', error);
          setError('Failed to restore session');
        } else if (session && mounted) {
          setSession(session);
          setUser(transformUser(session.user));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Authentication initialization failed');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          setUser(transformUser(session.user));
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Clear Error Message
   * 
   * Utility function to clear error state.
   * Used when user starts a new action or dismisses error.
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Login Function
   * 
   * Authenticates user with email and password.
   * Handles JWT token storage automatically via Supabase.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @throws Error with user-friendly message on failure
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        // Handle specific Supabase auth errors
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link.');
        } else {
          throw new Error(error.message || 'Login failed. Please try again.');
        }
      }
      
      if (data.user && data.session) {
        // User state will be updated by the auth state change listener
        console.log('Login successful for:', data.user.email);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register Function
   * 
   * Creates new user account with email and password.
   * Handles email confirmation flow and JWT token management.
   * 
   * @param email - User's email address
   * @param password - User's password
   * @throws Error with user-friendly message on failure
   */
  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        // Handle specific Supabase registration errors
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please try logging in.');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long.');
        } else {
          throw new Error(error.message || 'Registration failed. Please try again.');
        }
      }
      
      if (data.user) {
        console.log('Registration successful for:', data.user.email);
        
        // Check if email confirmation is required
        if (!data.session) {
          throw new Error('Registration successful! Please check your email to confirm your account.');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout Function
   * 
   * Signs out the current user and clears all session data.
   * JWT tokens are automatically invalidated by Supabase.
   */
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // Don't throw error for logout - always clear local state
      }
      
      // Clear local state regardless of API response
      setUser(null);
      setSession(null);
      console.log('User logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local state even if API call fails
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      login, 
      register, 
      logout, 
      isLoading, 
      error, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}