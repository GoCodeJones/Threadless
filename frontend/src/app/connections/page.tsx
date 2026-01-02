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
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Connections</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Generate Connection Key</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Generate a unique key to share with someone you want to connect with.
              </p>
              <button
                onClick={handleGenerateKey}
                className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Generate Key
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Connect with Key</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Enter a connection key someone shared with you to connect.
              </p>
              <form onSubmit={handleConnect}>
                <input
                  type="text"
                  value={connectKey}
                  onChange={(e) => setConnectKey(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-gray-900"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Connect
                </button>
              </form>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">My Connections ({connections.length})</h2>
            {connections.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No connections yet. Generate a key or use someone's key to connect!
              </p>
            ) : (
              <div className="space-y-3">
                {connections.map((connection) => (
                  <div key={connection.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold">{connection.user.username}</p>
                      <p className="text-sm text-gray-600">Trust Score: {connection.user.trustScore}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(connection.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Connection Key Generated!</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Share this key with someone to connect. It expires in 24 hours.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <code className="text-lg font-mono block text-center">{generatedKey}</code>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Copy Key
              </button>
              <button
                onClick={() => setShowKeyModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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