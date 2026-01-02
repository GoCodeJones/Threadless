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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Threadless
            </Link>
            <span className="ml-3 text-sm text-gray-500">
              A quiet network of personal blogs
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/feed"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Feed
                </Link>
                <Link
                  href="/connections"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Connections
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Profile
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {user.username} {user.badgeEmoji}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-gray-900"
                >
                  About
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm border border-gray-900 hover:bg-gray-50 rounded"
                >
                  Register
                </Link>
                // Encontre a linha com os links quando o usuário está logado
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Profile
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-gray-900"
                >
                  About
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
