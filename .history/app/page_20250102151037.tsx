import { Suspense } from 'react';
import TweetList from '@/components/TweetList';
import CreateTweet from '@/components/CreateTweet';
import Loading from '@/components/Loading';
import Navigation from '@/components/Navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Navigation />
      <main className="min-h-screen max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          {/* Left Sidebar */}
          <div className="hidden md:block">
            {/* Navigation will go here */}
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {session ? (
              <CreateTweet />
            ) : (
              <div className="bg-white p-4 rounded-lg shadow mb-6 text-center">
                <p className="text-gray-600 mb-4">
                  Sign in to share your thoughts!
                </p>
                <Link
                  href="/auth/signin"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
            <Suspense fallback={<Loading />}>
              <TweetList />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
