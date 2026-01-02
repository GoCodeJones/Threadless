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
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h1 className="text-4xl font-bold mb-2">{about.project.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{about.project.tagline}</p>
            <p className="text-gray-700 mb-2">{about.project.description}</p>
            <p className="text-sm text-gray-500">Version: {about.project.version}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Core Principles</h2>
            <div className="space-y-4">
              {about.principles.map((principle: any, index: number) => (
                <div key={index} className="border-l-4 border-gray-900 pl-4">
                  <h3 className="font-semibold text-lg mb-1">{principle.title}</h3>
                  <p className="text-gray-600">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Features</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{about.features.trustSystem.name}</h3>
                <p className="text-gray-600 mb-3">{about.features.trustSystem.description}</p>
                <div className="space-y-1">
                  {about.features.trustSystem.badges.map((badge: string, index: number) => (
                    <p key={index} className="text-sm text-gray-700">{badge}</p>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{about.features.connections.name}</h3>
                <p className="text-gray-600">{about.features.connections.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{about.features.posts.name}</h3>
                <p className="text-gray-600">{about.features.posts.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{about.features.comments.name}</h3>
                <p className="text-gray-600">{about.features.comments.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Roadmap</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-700">Completed</h3>
                <ul className="space-y-2">
                  {about.roadmap.completed.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-700">Upcoming</h3>
                <ul className="space-y-2">
                  {about.roadmap.upcoming.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">How to Contribute</h2>
            <p className="text-gray-600 mb-6">{about.contribute.description}</p>
            <div className="space-y-4">
              {about.contribute.ways.map((way: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{way.type}</h3>
                  <p className="text-gray-600 text-sm">{way.description}</p>
                  {way.link && (
                    <a href={way.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      {way.link}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">{about.philosophy.title}</h2>
            <p className="text-gray-700 leading-relaxed">{about.philosophy.content}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <div className="space-y-2">
              <p className="text-gray-700">Creator: <span className="font-semibold">{about.contact.creator}</span></p>
              <p className="text-gray-700">
                GitHub: <a href={about.contact.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{about.contact.github}</a>
              </p>
              <p className="text-gray-700">Email: {about.contact.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}