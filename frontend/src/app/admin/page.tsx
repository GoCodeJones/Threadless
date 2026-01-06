'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/services/api';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.isAdmin) {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'dashboard') {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.stats);
      } else if (activeTab === 'users') {
        const response = await api.get('/admin/users');
        setUsers(response.data.users);
      } else if (activeTab === 'posts') {
        const response = await api.get('/admin/posts');
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/admin/posts/${postId}`);
      loadData();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  if (authLoading || loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <Navbar />
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Admin Header */}
          <div className="bg-gradient-to-r from-[#7d1d1d] to-[#da3633] border border-[#f85149] rounded-xl p-6 mb-6 shadow-lg shadow-[#7d1d1d]/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#f85149] rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Admin Panel
                </h1>
                <p className="text-red-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Manage users, posts, and view statistics
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Container */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl shadow-lg shadow-black/20 overflow-hidden">
            <div className="border-b border-[#30363d] bg-[#0d1117]">
              <nav className="flex space-x-1 px-4">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-4 px-6 font-medium text-sm transition-all relative ${
                    activeTab === 'dashboard'
                      ? 'text-[#e6edf3]'
                      : 'text-[#7d8590] hover:text-[#e6edf3]'
                  }`}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Dashboard</span>
                  </span>
                  {activeTab === 'dashboard' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#f85149] to-[#da3633]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-4 px-6 font-medium text-sm transition-all relative ${
                    activeTab === 'users'
                      ? 'text-[#e6edf3]'
                      : 'text-[#7d8590] hover:text-[#e6edf3]'
                  }`}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Users</span>
                  </span>
                  {activeTab === 'users' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#f85149] to-[#da3633]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`py-4 px-6 font-medium text-sm transition-all relative ${
                    activeTab === 'posts'
                      ? 'text-[#e6edf3]'
                      : 'text-[#7d8590] hover:text-[#e6edf3]'
                  }`}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span>Posts</span>
                  </span>
                  {activeTab === 'posts' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#f85149] to-[#da3633]"></div>
                  )}
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && stats && (
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-[#1c2d41] to-[#0d1b2a] border border-[#1f6feb] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#58a6ff] text-sm font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        Total Users
                      </p>
                      <svg className="w-8 h-8 text-[#1f6feb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-4xl font-bold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {stats.totalUsers}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#0d2818] to-[#051f0d] border border-[#238636] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#3fb950] text-sm font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        Total Posts
                      </p>
                      <svg className="w-8 h-8 text-[#238636]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <p className="text-4xl font-bold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {stats.totalPosts}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#2d1b40] to-[#1a0d2e] border border-[#8957e5] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#a371f7] text-sm font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        Connections
                      </p>
                      <svg className="w-8 h-8 text-[#8957e5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <p className="text-4xl font-bold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {stats.totalConnections}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#3d2000] to-[#2d1700] border border-[#d4a72c] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#e3b341] text-sm font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        Comments
                      </p>
                      <svg className="w-8 h-8 text-[#d4a72c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-4xl font-bold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {stats.totalComments}
                    </p>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-[#30363d]">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#7d8590] uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#7d8590] uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Username</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#7d8590] uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Trust Score</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#7d8590] uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Role</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#7d8590] uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#30363d]">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-[#0d1117] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7d8590] font-mono" style={{ fontFamily: 'Monaco, Consolas, monospace' }}>
                            #{u.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center text-xs font-bold text-white">
                                {u.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                {u.username}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-[#3fb950]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                              {u.trust_score}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {u.is_admin ? (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-[#da3633] to-[#f85149] text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                Admin
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#21262d] text-[#7d8590] border border-[#30363d]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                User
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 hover:border-[#388bfd] transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center text-xs font-bold text-white">
                            {post.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                            {post.username}
                          </span>
                          {post.is_admin && (
                            <span className="px-2 py-1 bg-gradient-to-r from-[#da3633] to-[#f85149] text-white text-xs rounded-md font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                              Admin
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="px-4 py-2 bg-gradient-to-r from-[#da3633] to-[#f85149] text-white text-sm rounded-lg hover:from-[#f85149] hover:to-[#ff7b72] transition-all font-medium"
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-[#c9d1d9] mb-3 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        <span className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(post.created_at.replace(' ', 'T')).toLocaleDateString()}</span>
                        </span>
                        <span>•</span>
                        <span className="capitalize">{post.visibility}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}