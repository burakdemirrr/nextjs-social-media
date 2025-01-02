'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import CreateTweet from '@/components/CreateTweet';
import TweetList from '@/components/TweetList';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const [key, setKey] = useState(0); // Used to force TweetList refresh

  const handleTweetCreated = () => {
    setKey(prev => prev + 1); // Force TweetList to remount and fetch new tweets
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {session && <Sidebar />}
        <main className={`flex-1 ${session ? 'max-w-2xl' : 'max-w-4xl'} mx-auto px-4 py-8`}>
          {session ? (
            <>
              <CreateTweet onTweetCreated={handleTweetCreated} />
              <TweetList key={key} />
            </>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to Social Media</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Join the conversation! Sign in to start tweeting and interacting with others.
              </p>
              <div className="space-x-4">
                <Link
                  href="/auth/signin"
                  className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-block bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
