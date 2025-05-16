export interface UserDetail {
  id: string;
  email: string;
  avatar_url: string;
  full_name: string;
  user_name: string;
  bio: string;
}

interface ResponseData<T> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
}

export type Response<T> = Promise<ResponseData<T>>;

export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export interface Connection {
  id: string;
  initiator: string;
  target: string;
  status: ConnectionStatus;
}

export interface UserConnection {
  connection_id: string;
  user_name: string;
  full_name: string;
  avatar_url: string;
}

export interface Connections {
  outgoing_requests: UserConnection[];
  incoming_requests: UserConnection[];
  active_connections: UserConnection[];
  blocked_users: UserConnection[];
}

export interface BadgeDetail {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export interface RepositoryDetail {
  id: string;
  name: string;
  description: string;
  type: string;
  author_id: string;
  tags: string[];
}

export type VoteType = 'upvote' | 'downvote' | null;
export type ContentType = "repository" | "component" | "configuration" | "flavour"| "blog";
export interface Vote {
  id: string;
  user_id: string;
  repo_id?: string;
  vote: VoteType;
}

export type AttachmentType = 'image' | 'document' | 'file';

export interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size: number;
}

export interface Message {
  id: string;
  content: string;
  sender: 'me' | 'other';
  seen: boolean;
  attachments: Attachment[];
  created_at: string;
  updated_at: string;
}

export interface MessageGroupType {
  date: string;
  messages: Message[];
}