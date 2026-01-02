'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { profileService, trustService, postService } from '@/services/api';
import { Post } from '@/types';

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [trustData, setTrustData] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const [profileData, trustScoreData, postsData] = await Promise.all([
        profileService.getMyProfile(),
        trustService.getMyScore(),
        postService.getMyPosts()
      ]);

      setBio(profileData.bio || '');
      setAvatar(profileData.avatar || '');
      setWebsite(profileData.website || '');
      setLocation(profileData.location || '');
      setTrustData(trustScoreData);
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileService.updateProfile({ bio, avatar, website, location });
      await refreshUser();
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
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
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                {avatar ? (
                  <img src={avatar} alt={user?.username} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">{user?.username}</h1>
                  {trustData && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg">{trustData.badgeEmoji}</span>
                      <span className="font-semibold">{trustData.badge}</span>
                      <span className="text-gray-600">({trustData.trustScore}/100)</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {bio && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bio</p>
                    <p className="text-gray-800">{bio}</p>
                  </div>
                )}
                {website && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {website}
                    </a>
                  </div>
                )}
                {location && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-gray-800">{location}</p>
                  </div>
                )}
                {!bio && !website && !location && (
                  <p className="text-gray-500 text-center py-4">No profile information yet. Click Edit Profile to add details.</p>
                )}
              </div>
            )}
          </div>

          {trustData && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Trust Score Breakdown</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-semibold">{trustData.breakdown.profileCompletion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posts Activity</span>
                  <span className="font-semibold">{trustData.breakdown.postsActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interaction Quality</span>
                  <span className="font-semibold">{trustData.breakdown.interactionQuality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Age</span>
                  <span className="font-semibold">{trustData.breakdown.accountAge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Connections Count</span>
                  <span className="font-semibold">{trustData.breakdown.connectionsCount}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">My Posts ({posts.length})</h2>
            {posts.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No posts yet.</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">{post.visibility}</span>
                      <span className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}