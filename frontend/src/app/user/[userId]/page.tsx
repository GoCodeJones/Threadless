'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { profileService, trustService, postService } from '@/services/api';
import { Post, User } from '@/types';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const userId = parseInt(params.userId as string);
  
  const [profile, setProfile] = useState<any>(null);
  const [trustData, setTrustData] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se é o próprio usuário, redireciona para /profile
    if (currentUser && currentUser.id === userId) {
      router.push('/profile');
      return;
    }
    
    loadUserProfile();
  }, [userId, currentUser]);

  const loadUserProfile = async () => {
    try {
      const [profileData, trustScoreData] = await Promise.all([
        profileService.getUserProfile(userId),
        trustService.getUserScore(userId)
      ]);

      setProfile(profileData);
      setTrustData(trustScoreData);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-red-600">User not found</div>
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
            <div className="flex items-center space-x-4 mb-6">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.username} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                {trustData && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg">{trustData.badgeEmoji}</span>
                    <span className="font-semibold">{trustData.badge}</span>
                    <span className="text-gray-600">({trustData.trustScore}/100)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {profile.bio && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Bio</p>
                  <p className="text-gray-800">{profile.bio}</p>
                </div>
              )}
              {profile.website && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Website</p>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile.website}
                  </a>
                </div>
              )}
              {profile.location && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-800">{profile.location}</p>
                </div>
              )}
              {!profile.bio && !profile.website && !profile.location && (
                <p className="text-gray-500 text-center py-4">No profile information available.</p>
              )}
            </div>
          </div>

          {profile.isAdmin && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-semibold">Admin User</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}