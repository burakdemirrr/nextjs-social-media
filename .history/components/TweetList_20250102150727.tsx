import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';

async function getTweets() {
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
      {tweets.map((tweet) => (
        <div key={tweet.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {tweet.author.image ? (
                <img
                  src={tweet.author.image}
                  alt={tweet.author.name || 'User'}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <span className="text-xl text-gray-500">
                  {tweet.author.name?.[0] || '?'}
                </span>
              )}
            </div>
            <div className="ml-3">
              <p className="font-semibold">{tweet.author.name}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(tweet.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <p className="text-gray-800 mb-3">{tweet.content}</p>
          <div className="flex items-center text-gray-500">
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{tweet.likes.length}</span>
            </button>
          </div>
        </div>
      ))}
      {tweets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tweets yet. Be the first to tweet!
        </div>
      )}
    </div>
  );
} 