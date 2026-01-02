'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/feed');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Threadless</h1>
          <p className="text-xl text-gray-600 mb-8">A quiet network of personal blogs</p>
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Core Principles</h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="p-4 border border-gray-200 rounded">
                <h3 className="font-semibold mb-2">Ownership over reach</h3>
                <p className="text-sm text-gray-600">You own your content, connections, and identity</p>
              </div>
              <div className="p-4 border border-gray-200 rounded">
                <h3 className="font-semibold mb-2">Explicit trust over algorithms</h3>
                <p className="text-sm text-gray-600">Connections made through keys, not suggestions</p>
              </div>
              <div className="p-4 border border-gray-200 rounded">
                <h3 className="font-semibold mb-2">Simplicity over features</h3>
                <p className="text-sm text-gray-600">Clear and usable, no complexity</p>
              </div>
              <div className="p-4 border border-gray-200 rounded">
                <h3 className="font-semibold mb-2">Decentralization first</h3>
                <p className="text-sm text-gray-600">True independence requires effort</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <a href="/register" className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">Get Started</a>
            <a href="/about" className="px-8 py-3 border border-gray-900 rounded-lg hover:bg-gray-50 transition">Learn More</a>
          </div>
        </div>
      </main>
    </div>
  );
}