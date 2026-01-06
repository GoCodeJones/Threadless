'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { aboutService } from '@/services/api';

export default function AboutPage() {
  const [about, setAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const data = await aboutService.getAbout();
      setAbout(data);
    } catch (error) {
      console.error('Failed to load about data:', error);
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

  if (!about) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-red-600">Failed to load about information</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <Navbar />
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-[#30363d] rounded-xl p-8 mb-6 shadow-lg shadow-black/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {about.project.name}
              </h1>
            </div>
            <p className="text-xl text-[#7d8590] mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {about.project.tagline}
            </p>
            <p className="text-[#c9d1d9] mb-3 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {about.project.description}
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-lg">
              <span className="text-xs font-semibold text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                VERSION
              </span>
              <span className="text-sm font-mono text-[#e6edf3]">{about.project.version}</span>
            </div>
          </div>

          {/* Core Principles */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 mb-6 shadow-lg shadow-black/20">
            <h2 className="text-2xl font-bold mb-6 text-[#e6edf3] flex items-center space-x-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <svg className="w-6 h-6 text-[#238636]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Core Principles</span>
            </h2>
            <div className="space-y-4">
              {about.principles.map((principle: any, index: number) => (
                <div key={index} className="border-l-4 border-[#238636] bg-[#0d1117] pl-4 py-3 rounded-r-lg">
                  <h3 className="font-semibold text-lg mb-1 text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {principle.title}
                  </h3>
                  <p className="text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 mb-6 shadow-lg shadow-black/20">
            <h2 className="text-2xl font-bold mb-6 text-[#e6edf3] flex items-center space-x-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <svg className="w-6 h-6 text-[#1f6feb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Features</span>
            </h2>
            <div className="space-y-6">
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-2 text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {about.features.trustSystem.name}
                </h3>
                <p className="text-[#7d8590] mb-3" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {about.features.trustSystem.description}
                </p>
                <div className="space-y-1">
                  {about.features.trustSystem.badges.map((badge: string, index: number) => (
                    <p key={index} className="text-sm text-[#c9d1d9] flex items-center space-x-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      <span className="w-1.5 h-1.5 bg-[#238636] rounded-full"></span>
                      <span>{badge}</span>
                    </p>
                  ))}
                </div>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-2 text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {about.features.connections.name}
                </h3>
                <p className="text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {about.features.connections.description}
                </p>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-2 text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {about.features.posts.name}
                </h3>
                <p className="text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {about.features.posts.description}
                </p>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-2 text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {about.features.comments.name}
                </h3>
                <p className="text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {about.features.comments.description}
                </p>
              </div>
            </div>
          </div>

          {/* Roadmap */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 mb-6 shadow-lg shadow-black/20">
            <h2 className="text-2xl font-bold mb-6 text-[#e6edf3] flex items-center space-x-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <svg className="w-6 h-6 text-[#a371f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Roadmap</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-[#238636] rounded-full"></div>
                  <h3 className="font-semibold text-lg text-[#238636]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Completed
                  </h3>
                </div>
                <ul className="space-y-3">
                  {about.roadmap.completed.map((item: string, index: number) => (
                    <li key={index} className="flex items-start bg-[#0d1117] border border-[#30363d] rounded-lg p-3">
                      <svg className="w-5 h-5 text-[#238636] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#c9d1d9] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-[#1f6feb] rounded-full"></div>
                  <h3 className="font-semibold text-lg text-[#58a6ff]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Upcoming
                  </h3>
                </div>
                <ul className="space-y-3">
                  {about.roadmap.upcoming.map((item: string, index: number) => (
                    <li key={index} className="flex items-start bg-[#0d1117] border border-[#30363d] rounded-lg p-3">
                      <svg className="w-5 h-5 text-[#58a6ff] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#c9d1d9] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contribute */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 mb-6 shadow-lg shadow-black/20">
            <h2 className="text-2xl font-bold mb-4 text-[#e6edf3] flex items-center space-x-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <svg className="w-6 h-6 text-[#f85149]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>How to Contribute</span>
            </h2>
            <p className="text-[#7d8590] mb-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {about.contribute.description}
            </p>
            <div className="space-y-4">
              {about.contribute.ways.map((way: any, index: number) => (
                <div key={index} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 hover:border-[#388bfd] transition-colors">
                  <h3 className="font-semibold mb-2 text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {way.type}
                  </h3>
                  <p className="text-[#7d8590] text-sm mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {way.description}
                  </p>
                  {way.link && (
                    <a href={way.link} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline text-sm inline-flex items-center space-x-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      <span>{way.link}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Philosophy */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 mb-6 shadow-lg shadow-black/20">
            <h2 className="text-2xl font-bold mb-4 text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {about.philosophy.title}
            </h2>
            <p className="text-[#c9d1d9] leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {about.philosophy.content}
            </p>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-[#30363d] rounded-xl p-8 shadow-lg shadow-black/20">
            <h2 className="text-2xl font-bold mb-6 text-[#e6edf3] flex items-center space-x-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <svg className="w-6 h-6 text-[#8957e5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-[#7d8590] min-w-24" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Creator:</span>
                <span className="font-semibold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{about.contact.creator}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#7d8590] min-w-24" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>GitHub:</span>
                <a href={about.contact.github} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline inline-flex items-center space-x-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <span>{about.contact.github}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#7d8590] min-w-24" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Email:</span>
                <span className="text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{about.contact.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}