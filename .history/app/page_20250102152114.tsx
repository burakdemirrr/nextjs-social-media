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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4">
          {/* Left Sidebar */}
          {session && (
            <div className="hidden md:block md:col-span-1">
              <Sidebar />
            </div>
          )}

          {/* Main Content */}
          <div className={`md:col-span-${session ? '2' : '4'} space-y-4`}>
            {session ? (
              <CreateTweet />
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm text-center space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">Welcome to Social Media</h1>
                <p className="text-gray-600">
                  Join the conversation! Sign in to share your thoughts and connect with others.
                </p>
                <Link
                  href="/auth/signin"
                  className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
                >
                  Sign In
                </Link>
              </div>
            )}
            <Suspense fallback={<Loading />}>
              <TweetList />
            </Suspense>
          </div>

          {/* Right Sidebar - Trending/Suggestions */}
          {session && (
            <div className="hidden md:block md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="font-bold text-xl mb-4">Who to follow</h2>
                {/* Add suggested users here */}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
