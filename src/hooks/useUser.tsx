"use client";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

// Define the User interface
interface User {
  id: string;
  email: string;
  avatar_url: string;
  full_name: string;
  user_name: string;
}

// Define the context value type
interface UserContextValue {
  user: User | null;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useUser() {
  const context = useContext<UserContextValue | null>(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
