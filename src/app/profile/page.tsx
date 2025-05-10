/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
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

// Mock user data
const mockUser = {
  id: "1",
  email: "user@example.com",
  avatar: "",
  name: "John Doe",
  username: "johndoe",
  role: "Software Developer",
  bio: "Software developer passionate about creating intuitive user experiences and solving complex problems. Experienced in modern front-end frameworks and back-end technologies.",
  followers: ["2", "3", "4"],
  following: ["5", "6"],
  favorites: ["post1", "post2", "post3"],
  likes: ["post4", "post5"],
  badges: ["Contributor", "Problem Solver", "Top Writer"],
};

const ProfilePage = () => {
  const [user, setUser] = useState(mockUser);

  const logout = () => {
    // Implement logout functionality
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
      <div className="max-w-6xl mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-['roboto'] mt-4">My Profile</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Information */}
          <div className="w-full md:w-2/3 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-gray-300 dark:border-border-dark p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <div className="relative h-28 w-28 rounded-full overflow-hidden bg-neutral-light dark:bg-neutral-dark border-2 border-gray-300 dark:border-border-dark shadow-lg">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="Profile avatar"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xl font-bold text-foreground-light dark:text-foreground-dark">
                    {user.name}
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-on-muted-light dark:text-on-muted-dark">
                  {user.email}
                </p>
                <p className="text-sm text-on-neutral-light dark:text-on-neutral-dark mt-1">
                  {" "}
                  • {user.role}{" "}
                </p>
                <button className="mt-4 flex items-center gap-2 mx-auto sm:mx-0 bg-neutral-light dark:bg-neutral-dark hover:bg-muted-light dark:hover:bg-accent-dark transition-colors px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-border-dark">
                  <Edit2 size={16} /> Edit Profile
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-neutral-light dark:bg-neutral-dark border border-neutral-dark/40 dark:border-border-dark p-5 rounded-xl  transition-colors">
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
                  {user.followers.length + user.following.length}
                </p>
              </div>
              <div className="bg-neutral-light dark:bg-neutral-dark border border-neutral-dark/40 dark:border-border-dark p-5 rounded-xl  transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <BarChart className="text-success" size={20} />
                  </div>
                  <p className="text-on-neutral-light dark:text-on-neutral-dark font-medium">
                    Likes
                  </p>
                </div>
                <p className="text-2xl font-bold">{user.likes.length}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold mb-3">About Me</h3>
              <p className="text-on-neutral-light dark:text-on-neutral-dark bg-neutral-light dark:bg-neutral-dark border border-neutral-dark/40 dark:border-border-dark p-3 rounded-xl">
                {user.bio}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-primary-light/20 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark px-3 py-1 rounded-full text-sm border border-primary-light/50 dark:border-primary-dark/30"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <button className="w-full bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark dark:hover:bg-primary-dark/90 text-on-primary-light dark:text-on-primary-dark py-3 rounded-lg transition duration-200 font-medium flex items-center justify-center gap-2">
                <span>View Favorites</span>
                <span className="bg-primary-light/80 dark:bg-primary-dark/80 text-xs px-2 py-1 rounded-full">
                  {user.favorites.length}
                </span>
              </button>
            </div>
          </div>

          {/* Settings Section */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-gray-300 dark:border-border-dark p-6">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
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
                <li>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-3 text-error hover:bg-error/10 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Log Out</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-gray-300 dark:border-border-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Premium Features</h3>
                <span className="px-2 py-1 bg-primary-light/20 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark text-xs font-medium rounded-full">
                  PRO
                </span>
              </div>
              <div className="bg-gradient-to-r from-primary-light/20 to-secondary-light/20 dark:from-primary-dark/30 dark:to-secondary-dark/30 border border-primary-light/50 dark:border-primary-dark/50 rounded-lg p-4 mb-4">
                <p className="text-on-surface-light dark:text-on-surface-dark mb-1">
                  Unlock advanced features and analytics.
                </p>
                <ul className="text-on-neutral-light dark:text-on-neutral-dark text-sm space-y-1 mt-3 mb-4">
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
  );
};

export default ProfilePage;
