"use client";
import Image from "next/image";
import { useUser } from "../hooks/useUser";

export default function Home() {
  const { user, loading, signOut } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {user ? `Welcome to Your App!` : "Welcome to Your App!"}
          </h1>
          <p className="text-xl text-gray-600">
            {user
              ? `You're signed in as ${user.email}`
              : "Please sign in with GitHub using the button in the navbar"}
          </p>
        </div>

        {user && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
            <div className="space-y-3">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {user.full_name && (
                <p>
                  <strong>Name:</strong>{" "}
                  {user.full_name}
                </p>
              )}
              {user.user_name && (
                <p>
                  <strong>GitHub Username:</strong>{" "}
                  {user.user_name}
                </p>
              )}
              {user.avatar_url && (
                <div>
                  <p className="mb-2">
                    <strong>Avatar:</strong>
                  </p>
                  <Image
                    src={user.avatar_url}
                    alt="User avatar"
                    className="w-20 h-20 rounded-full"
                    width={80}
                    height={80}
                    priority
                  />
                </div>
              )}
            </div>
            <button
              onClick={signOut}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}


        {!user && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-700 mb-4">
              Sign in with GitHub to access all features and personalize your
              experience.
            </p>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-800">
                Look for the GitHub login button in the top-right corner of the
                navigation bar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
