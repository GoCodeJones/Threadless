import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authService = {
  register: async (username: string, password: string) => {
    const response = await api.post('/auth/register', { username, password });
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 7 });
    }
    return response.data;
  },

  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 7 });
    }
    return response.data;
  },

  logout: () => {
    Cookies.remove('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },
};

// Posts
export const postService = {
  create: async (content: string, visibility: string) => {
    const response = await api.post('/posts', { content, visibility });
    return response.data;
  },

  getMyPosts: async () => {
    const response = await api.get('/posts/my-posts');
    return response.data.posts;
  },

  getById: async (id: number) => {
    const response = await api.get(`/posts/${id}`);
    return response.data.post;
  },

  update: async (id: number, content: string) => {
    const response = await api.put(`/posts/${id}`, { content });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

// Feed
export const feedService = {
  getPersonalFeed: async (limit = 50, offset = 0) => {
    const response = await api.get(`/feed?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  getPublicFeed: async (limit = 50, offset = 0) => {
    const response = await api.get(`/feed/public?limit=${limit}&offset=${offset}`);
    return response.data;
  },
};

// Connections
export const connectionService = {
  generateKey: async () => {
    const response = await api.post('/connections/generate-key');
    return response.data;
  },

  connect: async (connectionKey: string) => {
    const response = await api.post('/connections/connect', { connectionKey });
    return response.data;
  },

  getMyConnections: async () => {
    const response = await api.get('/connections/my-connections');
    return response.data.connections;
  },

  checkConnection: async (userId: number) => {
    const response = await api.get(`/connections/check/${userId}`);
    return response.data.connected;
  },
};

// Trust
export const trustService = {
  getMyScore: async () => {
    const response = await api.get('/trust/me');
    return response.data;
  },

  getUserScore: async (userId: number) => {
    const response = await api.get(`/trust/user/${userId}`);
    return response.data;
  },

  updateScore: async () => {
    const response = await api.post('/trust/update');
    return response.data;
  },
};

// Comments
export const commentService = {
  // Get comments for a post
  getByPostId: async (postId: number) => {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  },

  // Create a comment
  create: async (postId: number, content: string) => {
    const response = await api.post('/comments', { postId, content });
    return response.data;
  },

  // Delete a comment
  delete: async (commentId: number) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};

// Profile
export const profileService = {
  getMyProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data.profile;
  },

  getUserProfile: async (userId: number) => {
    const response = await api.get(`/profile/user/${userId}`);
    return response.data.profile;
  },

  updateProfile: async (data: { bio?: string; avatar?: string; website?: string; location?: string }) => {
    const response = await api.put('/profile/me', data);
    return response.data;
  },
};

// About
export const aboutService = {
  getAbout: async () => {
    const response = await api.get('/about');
    return response.data;
  },
};

export default api;