// filepath: /home/tojomojo/projects/devflow-ui/src/components/GitHubAuthButton.tsx
"use client";
import { GithubIcon } from "lucide-react";
import { useUser } from "../hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GitHubAuthButtonProps {
  id?: string; // Add id prop
}

const GitHubAuthButton: React.FC<GitHubAuthButtonProps> = ({ id }) => {
  const { user, loading, signInWithGithub } = useUser();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithGithub();
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleProfileClick = () => {
    if (user?.user_name) {
      router.push(`/${user.user_name}`);
    }
  };

  if (user) {
    return (
      <div className="relative">
        <button
          id={id} // Use the id prop
          onClick={handleProfileClick}
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt="User avatar"
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
      id={id} // Use the id prop
      onClick={handleSignIn}
      disabled={loading}
      className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors bg-gray-900 flex items-center justify-center"
    >
      {loading ? (
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <GithubIcon size={20} className="text-white" />
      )}
    </button>
  );
};

export default GitHubAuthButton;