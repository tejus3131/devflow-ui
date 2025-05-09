'use client';
import { useUser } from '../hooks/useUser';
import GitHubAuthButton from '../components/GitHubAuthButton';

export default function Home() {
  const { user, loading, signInWithGithub, signOut } = useUser();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-black">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {user ? `Welcome, ${user.data.user.email}` : 'Welcome, please sign in!'}
        </h1>
        
        <div className="flex justify-center">
          <GitHubAuthButton 
            user={user} 
            onSignIn={signInWithGithub} 
            onSignOut={signOut} 
          />
        </div>
        
        {user && (
          <div className="mt-8 p-4 bg-gray-50 rounded-md">
            <h2 className="text-lg font-medium mb-2">User Information</h2>
            <p><strong>Email:</strong> {user.data.user.email}</p>
            {user.data.user.user_metadata?.full_name && (
              <p><strong>Name:</strong> {user.data.user.user_metadata.full_name}</p>
            )}
            {user.data.user.user_metadata?.user_name && (
              <p><strong>GitHub Username:</strong> {user.data.user.user_metadata.user_name}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
