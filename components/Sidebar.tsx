'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Home, User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const { data: session } = useSession();

  const menuItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
    },
    {
      icon: User,
      label: 'Profile',
      href: `/profile/${session?.user?.id}`,
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 p-4">
      <div className="pt-16 space-y-6">
        {/* User Profile Section */}
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800">
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
          <div>
            <p className="font-semibold text-white">{session?.user?.name}</p>
            <p className="text-sm text-gray-400">{session?.user?.email}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
            >
              <item.icon className="h-6 w-6 text-gray-400 group-hover:text-blue-400" />
              <span className="text-gray-300 group-hover:text-blue-400">
                {item.label}
              </span>
            </Link>
          ))}

          <button
            onClick={() => signOut()}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900/20 transition-colors group"
          >
            <LogOut className="h-6 w-6 text-gray-400 group-hover:text-red-400" />
            <span className="text-gray-300 group-hover:text-red-400">
              Sign Out
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
} 