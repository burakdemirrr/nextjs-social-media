'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Tweet, User } from '@/types';
import Loading from '@/components/Loading';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import CreateTweet from '@/components/CreateTweet';
import CommentModal from '@/components/CommentModal';
import LikesModal from '@/components/LikesModal';

export default function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
  const [selectedTweetForLikes, setSelectedTweetForLikes] = useState<Tweet | null>(null);

  const fetchTweets = async () => {
    try {
      const [userRes, tweetsRes] = await Promise.all([
        fetch(`/api/users/${userId}`),
        fetch(`/api/users/${userId}/tweets`)
      ]);

      if (!userRes.ok || !tweetsRes.ok) {
        throw new Error('Failed to fetch user data');
      }

      const [userData, tweetsData] = await Promise.all([
        userRes.json(),
        tweetsRes.json()
      ]);

      setUser(userData);
      setTweets(tweetsData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [userId]);

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
      
      fetchTweets();
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const isLiked = (tweet: Tweet) => {
    return tweet.likes?.some(like => like.userId === session?.user?.id);
  };

  if (isLoading) return <Loading />;
  if (!user) return <div className="text-red-500 text-center p-4">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex max-w-7xl mx-auto">
        <div className="w-[300px] flex-shrink-0 sticky top-0 h-screen">
          <Sidebar />
        </div>
        <main className="flex-1 min-w-[600px] border-x border-gray-800 min-h-screen bg-gray-900">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
            <div className="flex items-center h-[53px] px-4">
              <div className="flex items-center flex-1 gap-8">
                <Link href="/" className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-white leading-6">{user.name}</h1>
                  <p className="text-sm text-gray-500 leading-5">{tweets.length} Tweets</p>
                </div>
              </div>
            </div>
            <nav className="flex px-4 pt-2">
              <button className="px-6 py-4 text-white font-medium hover:bg-gray-800/40 transition-colors relative group">
                Tweets
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></div>
              </button>
            </nav>
          </div>

          {/* Profile Header */}
          <div>
            <div className="h-52 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="px-6">
              <div className="relative -mt-20 mb-4">
                <div className="absolute left-2">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={150}
                      height={150}
                      className="rounded-full border-4 border-gray-900"
                    />
                  ) : (
                    <div className="w-[150px] h-[150px] bg-gray-800 rounded-full border-4 border-gray-900 flex items-center justify-center">
                      <span className="text-6xl text-white">
                        {user.name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                {session?.user?.id === userId && (
                  <div className="flex justify-end pt-3">
                    <Link
                      href="/settings"
                      className="px-5 py-2.5 rounded-full border border-gray-600 text-white hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      Edit profile
                    </Link>
                  </div>
                )}
              </div>

              <div className="pt-20 pb-4">
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
                <div className="flex items-center space-x-6 mt-4 text-gray-400">
                  <div>
                    <span className="font-bold text-white">{tweets.length}</span>{' '}
                    <span>Tweets</span>
                  </div>
                  <div>
                    <span className="font-bold text-white">0</span>{' '}
                    <span>Following</span>
                  </div>
                  <div>
                    <span className="font-bold text-white">0</span>{' '}
                    <span>Followers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Tweet (only on own profile) */}
          {session?.user?.id === userId && (
            <div className="border-y border-gray-800 px-6 py-4">
              <CreateTweet onTweetCreated={fetchTweets} />
            </div>
          )}

          {/* Tweets */}
          <div className="divide-y divide-gray-800">
            {tweets.map((tweet) => (
              <div key={tweet.id} className="p-6 hover:bg-gray-800/50 transition-colors">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || 'User'}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xl text-white">
                          {user.name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-medium truncate">{user.name}</p>
                      <span className="text-gray-400 text-sm">
                        {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-white mt-2 text-[15px]">{tweet.content}</p>
                    {tweet.image && (
                      <div className="mt-3 rounded-xl overflow-hidden">
                        <Image
                          src={tweet.image}
                          alt="Tweet image"
                          width={550}
                          height={300}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-8 mt-4 text-gray-400">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (!session?.user) {
                            toast.error('Please sign in to like tweets');
                            return;
                          }
                          if (tweet.likes?.length > 0 && e.detail === 2) {
                            // Double click to show likes
                            setSelectedTweetForLikes(tweet);
                          } else {
                            // Single click to like/unlike
                            handleLike(tweet.id);
                          }
                        }}
                        className="flex items-center space-x-2 group"
                      >
                        <div className={`p-2 rounded-full ${
                          isLiked(tweet) 
                            ? 'text-pink-600' 
                            : 'group-hover:bg-pink-500/10 group-hover:text-pink-500'
                        } transition-colors`}>
                          <svg 
                            className="w-5 h-5" 
                            fill={isLiked(tweet) ? "currentColor" : "none"} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                            />
                          </svg>
                        </div>
                        <span 
                          className={`${isLiked(tweet) ? "text-pink-600" : ""} cursor-pointer hover:underline`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (tweet.likes?.length > 0) {
                              setSelectedTweetForLikes(tweet);
                            }
                          }}
                        >
                          {tweet.likes?.length || 0}
                        </span>
                      </button>
                      <button
                        onClick={() => setSelectedTweet(tweet)}
                        className="flex items-center space-x-2 group"
                      >
                        <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span>{tweet.comments?.length || 0}</span>
                      </button>
                    </div>
                    {tweet.comments && tweet.comments.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {tweet.comments.map((comment) => (
                          <div key={comment.id} className="bg-gray-800 rounded-lg p-3">
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
                                <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                                  <span className="text-sm text-white">
                                    {comment.author.name?.[0]?.toUpperCase() || '?'}
                                  </span>
                                </div>
                              )}
                              <span className="font-medium text-white">{comment.author.name}</span>
                            </div>
                            <p className="text-gray-300 mt-1 ml-8">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
        <div className="w-[300px] flex-shrink-0">
          {/* Right sidebar space if needed */}
        </div>
      </div>

      {selectedTweetForLikes && (
        <LikesModal
          isOpen={!!selectedTweetForLikes}
          onClose={() => setSelectedTweetForLikes(null)}
          likes={selectedTweetForLikes.likes.map(like => ({
            user: {
              id: like.userId,
              name: like.user?.name || '',
              image: like.user?.image,
            }
          }))}
        />
      )}

      {selectedTweet && (
        <CommentModal
          isOpen={!!selectedTweet}
          onClose={() => setSelectedTweet(null)}
          onSubmit={(content) => handleComment(selectedTweet.id, content)}
          tweet={{
            content: selectedTweet.content,
            author: {
              name: selectedTweet.author?.name || '',
              image: selectedTweet.author?.image,
            },
            createdAt: selectedTweet.createdAt,
          }}
        />
      )}
    </div>
  );
} 