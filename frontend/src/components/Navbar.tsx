"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-[#010409] border-b border-[#30363d] backdrop-blur-sm bg-opacity-95 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#e6edf3] tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Threadless
              </span>
            </Link>
            <span className="hidden md:block text-sm text-[#7d8590] border-l border-[#30363d] pl-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              A quiet network of personal blogs
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {user ? (
              <>
                <Link 
                  href="/feed" 
                  className="px-4 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-lg transition-colors font-medium"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Feed
                </Link>
                <Link 
                  href="/connections" 
                  className="px-4 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-lg transition-colors font-medium"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Connections
                </Link>
                <Link 
                  href="/profile" 
                  className="px-4 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-lg transition-colors font-medium"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Profile
                </Link>
                {user.isAdmin && (
                  <Link 
                    href="/admin" 
                    className="px-4 py-2 text-sm text-[#f85149] hover:bg-[#21262d] rounded-lg transition-colors font-semibold"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  href="/about" 
                  className="px-4 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-lg transition-colors font-medium"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  About
                </Link>
                
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-[#30363d]">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#161b22] rounded-lg border border-[#30363d]">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center text-xs font-bold text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-[#e6edf3] font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d] rounded-lg transition-colors border border-[#30363d] font-medium"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/about" 
                  className="px-4 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-lg transition-colors font-medium"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  About
                </Link>
                <Link 
                  href="/login" 
                  className="px-5 py-2 text-sm bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d] rounded-lg transition-colors border border-[#30363d] font-medium ml-2"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2 text-sm bg-gradient-to-r from-[#238636] to-[#2ea043] text-white hover:from-[#2ea043] hover:to-[#3fb950] rounded-lg transition-all shadow-lg shadow-[#238636]/20 font-medium"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}