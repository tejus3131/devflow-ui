"use client";
import { useContext } from "react";
import { UserContext, UserContextValue } from "@/context/UserContext";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUser hook must be used within a UserProvider component. " +
      "Make sure you have wrapped your application or component tree with UserProvider."
    );
  }
  return context;
}

export function useAuthRequired(requireAuth: boolean = true, redirectTo: string = '/', redirectAuthenticatedTo: string = '/'): boolean {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        router.push(redirectAuthenticatedTo);
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, redirectAuthenticatedTo, router]);
  if (requireAuth && isLoading) return false;
  if (requireAuth && !isAuthenticated) return false;
  return true;
}

