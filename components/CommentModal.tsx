import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  tweet: {
    content: string;
    author: {
      name: string;
      image?: string | null;
    };
    createdAt: string;
  };
}

export default function CommentModal({ isOpen, onClose, onSubmit, tweet }: CommentModalProps) {
  const [content, setContent] = useState('');
  const { data: session } = useSession();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div 
        ref={modalRef}
        className="bg-gray-900 rounded-2xl w-full max-w-xl mx-4 shadow-xl transform transition-all animate-modal-enter"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                {tweet.author.image ? (
                  <Image
                    src={tweet.author.image}
                    alt={tweet.author.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xl text-white">
                      {tweet.author.name[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-0.5 flex-1 bg-gray-800 my-2"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">{tweet.author.name}</span>
              </div>
              <p className="text-white mt-1">{tweet.content}</p>
              <p className="text-gray-500 text-sm mt-2">
                Replying to <span className="text-blue-400">@{tweet.author.name}</span>
              </p>
            </div>
          </div>

          <div className="flex space-x-4 mt-4">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-xl text-white">
                    {session?.user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tweet your reply"
                className="w-full bg-transparent text-white placeholder-gray-500 text-xl p-2 focus:outline-none resize-none"
                rows={4}
                autoFocus
              />
              <div className="flex justify-between items-center mt-4 border-t border-gray-800 pt-4">
                <div className="text-sm text-gray-400">
                  {content.length}/280
                </div>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="bg-blue-500 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 