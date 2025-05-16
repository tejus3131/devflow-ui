"use client";
import Image from "next/image";
import { useUser } from "../hooks/useUser";

export default function Home() {
  const { user, isLoading, signOut, state } = useUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <h1>
        {state}
      </h1>
      <ul>
        <li>{user?.id}</li>
        <li>{user?.full_name}</li>
        <li>{user?.user_name}</li>
        <li>{user?.bio}</li>
        <li>{user?.email}</li>
        <li><Image
          src={user?.avatar_url || ""}
          alt="User Avatar"
          width={100}
          height={100}
          className="rounded-full"
          priority
        /></li>
      </ul>
      <button
        onClick={signOut}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    </>
  );
}
