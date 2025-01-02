'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Home, User, Bell, LogOut } from 'lucide-react';
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
    {
      icon: Bell,
      label: 'Notifications',
      href: '/notifications',
    },
  ];

  return (
    <div className="sticky top-20">
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <span className="text-xl text-gray-500">
                {session?.user?.name?.[0] || '?'}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold">{session?.user?.name}</p>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <item.icon className="h-6 w-6 text-gray-500 group-hover:text-blue-500" />
              <span className="text-gray-700 group-hover:text-blue-500">
                {item.label}
              </span>
            </Link>
          ))}

          <button
            onClick={() => signOut()}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors group w-full"
          >
            <LogOut className="h-6 w-6 text-gray-500 group-hover:text-red-500" />
            <span className="text-gray-700 group-hover:text-red-500">
              Sign Out
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
} 