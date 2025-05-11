"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import supabase from "@/lib/db";
import { User } from "@/lib/types";

// Define the context value type
export interface UserContextValue {
  user: User | null;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with a default value of `null`
export const UserContext = createContext<UserContextValue | null>(null);

// Define the props for the UserProvider
interface UserProviderProps {
  children: ReactNode;
}

// Provider component
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for user on mount and when hash changes (for OAuth redirects)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.clientAuth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        } else if (data?.user) {
          const { id, email, user_metadata } = data.user;
          setUser({
            id,
            email: email || "",
            avatar_url: user_metadata.avatar_url || "",
            full_name: user_metadata.full_name || "",
            user_name: user_metadata.user_name || "",
            bio: user_metadata.bio || ""
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Also subscribe to auth state changes
    const { data: authListener } = supabase.clientAuth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { id, email, user_metadata } = session.user;
          setUser({
            id,
            email: email || "",
            avatar_url: user_metadata.avatar_url || "",
            full_name: user_metadata.full_name || "",
            user_name: user_metadata.user_name || "",
            bio: user_metadata.bio || ""
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      },
    );

    checkUser();
    window.addEventListener("hashchange", checkUser);

    // Clean up
    return () => {
      window.removeEventListener("hashchange", checkUser);
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Auth functions
  const signInWithGithub = async () => {
    await supabase.clientAuth.signInWithOAuth({
      provider: "github",
    });
  };

  const signOut = async () => {
    await supabase.clientAuth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        signInWithGithub,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
