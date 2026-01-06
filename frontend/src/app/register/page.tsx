'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await register(username, password);
      setMasterPassword(result.masterPassword);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  if (masterPassword) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Account Created!</h1>
              <p className="text-gray-600">Save your master password securely</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-yellow-900 mb-2">Master Password</p>
              <code className="block bg-white px-4 py-3 rounded border border-yellow-300 text-center font-mono text-lg">
                {masterPassword}
              </code>
              <p className="text-xs text-yellow-800 mt-2">
                This password cannot be recovered. Save it in a secure location.
              </p>
            </div>

            <button
              onClick={() => router.push('/feed')}
              className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Continue to Threadless
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-2xl flex items-center justify-center shadow-lg shadow-[#238636]/20">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-[#30363d] rounded-xl shadow-2xl shadow-black/40 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#e6edf3] mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Join Threadless
              </h1>
              <p className="text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Create your account and start connecting
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-[#1c1917] border border-[#f85149] rounded-lg flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#f85149] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-[#f85149] text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {error}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#e6edf3] mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-lg focus:ring-2 focus:ring-[#238636] focus:border-transparent placeholder-[#7d8590] transition-all"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    placeholder="Choose a unique username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#e6edf3] mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-lg focus:ring-2 focus:ring-[#238636] focus:border-transparent placeholder-[#7d8590] transition-all"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    placeholder="Create a strong password"
                    required
                  />
                </div>
                <p className="text-xs text-[#7d8590] mt-2 flex items-center space-x-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Minimum 6 characters</span>
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#e6edf3] mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-lg focus:ring-2 focus:ring-[#238636] focus:border-transparent placeholder-[#7d8590] transition-all"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#238636] to-[#2ea043] text-white rounded-lg hover:from-[#2ea043] hover:to-[#3fb950] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#238636]/20 font-medium flex items-center justify-center space-x-2"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#30363d]">
              <p className="text-center text-sm text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Already have an account?{' '}
                <Link href="/login" className="text-[#58a6ff] font-medium hover:underline transition-colors">
                  Login here
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 bg-[#161b22] border border-[#30363d] rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-[#238636] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-sm text-[#e6edf3] font-medium mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Your data is protected
                </p>
                <p className="text-xs text-[#7d8590] leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  By creating an account, you agree to our Terms of Service and Privacy Policy. We'll never share your information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}