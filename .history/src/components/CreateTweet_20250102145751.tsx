import { useState } from 'react';

export default function CreateTweet() {
  const [tweet, setTweet] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement tweet creation
    console.log('New tweet:', tweet);
    setTweet('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="What's happening?"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            disabled={!tweet.trim()}
          >
            Tweet
          </button>
        </div>
      </form>
    </div>
  );
} 