"use client";
import { useContext } from "react";
import { UserContext, UserContextValue } from "@/context/UserContext";

export function useUser() {
  const context = useContext<UserContextValue | null>(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
