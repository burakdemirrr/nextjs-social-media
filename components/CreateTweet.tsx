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

    if (!content.trim()) {
      toast.error('Tweet cannot be empty');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'ml_default'); // Replace with your Cloudinary upload preset

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/your-cloud-name/image/upload`, // Replace with your Cloudinary cloud name
          {
            method: 'POST',
            body: formData,
          }
        );

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || 'Failed to upload image');
        
        imageUrl = uploadData.secure_url;
      }

      const res = await fetch('/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          image: imageUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to create tweet');

      setContent('');
      setImage(null);
      setImagePreview(null);
      toast.success('Tweet posted!');
      
      // Call the callback to refresh the tweet list
      if (onTweetCreated) {
        onTweetCreated();
      }
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
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="flex space-x-4">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User'}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xl text-white">
              {session.user.name?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            maxLength={280}
            disabled={isLoading}
          />
          {imagePreview && (
            <div className="relative mt-2">
              <Image
                src={imagePreview}
                alt="Tweet image preview"
                width={300}
                height={200}
                className="rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mt-3">
            <label className="cursor-pointer text-blue-400 hover:text-blue-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isLoading}
              />
            </label>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm">
                {content.length}/280
              </span>
              <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-150 hover:scale-105 active:scale-95"
              >
                {isLoading ? 'Posting...' : 'Tweet'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
} 