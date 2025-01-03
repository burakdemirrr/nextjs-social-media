'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface CreateTweetProps {
  onTweetCreated?: () => void;
}

export default function CreateTweet({ onTweetCreated }: CreateTweetProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error('Please sign in to tweet');
      return;
    }

    if (!content.trim() && !image) {
      toast.error('Tweet cannot be empty');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = null;

      if (image) {
        const formData = new FormData();
        formData.append('file', image);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const res = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          image: imageUrl,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create tweet');
      }

      setContent('');
      setImage(null);
      setImagePreview(null);
      toast.success('Tweet posted!');
      onTweetCreated?.();
    } catch (error) {
      console.error('Error creating tweet:', error);
      toast.error('Failed to post tweet');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="border-b border-gray-800 px-4 py-6 hover:bg-gray-900/50 transition-colors">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-xl text-white">
                  {session.user.name?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full bg-transparent text-xl text-white placeholder-gray-500 resize-none focus:outline-none min-h-[120px]"
              disabled={isLoading}
            />
            {imagePreview && (
              <div className="relative mt-2 group">
                <div className="relative rounded-2xl overflow-hidden bg-gray-800">
                  <Image
                    src={imagePreview}
                    alt="Tweet image"
                    width={500}
                    height={300}
                    className="object-cover max-h-[300px] w-full"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors group-hover:opacity-100 opacity-0"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center -ml-2">
                <label className="p-2 rounded-full hover:bg-blue-500/10 cursor-pointer transition-colors">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                </label>
                <span className="text-sm text-gray-500 ml-4">
                  {content.length}/280
                </span>
              </div>
              <button
                type="submit"
                disabled={isLoading || (!content.trim() && !image)}
                className="bg-blue-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? 'Posting...' : 'Tweet'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 