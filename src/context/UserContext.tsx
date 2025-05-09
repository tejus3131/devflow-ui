'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/db';

// Create the context
export const UserContext = createContext(null);

// Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for user on mount and when hash changes (for OAuth redirects)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        } else {
          setUser(data ? { data } : null);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Also subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser({ data: { user: session.user } });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    checkUser();
    window.addEventListener('hashchange', checkUser);

    // Clean up
    return () => {
      window.removeEventListener('hashchange', checkUser);
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Auth functions
  const signInWithGithub = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'github'
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        loading,
        signInWithGithub, 
        signOut 
      }}
    >
      {children}
    </UserContext.Provider>
  );
}


