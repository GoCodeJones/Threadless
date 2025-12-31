export interface User {
  id?: number;
  username: string;
  password_hash: string;
  master_password: string;
  trust_score: number;
  is_admin: boolean;
  profile_data?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id?: number;
  user_id: number;
  content: string;
  visibility: 'public' | 'connections' | 'private';
  is_promoted: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Connection {
  id?: number;
  user_id_1: number;
  user_id_2: number;
  connection_key: string;
  status: 'pending' | 'active' | 'rejected';
  created_at?: string;
}

export interface Comment {
  id?: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at?: string;
}