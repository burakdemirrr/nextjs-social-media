'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Tweet } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function TweetList() {
  const { data: session } = useSession();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTweets = async () => {
    try {
      const res = await fetch('/api/tweets');
      if (!res.ok) throw new Error('Failed to fetch tweets');
      const data = await res.json();
      setTweets(data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
      toast.error('Failed to load tweets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleLike = async (tweetId: string) => {
    if (!session?.user) {
      toast.error('Please sign in to like tweets');
      return;
    }

    try {
      const res = await fetch(`/api/tweets/${tweetId}/like`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to like tweet');
      
      // Refresh tweets to show updated likes
      fetchTweets();
      toast.success('Tweet liked!');
    } catch (error) {
      console.error('Error liking tweet:', error);
      toast.error('Failed to like tweet');
    }
  };

  const handleComment = async (tweetId: string, content: string) => {
    if (!session?.user) {
      toast.error('Please sign in to comment');
      return;
    }

    try {
      const res = await fetch(`/api/tweets/${tweetId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error('Failed to add comment');
      
      // Refresh tweets to show new comment
      fetchTweets();
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <div key={tweet.id} className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Link href={`/profile/${tweet.author.id}`}>
              {tweet.author.image ? (
                <Image
                  src={tweet.author.image}
                  alt={tweet.author.name || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xl text-white">
                    {tweet.author.name?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </Link>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Link href={`/profile/${tweet.author.id}`} className="font-semibold text-white hover:underline">
                  {tweet.author.name}
                </Link>
                <span className="text-gray-400 text-sm">
                  {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-white mt-1">{tweet.content}</p>
              {tweet.image && (
                <div className="mt-2">
                  <Image
                    src={tweet.image}
                    alt="Tweet image"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
              )}
              <div className="flex items-center space-x-4 mt-3">
                <button
                  onClick={() => handleLike(tweet.id)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{tweet.likes?.length || 0}</span>
                </button>
                <button
                  onClick={() => {
                    const content = prompt('Enter your comment:');
                    if (content) handleComment(tweet.id, content);
                  }}
                  className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{tweet.comments?.length || 0}</span>
                </button>
              </div>
              {tweet.comments && tweet.comments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {tweet.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-700 p-3 rounded">
                      <div className="flex items-center space-x-2">
                        {comment.author.image ? (
                          <Image
                            src={comment.author.image}
                            alt={comment.author.name || 'User'}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-sm text-white">
                              {comment.author.name?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-white">{comment.author.name}</span>
                      </div>
                      <p className="text-gray-300 mt-1">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Export for use in other components
export { TweetList }; 