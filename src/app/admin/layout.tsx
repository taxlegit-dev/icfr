'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/sidebar/Sidebar';
import { useCurrentRole } from '@/components/hooks/auth/useCurrentRole';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const role = useCurrentRole(); // 👈 get role from hook

  // Hide sidebar only on login page
  const hideSidebar = pathname === '/admin/login';

  return (
    <div className="flex h-screen">
      {/* Conditionally render sidebar */}
      {!hideSidebar && role && <Sidebar role={role} />}

      {/* Main content */}
      <main
        className={`flex-1 bg-gray-50 p-6 overflow-y-auto ${
          hideSidebar ? 'w-full' : ''
        }`}
      >
        {children}
      </main>
    </div>
  );
}
