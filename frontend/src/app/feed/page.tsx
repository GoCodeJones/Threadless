'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import { feedService, postService } from '@/services/api';
import { Post } from '@/types';

export default function FeedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadFeed();
    }
  }, [user]);

  const loadFeed = async () => {
    try {
      const data = await feedService.getPersonalFeed();
      setPosts(data.feed);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      await postService.create(newPost, visibility);
      setNewPost('');
      setVisibility('public');
      loadFeed();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setPosting(false);
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
        <div className="max-w-2xl mx-auto px-4">
          {/* Create Post Card */}
          <div className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-[#30363d] rounded-xl p-6 mb-8 shadow-lg shadow-black/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[#e6edf3]">Share your thoughts</h2>
            </div>
            <form onSubmit={handleCreatePost}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-lg focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent resize-none placeholder-[#7d8590] transition-all"
                rows={4}
                required
              />
              <div className="flex items-center justify-between mt-4">
                <div className="relative">
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-[#21262d] border border-[#30363d] text-[#e6edf3] rounded-lg focus:ring-2 focus:ring-[#1f6feb] cursor-pointer hover:bg-[#2d333b] transition-colors"
                  >
                    <option value="public">Public</option>
                    <option value="connections">Connections</option>
                    <option value="private">Private</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d8590] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <button
                  type="submit"
                  disabled={posting}
                  className="px-6 py-2 bg-gradient-to-r from-[#238636] to-[#2ea043] text-white rounded-lg hover:from-[#2ea043] hover:to-[#3fb950] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#238636]/20 font-medium"
                >
                  {posting ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Posting...</span>
                    </span>
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Feed Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#30363d] to-transparent"></div>
            <h2 className="text-xl font-bold text-[#e6edf3] flex items-center space-x-2">
              <span>Feed</span>
              <span className="text-sm font-normal text-[#7d8590]">({posts.length})</span>
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#30363d] to-transparent"></div>
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#21262d] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-[#7d8590] text-lg">No posts yet</p>
              <p className="text-[#7d8590] text-sm mt-2">Create your first post or connect with others!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}