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
    <div className="bg-[#0d1117] min-h-screen">
      <Navbar />
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Profile Header Card */}
          <div className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-[#30363d] rounded-xl p-8 mb-6 shadow-lg shadow-black/20">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-6">
                {profile.avatar ? (
                  <div className="relative">
                    <img 
                      src={profile.avatar} 
                      alt={profile.username} 
                      className="w-24 h-24 rounded-full object-cover border-2 border-[#30363d]" 
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#238636] rounded-full border-2 border-[#161b22] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center text-3xl font-bold text-white border-2 border-[#30363d] shadow-lg">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-[#e6edf3] mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {profile.username}
                  </h1>
                  {trustData && (
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg">
                        <span className="text-xl">{trustData.badgeEmoji}</span>
                        <span className="font-semibold text-[#e6edf3] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {trustData.badge}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <span className="text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          Trust Score:
                        </span>
                        <span className="font-bold text-[#3fb950]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {trustData.trustScore}/100
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4 pt-6 border-t border-[#30363d]">
              {profile.bio && (
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-sm font-semibold text-[#7d8590] uppercase tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Bio
                    </p>
                  </div>
                  <p className="text-[#c9d1d9] leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {profile.bio}
                  </p>
                </div>
              )}
              
              {profile.website && (
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <p className="text-sm font-semibold text-[#7d8590] uppercase tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Website
                    </p>
                  </div>
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#58a6ff] hover:underline inline-flex items-center space-x-1 transition-colors"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    <span>{profile.website}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
              
              {profile.location && (
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm font-semibold text-[#7d8590] uppercase tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Location
                    </p>
                  </div>
                  <p className="text-[#c9d1d9]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {profile.location}
                  </p>
                </div>
              )}
              
              {!profile.bio && !profile.website && !profile.location && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#21262d] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    No profile information available.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Badge */}
          {profile.isAdmin && (
            <div className="bg-gradient-to-r from-[#7d1d1d] to-[#da3633] border border-[#f85149] rounded-xl p-5 mb-6 shadow-lg shadow-[#7d1d1d]/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#f85149] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-lg" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Admin User
                  </p>
                  <p className="text-red-100 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    This user has administrative privileges
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}