'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  HomeIcon,
  UsersIcon,
  UserCircleIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { label: 'Clients', href: '/admin/client-monitoring', icon: UsersIcon },
  { label: 'Applicants', href: '/admin/applicant-monitoring', icon: UserCircleIcon },
  { label: 'Management', href: '/admin/management', icon: CogIcon },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col py-6 shrink-0">
      <div className="px-4 mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Admin Panel</p>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-savoy-blue font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
