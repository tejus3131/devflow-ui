"use client";
import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import supabase from "@/lib/db";
import { UserDetail } from "@/lib/types";
import { getUserById } from "@/lib/data/users";
import { AuthError, isAuthSessionMissingError, User } from "@supabase/supabase-js";

export type AuthState =
  | "initializing"
  | "checking_session"
  | "fetching_profile"
  | "logged_in"
  | "logged_out"
  | "profile_error"
  | "oauth_pending";

export interface UserContextValue {
  user: UserDetail | null;
  state: AuthState;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | AuthError | null;
  signInWithGithub: (redirectUrl: string) => Promise<void>;
  signOut: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const defaultContextValue: UserContextValue = {
  user: null,
  state: "initializing",
  isLoading: true,
  isAuthenticated: false,
  error: null,
  signInWithGithub: async () => {
    throw new Error("UserContext not initialized")
  },
  signOut: async () => {
    throw new Error("UserContext not initialized")
  },
  reloadUser: async () => {
    throw new Error("UserContext not initialized")
  }
};

export const UserContext = createContext<UserContextValue>(defaultContextValue);

interface UserProviderProps {
  children: ReactNode;
  onAuthStateChange?: (state: AuthState) => void;
}

const isLoadingState = (state: AuthState): boolean => {
  return ["initializing", "checking_session", "fetching_profile", "oauth_pending"].includes(state);
};

const isAuthenticatedState = (state: AuthState): boolean => {
  return state === "logged_in";
};

export function UserProvider({
  children,
  onAuthStateChange
}: UserProviderProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [state, setState] = useState<AuthState>("initializing");
  const [error, setError] = useState<Error | AuthError | null>(null);

  const isLoading = isLoadingState(state);
  const isAuthenticated = isAuthenticatedState(state);

  const updateState = useCallback((newState: AuthState) => {
    setState(newState);
    onAuthStateChange?.(newState);
  }, [onAuthStateChange]);

  const fetchUserProfile = useCallback(async (authUser: User) => {
    updateState("fetching_profile");
    try {
      const response = await getUserById(authUser.id);
      if (!response.success) {
        console.error("Error fetching user profile:", response.message);
        setError(new Error(response.message || "Failed to fetch user profile"));
        updateState("profile_error");
        setUser(null);
      } else {
        setUser(response.data);
        updateState("logged_in");
      }
    } catch (error) {
      console.error("Unexpected error during profile fetch:", error);
      setError(error instanceof Error ? error : new Error("Unknown error during profile fetch"));
      updateState("profile_error");
      setUser(null);
    }
  }, [updateState]);

  const loadUser = useCallback(async () => {
    setError(null);
    updateState("checking_session");

    try {
      const { data, error: sessionError } = await supabase.clientAuth.getUser();

      if (sessionError) {
        if (isAuthSessionMissingError(sessionError)) {
          setUser(null);
          updateState("logged_out");
          return;
        } else {
          console.error("Authentication error:", sessionError);
          setError(sessionError);
          updateState("profile_error");
          return;
        }
      }
      await fetchUserProfile(data.user);
    } catch (unexpectedError) {
      console.error("Unexpected error during authentication:", unexpectedError);
      setError(unexpectedError instanceof Error ? unexpectedError : new Error("Unknown authentication error"));
      updateState("profile_error");
      setUser(null);
    }
  }, [updateState, fetchUserProfile]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const signInWithGithub = async (redirectUrl: string) => {
    updateState("oauth_pending");
    try {
      await supabase.clientAuth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectUrl,
        },
      });
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      setError(error instanceof Error ? error : new Error("Failed to initiate GitHub sign-in"));
      updateState("profile_error");
    }
  };

  const signOut = async () => {
    try {
      await supabase.clientAuth.signOut();
      setUser(null);
      updateState("logged_out");
    } catch (error) {
      console.error("Sign out error:", error);
      setError(error instanceof Error ? error : new Error("Failed to sign out"));
    }
  };

  const contextValue: UserContextValue = {
    user,
    state,
    isLoading,
    isAuthenticated,
    error,
    signInWithGithub,
    signOut,
    reloadUser: loadUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}