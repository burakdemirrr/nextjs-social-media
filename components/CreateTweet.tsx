'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Image, Smile, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CreateTweet() {
  const router = useRouter();
  const { data: session } = useSession();
  const [tweet, setTweet] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: tweet }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create tweet');
      }

      setTweet('');
      toast.success('Tweet posted successfully!');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <span className="text-xl text-gray-500">
              {session?.user?.name?.[0] || '?'}
            </span>
          )}
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                className="w-full p-4 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                rows={3}
                placeholder="What's happening?"
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                disabled={isLoading}
              />
              {tweet && (
                <button
                  type="button"
                  onClick={() => setTweet('')}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                  disabled={isLoading}
                >
                  <Image className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                  disabled={isLoading}
                >
                  <Smile className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${tweet.length > 250 ? 'text-red-500' : 'text-gray-500'}`}>
                  {tweet.length}/280
                </span>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  disabled={!tweet.trim() || isLoading || tweet.length > 280}
                >
                  {isLoading ? 'Posting...' : 'Tweet'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 