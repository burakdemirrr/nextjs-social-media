'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Image, Smile, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CreateTweet() {
  const router = useRouter();
  const { data: session } = useSession();
  const [tweet, setTweet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: tweet,
          image: imagePreview 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create tweet');
      }

      setTweet('');
      setImagePreview(null);
      toast.success('Tweet posted successfully!');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-xl text-gray-400">
              {session?.user?.name?.[0] || '?'}
            </span>
          )}
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                className="w-full p-4 bg-gray-700 text-white rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-all placeholder-gray-400"
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
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {imagePreview && (
              <div className="relative mt-2 rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-64 rounded-lg object-contain bg-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1 bg-gray-900 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-blue-400 hover:bg-gray-700 rounded-full transition-colors"
                  disabled={isLoading}
                >
                  <Image className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  className="p-2 text-blue-400 hover:bg-gray-700 rounded-full transition-colors"
                  disabled={isLoading}
                >
                  <Smile className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${tweet.length > 250 ? 'text-red-400' : 'text-gray-400'}`}>
                  {tweet.length}/280
                </span>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
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