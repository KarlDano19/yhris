'use client';

import { useState } from 'react';

import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children, initialTokenExpiresAt }: { children: React.ReactNode; initialTokenExpiresAt?: number }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Mobile backdrop — closes sidebar when tapped */}
      {isSidebarOpen && (
        <div
          className='md:hidden fixed inset-0 z-40 bg-black/40'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always fixed (out of flow) on mobile, flex column on desktop */}
      <div className='fixed top-0 left-0 h-full z-50 md:relative md:z-auto md:h-auto md:flex md:flex-col md:shrink-0'>
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Right column — header + page content stacked vertically */}
      <div className='flex flex-col flex-1 min-w-0'>
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
          isSidebarOpen={isSidebarOpen}
          initialTokenExpiresAt={initialTokenExpiresAt}
        />
        <main className='flex-1 overflow-auto'>{children}</main>
      </div>
    </div>
  );
}
