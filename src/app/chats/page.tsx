'use client';
import { useUser } from '@/hooks/useUser';
import { getUserConnections } from '@/lib/data/users';
import { UserConnection } from '@/lib/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ChatView } from './ChatPreview';
import { getOnlineUsersLive } from '@/lib/data/chats';

interface ChatSidebarTimeProps {
  connection: UserConnection,
  selectedConnection: UserConnection | null,
  setSelectedConnection: (connection: UserConnection | null) => void,
  onlineUsers: string[]
}

export const ChatSidebarTile: React.FC<ChatSidebarTimeProps> = ({ connection, selectedConnection, setSelectedConnection, onlineUsers }) => {

  const isOnline = onlineUsers.includes(connection.user_name);

  return (
    <li
      className={`p-2 rounded cursor-pointer ${selectedConnection && selectedConnection.connection_id === connection.connection_id
        ? 'bg-gradient-to-r from-primary-dark to-secondary-dark text-on-primary-dark hover:opacity-90 dark:from-primary-light dark:to-secondary-light dark:text-on-primary-light'
        : 'hover:bg-accent-dark text-on-surface-dark'
        }`}
      onClick={() => setSelectedConnection(connection)}
    >
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Image
            src={connection.avatar_url}
            alt={`${connection.full_name}'s avatar`}
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${isOnline ? 'bg-green-500' : 'bg-gray-500'} border-2 border-white rounded-full`} />
        </div>
        <div>
          <p className="font-semibold">{connection.full_name}</p>
          <p className={`text-sm ${selectedConnection && selectedConnection.connection_id === connection.connection_id
            ? 'text-foreground-dark'
            : 'text-gray-500'
            }`}>{connection.user_name}</p>
        </div>
      </div>
    </li>
  );
}


interface ChatSidebarProps {
  user_id: string;
  selectedConnection: UserConnection | null;
  setSelectedConnection: (connection: UserConnection | null) => void;
  onlineUsers: string[];
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ user_id, selectedConnection, setSelectedConnection, onlineUsers }) => {

  const [activeConnections, setActiveConnections] = useState<UserConnection[] | null>(null);
  const [activeConnectionsState, setActiveConnectionsState] = useState<"loading" | "error" | "success">("loading");
  const [activeConnectionsError, setActiveConnectionsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await getUserConnections(user_id);
        if (!response.success) {
          setActiveConnectionsState("error");
          setActiveConnectionsError(response.message);
          return;
        }
        setActiveConnections(response.data!.active_connections);
        setActiveConnectionsState("success");
        setActiveConnectionsError(null);
      } catch (error) {
        console.error('Error fetching connection:', error);
        setActiveConnectionsState("error");
        setActiveConnectionsError('An error occurred while fetching connection data.');
        setActiveConnections(null);
      }
    };
    fetchConnections();
  }, [user_id]);

  if (activeConnectionsState === "loading") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (activeConnectionsState === "error") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {activeConnectionsError || 'Failed to load connections.'}</p>
      </div>
    );
  }

  return (
    <div className="w-64 bg-surface-dark p-4 border-r border-border-dark">
      <h3 className="text-lg font-semibold mb-4">Chats</h3>
      <ul className="space-y-2">
        {activeConnections!.length === 0 ? (
          <li className="p-2 rounded cursor-pointer hover:bg-accent-dark text-on-surface-dark">
            No active connections
          </li>
        ) : (
          activeConnections!.map((connection) => (
            <ChatSidebarTile
              key={connection.connection_id}
              connection={connection}
              selectedConnection={selectedConnection}
              setSelectedConnection={setSelectedConnection}
              onlineUsers={onlineUsers}
            />
          )))
        }
      </ul>
    </div>
  );
}


function Page() {

  const { user, isLoading, isAuthenticated } = useUser();

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {

    if (!user) return;
    getOnlineUsersLive(setOnlineUsers);
  }, [user]);

  const [selectedConnection, setSelectedConnection] = useState<UserConnection | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Please log in to view your chats.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-dark text-foreground-dark">
      {/* Sidebar */}
      <ChatSidebar
        user_id={user!.id}
        selectedConnection={selectedConnection}
        setSelectedConnection={setSelectedConnection}
        onlineUsers={onlineUsers}
      />

      {/* Chat Area */}
      <div className="flex-1">
        <ChatView selectedConnection={selectedConnection} setSelectedConnection={setSelectedConnection} onlineUsers={onlineUsers} />
      </div>
    </div>
  );
}

export default Page;
