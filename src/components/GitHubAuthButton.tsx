"use client";
import { GithubIcon } from "lucide-react";
import { useUser } from "../hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface GitHubAuthButtonProps {
  id?: string;
  onAuthStart?: () => void;
  onAuthComplete?: (success: boolean) => void;
}

const GitHubAuthButton: React.FC<GitHubAuthButtonProps> = ({ 
  id,
  onAuthStart,
  onAuthComplete 
}) => {
  const { user, state, isLoading, isAuthenticated, signInWithGithub, error } = useUser();
  const router = useRouter();
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    if (!isLoading && buttonState === "loading") {
      setButtonState("idle");
      onAuthComplete?.(isAuthenticated);
    }

    if (error && buttonState === "loading") {
      setButtonState("error");
      onAuthComplete?.(false);
    }
  }, [isLoading, isAuthenticated, error, buttonState, onAuthComplete]);

  const handleSignIn = async () => {
    try {
      setButtonState("loading");
      onAuthStart?.();
      
      await signInWithGithub(`${window.location}`);
    } catch (error) {
      console.error("GitHub authentication error:", error);
      setButtonState("error");
      onAuthComplete?.(false);
    }
  };

  const handleProfileClick = () => {
    if (user?.user_name) {
      router.push(`/${user.user_name}`);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="relative">
        <button
          id={id}
          onClick={handleProfileClick}
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          aria-label="View your profile"
          title={`View profile: ${user.user_name || user.email}`}
        >
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={`${user.user_name || user.email}'s profile picture`}
              className="w-10 h-10 rounded-full border-2 border-gray-400 hover:border-transparent hover:scale-105 shadow-sm transition-all"
              width={40}
              height={40}
              priority
            />
          ) : (
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white text-lg hover:bg-gray-500 border-2 border-gray-300 hover:border-gray-400 shadow-sm transition-all">
              {user.email.charAt(0).toUpperCase()}
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      id={id}
      onClick={handleSignIn}
      disabled={isLoading || state === "oauth_pending" || buttonState === "loading"}
      className={`
        w-10 h-10 rounded-full border-2 
        ${buttonState === "error" ? "border-red-400 hover:border-red-500" : "border-gray-200 hover:border-gray-300"} 
        transition-colors bg-gray-900 flex items-center justify-center
        ${(isLoading || buttonState === "loading") ? "opacity-75" : ""}
      `}
      aria-label="Sign in with GitHub"
      title="Sign in with GitHub"
    >
      {isLoading || state === "oauth_pending" || buttonState === "loading" ? (
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : buttonState === "error" ? (
        <GithubIcon size={20} className="text-red-400" />
      ) : (
        <GithubIcon size={20} className="text-white" />
      )}
    </button>
  );
};

export default GitHubAuthButton;