// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  role?: 'admin' | 'user';
}

export default function Sidebar({ role = 'user' }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: role === 'admin' ? '/admin/dashboard' : '/user/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Users',
      href: role === 'admin' ? '/admin/users' : '/user/users',
      icon: Users,
    },
  ];

  const bottomMenuItems = [
    {
      name: 'Profile',
      href: role === 'admin' ? '/admin/profile' : '/user/profile',
      icon: UserCircle,
    },
    {
      name: 'Logout',
      href: '/logout',
      icon: LogOut,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="flex flex-col h-screen w-64 bg-gray-900 text-white">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">
          {role === 'admin' ? 'Admin Panel' : 'User Panel'}
        </h1>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}