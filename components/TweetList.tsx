import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import { Tweet } from '@/types';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

async function getTweets(): Promise<Tweet[]> {
  const tweets = await prisma.tweet.findMany({
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      likes: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return tweets;
}

export default async function TweetList() {
  const tweets = await getTweets();

  return (
    <div className="space-y-4">
      {tweets.map((tweet: Tweet) => (
        <div
          key={tweet.id}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {tweet.author.image ? (
                <img
                  src={tweet.author.image}
                  alt={tweet.author.name || 'User'}
                  className="h-12 w-12 object-cover"
                />
              ) : (
                <span className="text-xl text-gray-500">
                  {tweet.author.name?.[0] || '?'}
                </span>
              )}
            </div>
            <div className="ml-4">
              <p className="font-semibold text-gray-900">{tweet.author.name}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(tweet.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <p className="text-gray-800 mb-4 text-lg">{tweet.content}</p>
          <div className="flex items-center space-x-6 text-gray-500">
            <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group">
              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>0</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-pink-500 transition-colors group">
              <Heart className={`h-5 w-5 group-hover:scale-110 transition-transform ${tweet.likes.length > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
              <span>{tweet.likes.length}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500 transition-colors group">
              <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      ))}
      {tweets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">
            No tweets yet. Be the first to tweet!
          </p>
        </div>
      )}
    </div>
  );
} 