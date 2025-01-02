interface Tweet {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
}

const dummyTweets: Tweet[] = [
  {
    id: '1',
    content: 'Just set up my Next.js social media app! 🚀',
    author: 'John Doe',
    timestamp: '2 minutes ago',
    likes: 5,
  },
  {
    id: '2',
    content: 'Learning TypeScript and Tailwind CSS is awesome! 💻',
    author: 'Jane Smith',
    timestamp: '5 minutes ago',
    likes: 10,
  },
];

export default function TweetList() {
  return (
    <div className="space-y-4">
      {dummyTweets.map((tweet) => (
        <div key={tweet.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="ml-3">
              <p className="font-semibold">{tweet.author}</p>
              <p className="text-sm text-gray-500">{tweet.timestamp}</p>
            </div>
          </div>
          <p className="text-gray-800 mb-3">{tweet.content}</p>
          <div className="flex items-center text-gray-500">
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{tweet.likes}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 