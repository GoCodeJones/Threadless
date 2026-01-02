'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
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
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Create Post</h2>
            <form onSubmit={handleCreatePost}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                rows={4}
                required
              />
              <div className="flex items-center justify-between mt-4">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                >
                  <option value="public">Public</option>
                  <option value="connections">Connections</option>
                  <option value="private">Private</option>
                </select>
                <button
                  type="submit"
                  disabled={posting}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>

          <h2 className="text-2xl font-bold mb-4">Feed</h2>

          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">No posts yet. Create your first post or connect with others!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{post.author?.username}</span>
                      {post.author?.isAdmin && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Admin</span>
                      )}
                      {post.is_promoted && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Promoted</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="capitalize">{post.visibility}</span>
                    <span>{post.commentsCount || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}