'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex max-w-7xl mx-auto">
        <div className="w-[300px] flex-shrink-0 sticky top-0 h-screen">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-[600px] border-x border-gray-800 min-h-screen">
          <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-3">
            <h1 className="text-xl font-bold text-white">Edit Profile</h1>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-150"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </main>
        <div className="w-[300px] flex-shrink-0">
          {/* Right sidebar space if needed */}
        </div>
      </div>
    </div>
  );
} 