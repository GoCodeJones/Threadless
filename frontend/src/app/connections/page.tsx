'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { connectionService } from '@/services/api';
import { Connection } from '@/types';

export default function ConnectionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedKey, setGeneratedKey] = useState('');
  const [connectKey, setConnectKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadConnections();
    }
  }, [user]);

  const loadConnections = async () => {
    try {
      const data = await connectionService.getMyConnections();
      setConnections(data);
    } catch (error) {
      console.error('Failed to load connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    try {
      const data = await connectionService.generateKey();
      setGeneratedKey(data.connectionKey);
      setShowKeyModal(true);
    } catch (error) {
      console.error('Failed to generate key:', error);
      setError('Failed to generate connection key');
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await connectionService.connect(connectKey);
      setSuccess('Connected successfully!');
      setConnectKey('');
      loadConnections();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    setSuccess('Key copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
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
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#e6edf3] flex items-center space-x-3" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <svg className="w-8 h-8 text-[#238636]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Connections</span>
            </h1>
            <p className="text-[#7d8590] mt-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Build your trusted network through explicit connections
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Generate Key Card */}
            <div className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-[#30363d] rounded-xl p-6 shadow-lg shadow-black/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Generate Key
                </h2>
              </div>
              <p className="text-[#7d8590] mb-6 text-sm leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Generate a unique key to share with someone you want to connect with.
              </p>
              <button
                onClick={handleGenerateKey}
                className="w-full py-3 bg-gradient-to-r from-[#238636] to-[#2ea043] text-white rounded-lg hover:from-[#2ea043] hover:to-[#3fb950] transition-all shadow-lg shadow-[#238636]/20 font-medium"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Generate Connection Key
              </button>
            </div>

            {/* Connect with Key Card */}
            <div className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-[#30363d] rounded-xl p-6 shadow-lg shadow-black/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1f6feb] to-[#58a6ff] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Connect with Key
                </h2>
              </div>
              <p className="text-[#7d8590] mb-6 text-sm leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Enter a connection key someone shared with you to connect.
              </p>
              <form onSubmit={handleConnect} className="space-y-3">
                <input
                  type="text"
                  value={connectKey}
                  onChange={(e) => setConnectKey(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-lg focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent placeholder-[#7d8590] font-mono text-center tracking-wider"
                  style={{ fontFamily: 'Monaco, Consolas, monospace' }}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white rounded-lg hover:from-[#58a6ff] hover:to-[#79c0ff] transition-all shadow-lg shadow-[#1f6feb]/20 font-medium"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Establish Connection
                </button>
              </form>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#1c1917] border border-[#f85149] rounded-lg flex items-start space-x-3">
              <svg className="w-5 h-5 text-[#f85149] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-[#f85149] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-[#0d1b0d] border border-[#238636] rounded-lg flex items-start space-x-3">
              <svg className="w-5 h-5 text-[#238636] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[#3fb950] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{success}</span>
            </div>
          )}

          {/* Connections List */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#e6edf3] flex items-center space-x-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                <span>My Connections</span>
                <span className="text-sm font-normal text-[#7d8590]">({connections.length})</span>
              </h2>
            </div>
            {connections.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#21262d] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-[#7d8590] text-lg mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  No connections yet
                </p>
                <p className="text-[#7d8590] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Generate a key or use someone's key to connect!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {connections.map((connection) => (
                  <div key={connection.id} className="flex items-center justify-between p-4 bg-[#0d1117] border border-[#30363d] rounded-lg hover:border-[#388bfd] transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center text-sm font-bold text-white">
                        {connection.user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {connection.user.username}
                        </p>
                        <p className="text-sm text-[#7d8590] flex items-center space-x-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          <span>Trust Score:</span>
                          <span className="font-semibold text-[#3fb950]">{connection.user.trustScore}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(connection.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-[#30363d] rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Connection Key Generated!
              </h3>
            </div>
            <p className="text-[#7d8590] mb-6 text-sm leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Share this key with someone to connect. It expires in 24 hours.
            </p>
            <div className="bg-[#0d1117] border border-[#30363d] p-6 rounded-lg mb-6">
              <code className="text-2xl font-mono block text-center text-[#3fb950] tracking-wider" style={{ fontFamily: 'Monaco, Consolas, monospace' }}>
                {generatedKey}
              </code>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-3 bg-gradient-to-r from-[#238636] to-[#2ea043] text-white rounded-lg hover:from-[#2ea043] hover:to-[#3fb950] transition-all font-medium"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Copy Key
              </button>
              <button
                onClick={() => setShowKeyModal(false)}
                className="flex-1 py-3 border border-[#30363d] text-[#e6edf3] rounded-lg hover:bg-[#21262d] transition-colors font-medium"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}