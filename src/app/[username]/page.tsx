"use client";

import React, { useState, useEffect, FC, use } from "react";
import Image from "next/image";
import {
  Edit2,
  Settings,
  Bell,
  Lock,
  Link,
  LogOut,
  BarChart,
  UserRoundX,
} from "lucide-react";
import { UserDetail } from "@/lib/types";
import { useUser } from "@/hooks/useUser";
import { useModal } from "@/hooks/useModal";
import { AvatarForm, BioForm, EmailForm, FullNameForm, UserNameForm } from "./editing_forms";
import { useRouter } from "next/navigation";
import BadgeTray from "@/components/Badge";
import { ConnectionButton, ConnectionCard, ConnectionManager } from "./connections";
import StatsCard from "@/components/StatsCard";
import { getUserByUsername } from "@/lib/data/users";
import { DeleteAccountModal, RepositoriesCard, SettingsMenu } from "./settings";


const favorites = ["post1", "post2", "post3"];


interface ProfilePageProps {
  params: { username: string };
}

const ProfilePage: FC<ProfilePageProps> = ({ params }) => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [userState, setUserState] = useState<"loading" | "error" | "success">("loading");
  const [userError, setUserError] = useState<string | null>(null);

  const { user: selfUser, isLoading: selfLoading, isAuthenticated: selfAuthenticated, signOut, reloadUser } = useUser();
  const [isSelf, setIsSelf] = useState(false);

  const { openModal } = useModal();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { username } = await params;
      const decodedUsername = decodeURIComponent(username);
      try {
        setUserState("loading");
        setUserError(null);
        if (selfLoading) return;
        if (selfAuthenticated && selfUser!.user_name === decodedUsername) {
          setUser(selfUser);
          setIsSelf(true);
          setUserState("success");
          return;
        }
        const response = await getUserByUsername(decodedUsername);
        console.log("User data response:", response);
        if (!response.success) {
          setUserState("error");
          setUserError(response.message);
          return;
        }
        setUser(response.data);
        setUserState("success");
        setUserError(null);
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setUserState("error");
        setUserError(err.message || "Failed to fetch user data");
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
    }
  };

  const handleUsernameChange = (newUserName: string) => {
    setUser((prev) => (prev ? { ...prev, user_name: newUserName } : prev));
    router.push(`/${newUserName}`);
    setIsSelf(true);
  };

  const onDelete = async () => {
    setUserState("loading");
    await handleSignOut();
    router.push("/");
  };

  if (userState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (userState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-error">{userError}</p>
      </div>
    );
  }

  return (<>
    {user && (
      <>
        <FullNameForm initialValue={user.full_name!} userId={user.id!} setNewFullName={(newFullName) => setUser((prev) => (prev ? { ...prev, full_name: newFullName } : prev))} />
        {isSelf && <EmailForm initialValue={user.email!} userId={user.id!} setNewEmail={(newEmail) => setUser((prev) => (prev ? { ...prev, email: newEmail } : prev))} fullName={user.full_name!} />}
        <UserNameForm initialValue={user.user_name!} userId={user.id!} setNewUserName={handleUsernameChange} />
        <AvatarForm initialUrl={user.avatar_url} userId={user.id!} onAvatarUpdate={(newAvatar) => setUser((prev) => (prev ? { ...prev, avatar_url: newAvatar } : prev))} />
        <BioForm initialValue={user.bio!} userId={user.id!} setNewBio={(newBio) => setUser((prev) => (prev ? { ...prev, bio: newBio } : prev))} />
        <ConnectionManager user_id={user.id!} />
        {isSelf && <DeleteAccountModal username={user.user_name!} onAccountDeleted={onDelete} />}
      </>
    )}
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
      <div className="max-w-6xl mx-auto p-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Information */}
          <div className={`w-full bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-gray-300 dark:border-border-dark overflow-hidden`}>
            <div className="p-6 ">
              {/* User Header Section - Avatar on left, info on right */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
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
                    <div className="relative mt-2">
                      <div className="flex items-center justify-between">
                        <div className="group flex items-center" onClick={() => {
                          if (isSelf) {
                            openModal("full_name_edit");
                          }
                        }}>
                          <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark bg-clip-text text-transparent">
                            {user?.full_name || "Anonymous User"}
                          </h2>
                          {isSelf && (
                            <div
                              className="ml-2 p-1.5 rounded-full bg-neutral-light dark:bg-neutral-dark text-primary-light dark:text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-light/10 dark:hover:bg-primary-dark/20"
                              aria-label="Edit full name"
                            >
                              <Edit2 size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    {isSelf && (
                      <div className="relative mt-2">
                        <div className="group flex items-center" onClick={() => {
                          if (isSelf) {
                            openModal("email_edit");
                          }
                        }}>
                          <span className=" py-1 bg-neutral-light dark:bg-neutral-dark rounded-full text-on-neutral-light dark:text-on-neutral-dark text-sm font-medium">
                            {user?.email || "No email provided"}
                          </span>
                          {isSelf && (
                            <div
                              className="ml-2 p-1.5 rounded-full bg-neutral-light dark:bg-neutral-dark text-primary-light dark:text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-light/10 dark:hover:bg-primary-dark/20"
                              aria-label="Edit email"
                            >
                              <Edit2 size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Username - aligned with other text */}
                    <div className="relative mt-2">
                      <div className="group flex items-center" onClick={() => {
                        if (isSelf) {
                          openModal("user_name_edit");
                        }
                      }} >
                        <span className=" py-1 bg-neutral-light dark:bg-neutral-dark rounded-full text-on-neutral-light dark:text-on-neutral-dark text-sm font-medium">
                          {user?.user_name || "username"}
                        </span>
                        {isSelf && (
                          <div
                            className="ml-2 p-1.5 rounded-full bg-neutral-light dark:bg-neutral-dark text-primary-light dark:text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-light/10 dark:hover:bg-primary-dark/20"
                            aria-label="Edit username"
                          >
                            <Edit2 size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Connections and Likes */}
                </div>

                <div className="flex flex-col">
                  {selfUser && (<ConnectionButton user_id={selfUser!.id} profile_user_id={user!.id} />)}
                  <div className="mt-2 w-[150px] sm:w-[180px] mt-4"><BadgeTray user_id={user!.id} /></div>
                </div>
              </div>

              {/* About Me Section */}
              <div className="mt-8">
                <div
                  className={`bg-neutral-light dark:bg-neutral-dark border border-neutral-dark/20 dark:border-border-dark p-4 rounded-xl group transition-all duration-300 ${isSelf ? "hover:shadow-lg hover:border-primary-light dark:hover:border-primary-dark" : ""
                    }`}
                  onClick={() => {
                    if (isSelf) {
                      openModal("bio_edit");
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-on-neutral-light dark:text-on-neutral-dark text-sm sm:text-base">
                      {user?.bio || "This user hasn't added a bio yet."}
                    </p>
                    {isSelf && (
                      <button
                        className="ml-2 p-1.5 rounded-full bg-neutral-light dark:bg-neutral-dark text-primary-light dark:text-primary-dark opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-light/10 dark:hover:bg-primary-dark/20"
                        aria-label="Edit bio"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6 mt-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <ConnectionCard user_id={user!.id} />
                  <RepositoriesCard user_id={user!.id} />
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          {isSelf && (
            <SettingsMenu onSignOut={handleSignOut} onAccountDelete={onDelete} />
          )}
        </div>
      </div>
    </div>
  </>
  );
};

export default ProfilePage;