'use client';

import { formatDistanceToNow } from 'date-fns';
import { Tweet } from '@/types';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function TweetList() {
  const { data: session } = useSession();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const res = await fetch('/api/tweets');
      if (!res.ok) throw new Error('Failed to fetch tweets');
      const data = await res.json();
      setTweets(data);
    } catch (error) {
      toast.error('Failed to load tweets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (tweetId: string) => {
    if (!session) {
      toast.error('Please sign in to like tweets');
      return;
    }

    setIsLiking(prev => ({ ...prev, [tweetId]: true }));

    try {
      const res = await fetch(`/api/tweets/${tweetId}/like`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to like tweet');
      
      const currentTweet = tweets.find(t => t.id === tweetId);
      const hasLiked = currentTweet?.likes.some(like => like.userId === session.user.id);

      // Update local state
      setTweets(prev => 
        prev.map(tweet => {
          if (tweet.id === tweetId) {
            return {
              ...tweet,
              likes: hasLiked 
                ? tweet.likes.filter(like => like.userId !== session.user.id)
                : [...tweet.likes, { id: Date.now().toString(), userId: session.user.id, tweetId, createdAt: new Date() }],
            };
          }
          return tweet;
        })
      );

      toast.success(hasLiked ? 'Tweet unliked' : 'Tweet liked');
    } catch (error) {
      toast.error('Failed to like tweet');
    } finally {
      setIsLiking(prev => ({ ...prev, [tweetId]: false }));
    }
  };

  const handleComment = async (tweetId: string) => {
    if (!session) {
      toast.error('Please sign in to comment');
      return;
    }

    const comment = commentText[tweetId]?.trim();
    if (!comment) return;

    try {
      const res = await fetch(`/api/tweets/${tweetId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!res.ok) throw new Error('Failed to post comment');

      const newComment = await res.json();

      // Update local state
      setTweets(prev =>
        prev.map(tweet => {
          if (tweet.id === tweetId) {
            return {
              ...tweet,
              comments: [...tweet.comments, newComment],
            };
          }
          return tweet;
        })
      );

      setCommentText(prev => ({ ...prev, [tweetId]: '' }));
      toast.success('Comment posted');
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-xl shadow-lg">
        <p className="text-gray-400 text-lg">Loading tweets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tweets.map((tweet: Tweet) => (
        <div
          key={tweet.id}
          className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out"
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              {tweet.author.image ? (
                <img
                  src={tweet.author.image}
                  alt={tweet.author.name || 'User'}
                  className="h-12 w-12 object-cover"
                />
              ) : (
                <span className="text-xl text-gray-400">
                  {tweet.author.name?.[0] || '?'}
                </span>
              )}
            </div>
            <div className="ml-4">
              <p className="font-semibold text-white">{tweet.author.name}</p>
              <p className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(tweet.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <p className="text-gray-100 mb-4 text-lg">{tweet.content}</p>
          {tweet.image && (
            <div className="mb-4 rounded-xl overflow-hidden">
              <img 
                src={tweet.image} 
                alt="Tweet image" 
                className="max-h-96 object-contain w-full bg-gray-700"
              />
            </div>
          )}
          <div className="flex items-center space-x-6 text-gray-400">
            <button 
              className="flex items-center space-x-2 hover:text-blue-400 transition-colors group"
              onClick={() => setShowComments(prev => ({ ...prev, [tweet.id]: !prev[tweet.id] }))}
            >
              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>{tweet.comments.length}</span>
            </button>
            <button 
              className={`flex items-center space-x-2 ${
                tweet.likes.some(like => like.userId === session?.user?.id)
                  ? 'text-pink-500'
                  : 'hover:text-pink-500'
              } transition-colors group`}
              onClick={() => handleLike(tweet.id)}
              disabled={isLiking[tweet.id]}
            >
              <Heart 
                className={`h-5 w-5 group-hover:scale-110 transition-transform ${
                  tweet.likes.some(like => like.userId === session?.user?.id) ? 'fill-pink-500' : ''
                }`} 
              />
              <span>{tweet.likes.length}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-400 transition-colors group">
              <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {showComments[tweet.id] && (
            <div className="mt-4 space-y-4">
              <div className="border-t border-gray-700 pt-4">
                {session && (
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={commentText[tweet.id] || ''}
                      onChange={e => setCommentText(prev => ({ ...prev, [tweet.id]: e.target.value }))}
                    />
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => handleComment(tweet.id)}
                    >
                      Reply
                    </button>
                  </div>
                )}
                {tweet.comments.map(comment => (
                  <div key={comment.id} className="flex space-x-2 p-2 rounded-lg bg-gray-700">
                    <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                      {comment.author.image ? (
                        <img
                          src={comment.author.image}
                          alt={comment.author.name || 'User'}
                          className="h-8 w-8 object-cover"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">
                          {comment.author.name?.[0] || '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{comment.author.name}</p>
                      <p className="text-gray-300">{comment.content}</p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      {tweets.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-xl shadow-lg">
          <p className="text-gray-400 text-lg">
            No tweets yet. Be the first to tweet!
          </p>
        </div>
      )}
    </div>
  );
} 