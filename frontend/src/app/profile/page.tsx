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
    <div className="bg-[#0d1117]">
      <Navbar />
      <div className="min-h-screen bg-[#0d1117] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                {avatar ? (
                  <img src={avatar} alt={user?.username} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#21262d] flex items-center justify-center text-2xl font-bold text-[#7d8590]">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-[#e6edf3]">{user?.username}</h1>
                  {trustData && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg">{trustData.badgeEmoji}</span>
                      <span className="font-semibold text-[#e6edf3]">{trustData.badge}</span>
                      <span className="text-[#7d8590]">({trustData.trustScore}/100)</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 border border-[#30363d] text-[#e6edf3] rounded-lg hover:bg-[#21262d]"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#e6edf3] mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-lg focus:ring-2 focus:ring-[#1f6feb] placeholder-[#7d8590]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#e6edf3] mb-1">Avatar URL</label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-lg focus:ring-2 focus:ring-[#1f6feb] placeholder-[#7d8590]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#e6edf3] mb-1">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-lg focus:ring-2 focus:ring-[#1f6feb] placeholder-[#7d8590]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#e6edf3] mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-lg focus:ring-2 focus:ring-[#1f6feb] placeholder-[#7d8590]"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {bio && (
                  <div>
                    <p className="text-sm font-medium text-[#7d8590]">Bio</p>
                    <p className="text-[#e6edf3]">{bio}</p>
                  </div>
                )}
                {website && (
                  <div>
                    <p className="text-sm font-medium text-[#7d8590]">Website</p>
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline">
                      {website}
                    </a>
                  </div>
                )}
                {location && (
                  <div>
                    <p className="text-sm font-medium text-[#7d8590]">Location</p>
                    <p className="text-[#e6edf3]">{location}</p>
                  </div>
                )}
                {!bio && !website && !location && (
                  <p className="text-[#7d8590] text-center py-4">No profile information yet. Click Edit Profile to add details.</p>
                )}
              </div>
            )}
          </div>

          {trustData && (
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-[#e6edf3]">Trust Score Breakdown</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#7d8590]">Profile Completion</span>
                  <span className="font-semibold text-[#e6edf3]">{trustData.breakdown.profileCompletion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d8590]">Posts Activity</span>
                  <span className="font-semibold text-[#e6edf3]">{trustData.breakdown.postsActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d8590]">Interaction Quality</span>
                  <span className="font-semibold text-[#e6edf3]">{trustData.breakdown.interactionQuality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d8590]">Account Age</span>
                  <span className="font-semibold text-[#e6edf3]">{trustData.breakdown.accountAge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d8590]">Connections Count</span>
                  <span className="font-semibold text-[#e6edf3]">{trustData.breakdown.connectionsCount}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#e6edf3]">My Posts ({posts.length})</h2>
            {posts.length === 0 ? (
              <p className="text-[#7d8590] text-center py-8">No posts yet.</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border border-[#30363d] bg-[#0d1117] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs px-2 py-1 bg-[#21262d] text-[#e6edf3] rounded">{post.visibility}</span>
                      <span className="text-sm text-[#7d8590]">{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[#e6edf3] whitespace-pre-wrap">{post.content}</p>
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