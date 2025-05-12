export interface UserDetail {
    id: string;
    email: string;
    avatar_url: string;
    full_name: string;
    user_name: string;
    bio: string;
}

export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T | null;
}

export type ConnectionStatus = 'requested' | 'accepted' | 'declined' | 'blocked';

export interface Connection {
  id: string;
  initiator: string;
  target: string;
  created_at: string;
  updated_at: string;
  status: ConnectionStatus;
}

export interface BadgeDetail {
  id: string;
  name: string;
  description: string;
  image_url: string;
}