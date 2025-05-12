"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import supabase from "@/lib/db";
import { UserDetail } from "@/lib/types";
import { getUserById } from "@/lib/data/users"

// Define the context value type
export interface UserContextValue {
  user: UserDetail | null;
  loading: boolean;
  signInWithGithub: (redirectUrl: string) => Promise<void>;
  signOut: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

// Create the context with a default value of `null`
export const UserContext = createContext<UserContextValue | null>(null);

// Define the props for the UserProvider
interface UserProviderProps {
  children: ReactNode;
}

// Provider component
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for user on mount and when hash changes (for OAuth redirects)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.clientAuth.getUser();
        if (error) {
          setUser(null);
        } else if (data?.user) {
          const { id } = data.user;
          const user = await getUserById(id);
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Also subscribe to auth state changes
    const { data: authListener } = supabase.clientAuth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { id } = session.user;
          setUser(await getUserById(id));
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
  const signInWithGithub = async (redirectUrl: string) => {
    await supabase.clientAuth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: redirectUrl,
      },
    });
  };

  const signOut = async () => {
    await supabase.clientAuth.signOut();
    setUser(null);
  };

  const reloadUser = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.clientAuth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } else if (data?.user) {
        const { id } = data.user;
        setUser(await getUserById(id));
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

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        signInWithGithub,
        signOut,
        reloadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
