import { Suspense } from 'react';
import TweetList from '@/components/TweetList';
import CreateTweet from '@/components/CreateTweet';
import Loading from '@/components/Loading';

export default function Home() {
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        {/* Left Sidebar */}
        <div className="hidden md:block">
          {/* Navigation will go here */}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <CreateTweet />
          <Suspense fallback={<Loading />}>
            <TweetList />
          </Suspense>
        </div>
      </div>
    </main>
  );
} 