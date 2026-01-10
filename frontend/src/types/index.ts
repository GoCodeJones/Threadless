export interface User {
  id: number;
  username: string;
  trustScore: number;
  isAdmin: boolean;
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
  badge?: string;
  badgeEmoji?: string;
  createdAt?: string;
}

export interface Post {
  id: number;
  user_id: number;
  content: string;
  visibility: 'public' | 'connections' | 'private';
  is_promoted: boolean;
  created_at: string;
  author?: {
    id: number;
    username: string;
    trustScore: number;
    isAdmin: boolean;
  };
  commentsCount?: number;
}

export interface Connection {
  id: number;
  user: {
    id: number;
    username: string;
    trustScore: number;
  };
  createdAt: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user?: {
    id: number;
    username: string;
    trustScore: number;
  };
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    trustScore: number;
  };
}

export interface CommentResponse {
  comments: Comment[];
  count: number;
}