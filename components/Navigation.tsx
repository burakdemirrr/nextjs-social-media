'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            Social Media
          </Link>

          {!session && (
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 