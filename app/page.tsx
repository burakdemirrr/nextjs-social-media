import { Suspense } from 'react';
import TweetList from '@/components/TweetList';
import CreateTweet from '@/components/CreateTweet';
import Loading from '@/components/Loading';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Left Sidebar */}
          {session && <Sidebar />}

          {/* Main Content */}
          <div className={`flex-1 ${session ? 'ml-64' : ''} px-4`}>
            <div className="max-w-2xl mx-auto py-6 space-y-6">
              {session ? (
                <CreateTweet />
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center space-y-4 border border-gray-700">
                  <h1 className="text-3xl font-bold text-white">Welcome to Social Media</h1>
                  <p className="text-gray-300 text-lg">
                    Join the conversation! Sign in to share your thoughts and connect with others.
                  </p>
                  <div className="flex justify-center space-x-4 pt-4">
                    <Link
                      href="/auth/signin"
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
              <Suspense fallback={<Loading />}>
                <TweetList />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
