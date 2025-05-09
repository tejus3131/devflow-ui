import { useState, useEffect } from 'react';
import { Github } from 'lucide-react';

const GitHubAuthButton = ({ user, onSignIn, onSignOut }) => {
  const [loading, setLoading] = useState(false);
  
  const handleAuthAction = async () => {
    setLoading(true);
    try {
      if (user) {
        await onSignOut();
      } else {
        await onSignIn();
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };

  // If the user is logged in
  if (user) {
    return (
      <button 
        onClick={handleAuthAction}
        disabled={loading}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        {user.data?.user?.user_metadata?.avatar_url ? (
          <img 
            src={user.data.user.user_metadata.avatar_url} 
            alt="User avatar" 
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
            {user.data?.user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <span>{loading ? "Processing..." : "Sign out"}</span>
      </button>
    );
  }

  // If the user is logged out
  return (
    <button 
      onClick={handleAuthAction}
      disabled={loading}
      className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
    >
      <Github size={20} />
      <span>{loading ? "Processing..." : "Continue with GitHub"}</span>
    </button>
  );
};

export default GitHubAuthButton;
