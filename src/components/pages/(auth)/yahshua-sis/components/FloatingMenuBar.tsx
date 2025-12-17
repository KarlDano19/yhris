import Link from 'next/link';
import { usePathname } from 'next/navigation';

import classNames from '@/helpers/classNames';

import {
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
} from '@heroicons/react/24/solid';

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  iconSolid: any;
}

const FloatingMenuBar = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      href: '/yahshua-sis/personal-mode',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: 'Profile',
      href: '/yahshua-sis/profile',
      icon: UserIcon,
      iconSolid: UserIconSolid,
    },
    {
      name: 'Jobs',
      href: '/yahshua-sis/jobs',
      icon: BriefcaseIcon,
      iconSolid: BriefcaseIconSolid,
    },
    {
      name: 'Trainings',
      href: '/yahshua-sis/trainings',
      icon: AcademicCapIcon,
      iconSolid: AcademicCapIconSolid,
    },
    {
      name: 'Transactions',
      href: '/yahshua-sis/transactions',
      icon: DocumentTextIcon,
      iconSolid: DocumentTextIconSolid,
    },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2">
        <nav className="flex items-center gap-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = isActive ? item.iconSolid : item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  'flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition-all',
                  isActive
                    ? 'text-savoy-blue'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="h-5 w-5 mb-0.5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default FloatingMenuBar;

