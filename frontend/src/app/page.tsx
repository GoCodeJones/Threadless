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
    <div className="bg-[#0d1117]">
      <Navbar />
      <main className="min-h-screen bg-[#0d1117]">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-[#e6edf3] mb-4">Threadless</h1>
          <p className="text-xl text-[#7d8590] mb-8">A quiet network of personal blogs</p>
          <div className="bg-[#161b22] rounded-lg border border-[#30363d] p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#e6edf3]">Core Principles</h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="p-4 border border-[#30363d] rounded bg-[#0d1117]">
                <h3 className="font-semibold mb-2 text-[#e6edf3]">Ownership over reach</h3>
                <p className="text-sm text-[#7d8590]">You own your content, connections, and identity</p>
              </div>
              <div className="p-4 border border-[#30363d] rounded bg-[#0d1117]">
                <h3 className="font-semibold mb-2 text-[#e6edf3]">Explicit trust over algorithms</h3>
                <p className="text-sm text-[#7d8590]">Connections made through keys, not suggestions</p>
              </div>
              <div className="p-4 border border-[#30363d] rounded bg-[#0d1117]">
                <h3 className="font-semibold mb-2 text-[#e6edf3]">Simplicity over features</h3>
                <p className="text-sm text-[#7d8590]">Clear and usable, no complexity</p>
              </div>
              <div className="p-4 border border-[#30363d] rounded bg-[#0d1117]">
                <h3 className="font-semibold mb-2 text-[#e6edf3]">Decentralization first</h3>
                <p className="text-sm text-[#7d8590]">True independence requires effort</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <a href="/register" className="px-8 py-3 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition">Get Started</a>
            <a href="/about" className="px-8 py-3 border border-[#30363d] text-[#e6edf3] rounded-lg hover:bg-[#161b22] transition">Learn More</a>
          </div>
        </div>
      </main>
    </div>
  );
}