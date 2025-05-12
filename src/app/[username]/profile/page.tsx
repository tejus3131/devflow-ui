"use client";

import React, { useState, useEffect, FC } from "react";
import Image from "next/image";
import {
  Edit2,
  Settings,
  Bell,
  Lock,
  Link,
  LogOut,
  MessageSquare,
  BarChart,
} from "lucide-react";
import { UserDetail } from "@/lib/types";
import { useUser } from "@/hooks/useUser";
import { useModal } from "@/hooks/useModal";
import { AvatarForm, BioForm, EmailForm, FullNameForm, UserNameForm } from "./editing_forms";
import { useRouter } from "next/navigation";
import BadgeTray from "@/components/Badge";


const connections = ["user2", "user3", "user4"];
const favorites = ["post1", "post2", "post3"];
const likes = ["post4", "post5"];
const badges = ["Contributor", "Problem Solver", "Top Writer"];



interface ProfilePageProps {
  params: { username: string };
}

const ProfilePage: FC<ProfilePageProps> = ({ params }) => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user: selfUser, loading: selfLoading, signOut } = useUser();
  const [isSelf, setIsSelf] = useState(false);

  const { openModal } = useModal();
  const router = useRouter();


  useEffect(() => {
    const fetchUserData = async () => {
      const { username } = await params;

      try {
        setLoading(true);
        setError(null);

        if (!selfLoading) {
          if (selfUser?.user_name === username) {
            setUser(selfUser);
            setIsSelf(true);
          } else {
            // Replace with actual API call
            const res = await fetch('/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user_name: username }),
            });

            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.message || 'Failed to fetch user');
            }

            setUser(data.data);
            setIsSelf(false); // Explicitly set to false for other users
          }
        }
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params, selfUser, selfLoading]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsSelf(false);
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out");
    }
  };

  const handleUsernameChange = (newUserName: string) => {
    // Update user state
    setUser((prev) => (prev ? { ...prev, user_name: newUserName } : prev));

    // Navigate to new profile URL
    router.push(`/${newUserName}/profile`);

    // Set isSelf to true since this is the current user
    setIsSelf(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-error">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (<>
    {user && (
      <>
        <FullNameForm initialValue={user.full_name!} userId={user.id!} setNewFullName={(newFullName) => setUser((prev) => (prev ? { ...prev, full_name: newFullName } : prev))} />
        <EmailForm initialValue={user.email!} userId={user.id!} setNewEmail={(newEmail) => setUser((prev) => (prev ? { ...prev, email: newEmail } : prev))} fullName={user.full_name!} />
        <UserNameForm initialValue={user.user_name!} userId={user.id!} setNewUserName={handleUsernameChange} />
        <AvatarForm initialUrl={user.avatar_url} userId={user.id!} onAvatarUpdate={(newAvatar) => setUser((prev) => (prev ? { ...prev, avatar_url: newAvatar } : prev))} />
        <BioForm initialValue={user.bio!} userId={user.id!} setNewBio={(newBio) => setUser((prev) => (prev ? { ...prev, bio: newBio } : prev))} />
      </>
    )}
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
      <div className="max-w-6xl mx-auto p-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Information */}
          <div className="w-full md:w-2/3 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-gray-300 dark:border-border-dark overflow-hidden">
            <div className="p-6">
              {/* User Header Section - Avatar on left, info on right */}
              <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">
                {/* Avatar */}
                <div className="group relative h-32 w-32 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-light dark:bg-neutral-dark border-4 border-surface-light dark:border-surface-dark shadow-xl">
                  {user?.avatar_url ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={user.avatar_url}
                        alt={`${user.full_name}'s avatar`}
                        fill
                        sizes="128px"
                        priority
                        className="object-cover"
                      />
                      {isSelf && (
                        <button
                          onClick={() => openModal("avatar_edit")}
                          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
                          aria-label="Edit profile picture"
                        >
                          <Edit2
                            size={24}
                            className="text-white drop-shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                          />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-primary-light/30 to-secondary-light/30 dark:from-primary-dark/30 dark:to-secondary-dark/30">
                      {user?.full_name?.charAt(0)}
                      {isSelf && (
                        <button
                          onClick={() => openModal("avatar_edit")}
                          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
                          aria-label="Add profile picture"
                        >
                          <Edit2
                            size={24}
                            className="text-white drop-shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                          />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* User Info Section - with better alignment */}
                <div className="space-y-4 flex-grow">
                  <div className="flex flex-col ml-1">
                    {/* Full Name with gradient text */}
                    <div className="group relative mt-2">

                      <div className="flex items-center">
                        <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark bg-clip-text text-transparent">
                          {user?.full_name || "Anonymous User"}
                        </h2>
                        {isSelf && (
                          <button
                            onClick={() => openModal("email_edit")}
                            className="ml-2 p-1.5 rounded-full bg-neutral-light dark:bg-neutral-dark text-primary-light dark:text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-light/10 dark:hover:bg-primary-dark/20"
                            aria-label="Edit email"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="group relative mt-2">
                      <div className="flex items-center">
                        <span className=" py-1 bg-neutral-light dark:bg-neutral-dark rounded-full text-on-neutral-light dark:text-on-neutral-dark text-sm font-medium">
                          {user?.email || "No email provided"}
                        </span>
                        {isSelf && (
                          <button
                            onClick={() => openModal("email_edit")}
                            className="ml-2 p-1.5 rounded-full bg-neutral-light dark:bg-neutral-dark text-primary-light dark:text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-light/10 dark:hover:bg-primary-dark/20"
                            aria-label="Edit email"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Username - aligned with other text */}
                    <div className="group relative mt-2">
                      <div className="flex items-center">
                        <span className=" py-1 bg-neutral-light dark:bg-neutral-dark rounded-full text-on-neutral-light dark:text-on-neutral-dark text-sm font-medium">
                          @{user?.user_name || "username"}
                        </span>
                        {isSelf && (
                          <button
                            onClick={() => openModal("user_name_edit")}
                            className="ml-2 p-1.5 rounded-full bg-neutral-light dark:bg-neutral-dark text-primary-light dark:text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-light/10 dark:hover:bg-primary-dark/20"
                            aria-label="Edit username"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badges inline with user info */}
                  <BadgeTray user_id={user.id} />

                  {/* Connections and Likes */}
                </div>
              </div>

              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-neutral-light dark:bg-neutral-dark border border-neutral-dark/20 dark:border-border-dark p-5 rounded-xl transition-colors shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary-light/20 dark:bg-primary-dark/20 rounded-lg">
                        <MessageSquare
                          className="text-primary-light dark:text-primary-dark"
                          size={20}
                        />
                      </div>
                      <p className="text-on-neutral-light dark:text-on-neutral-dark font-medium">
                        Connections
                      </p>
                    </div>
                    <p className="text-2xl font-bold">
                      {connections.length}
                    </p>
                  </div>
                  <div className="bg-neutral-light dark:bg-neutral-dark border border-neutral-dark/20 dark:border-border-dark p-5 rounded-xl transition-colors shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-success/20 rounded-lg">
                        <BarChart className="text-success" size={20} />
                      </div>
                      <p className="text-on-neutral-light dark:text-on-neutral-dark font-medium">
                        Likes
                      </p>
                    </div>
                    <p className="text-2xl font-bold">{likes.length}</p>
                  </div>
                </div>
              </div>

              {/* About Me Section */}
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  About Me
                  {isSelf && (
                    <button
                      className="p-1 rounded-full bg-neutral-light dark:bg-neutral-dark text-primary-light dark:text-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/20 transition-colors"
                      aria-label="Edit bio"
                      onClick={() => openModal("bio_edit")}
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                </h3>
                <div className="bg-neutral-light dark:bg-neutral-dark border border-neutral-dark/20 dark:border-border-dark p-4 rounded-xl">
                  <p className="text-on-neutral-light dark:text-on-neutral-dark">
                    {user?.bio || "This user hasn't added a bio yet."}
                  </p>
                </div>
              </div>

              {/* Favorites Button */}
              <div className="mt-8">
                <button className="w-full bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark hover:from-primary-light/90 hover:to-secondary-light/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 text-on-primary-light dark:text-on-primary-dark py-3 rounded-lg transition duration-200 font-medium flex items-center justify-center gap-2 shadow-md">
                  <span>View Favorites</span>
                  <span className="bg-primary-light/80 dark:bg-primary-dark/80 text-xs px-2 py-1 rounded-full">
                    {favorites.length}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="w-full md:w-1/3 space-y-6">
            {/* Settings Panel */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-gray-300 dark:border-border-dark p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings size={18} className="text-primary-light dark:text-primary-dark" />
                Settings
              </h2>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-neutral-light dark:hover:bg-neutral-dark rounded-lg transition-colors"
                  >
                    <Settings
                      className="text-on-muted-light dark:text-on-muted-dark"
                      size={18}
                    />
                    <span>Account Settings</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-neutral-light dark:hover:bg-neutral-dark rounded-lg transition-colors"
                  >
                    <Bell
                      className="text-on-muted-light dark:text-on-muted-dark"
                      size={18}
                    />
                    <span>Notification Preferences</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-neutral-light dark:hover:bg-neutral-dark rounded-lg transition-colors"
                  >
                    <Lock
                      className="text-on-muted-light dark:text-on-muted-dark"
                      size={18}
                    />
                    <span>Privacy & Security</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 hover:bg-neutral-light dark:hover:bg-neutral-dark rounded-lg transition-colors"
                  >
                    <Link
                      className="text-on-muted-light dark:text-on-muted-dark"
                      size={18}
                    />
                    <span>Connected Accounts</span>
                  </a>
                </li>
                {isSelf && (
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 p-3 text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Log Out</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Premium Features Panel */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-gray-300 dark:border-border-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-primary-light dark:text-primary-dark">✦</span>
                  Premium Features
                </h3>
                <span className="px-2 py-1 bg-primary-light/20 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark text-xs font-medium rounded-full">
                  PRO
                </span>
              </div>
              <div className="bg-gradient-to-r from-primary-light/10 to-secondary-light/10 dark:from-primary-dark/20 dark:to-secondary-dark/20 border border-primary-light/30 dark:border-primary-dark/30 rounded-lg p-4 mb-4">
                <p className="text-on-surface-light dark:text-on-surface-dark font-medium mb-2">
                  Unlock advanced features and analytics.
                </p>
                <ul className="text-on-neutral-light dark:text-on-neutral-dark text-sm space-y-2 mt-3 mb-4">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark"></div>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark"></div>
                    <span>Unlimited templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark"></div>
                    <span>Performance reports</span>
                  </li>
                </ul>
              </div>
              <button className="w-full bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark hover:from-primary-light/90 hover:to-secondary-light/90 dark:hover:from-primary-dark/90 dark:hover:to-secondary-dark/90 text-on-primary-light dark:text-on-primary-dark py-3 rounded-lg transition duration-300 font-medium shadow-lg shadow-primary-light/20 dark:shadow-primary-dark/20">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default ProfilePage;