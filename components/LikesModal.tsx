import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  likes: {
    user: {
      id: string;
      name: string;
      image?: string | null;
    };
  }[];
}

export default function LikesModal({ isOpen, onClose, likes }: LikesModalProps) {
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div 
        ref={modalRef}
        className="bg-gray-900 rounded-2xl w-full max-w-md mx-4 shadow-xl transform transition-all animate-modal-enter"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Liked by</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {likes.map((like) => (
            <Link
              key={like.user.id}
              href={`/profile/${like.user.id}`}
              className="flex items-center space-x-3 p-4 hover:bg-gray-800/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                {like.user.image ? (
                  <Image
                    src={like.user.image}
                    alt={like.user.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xl text-white">
                      {like.user.name[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{like.user.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 