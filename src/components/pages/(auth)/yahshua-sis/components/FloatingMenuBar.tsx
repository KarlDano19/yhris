import Link from 'next/link';
import { usePathname } from 'next/navigation';

import classNames from '@/helpers/classNames';

import {
  HomeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  UserPlusIcon as UserPlusIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
} from '@heroicons/react/24/solid';

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  iconSolid: any;
}

const FloatingMenuBar = () => {
  const pathname = usePathname();
  
  // Determine if we're in business mode
  const isBusinessMode = pathname?.includes('business-mode');

  // Personal Mode Menu Items
  const personalMenuItems: MenuItem[] = [
    {
      name: 'Home',
      href: '/yahshua-sis/personal-mode',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: 'Jobs',
      href: '/yahshua-sis/personal-mode/jobs',
      icon: BriefcaseIcon,
      iconSolid: BriefcaseIconSolid,
    },
    {
      name: 'Trainings',
      href: '/yahshua-sis/personal-mode/trainings',
      icon: AcademicCapIcon,
      iconSolid: AcademicCapIconSolid,
    },
    {
      name: 'Transactions',
      href: '/yahshua-sis/personal-mode/transactions',
      icon: DocumentTextIcon,
      iconSolid: DocumentTextIconSolid,
    },
  ];

  // Business Mode Menu Items
  const businessMenuItems: MenuItem[] = [
    {
      name: 'Home',
      href: '/yahshua-sis/business-mode',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: 'Find Work',
      href: '/yahshua-sis/business-mode/find-work',
      icon: MagnifyingGlassIcon,
      iconSolid: MagnifyingGlassIconSolid,
    },
    {
      name: 'Hire',
      href: '/yahshua-sis/business-mode/hire',
      icon: UserPlusIcon,
      iconSolid: UserPlusIconSolid,
    },
    {
      name: 'My Jobs',
      href: '/yahshua-sis/business-mode/my-jobs',
      icon: BriefcaseIcon,
      iconSolid: BriefcaseIconSolid,
    },
    {
      name: 'Earnings',
      href: '/yahshua-sis/business-mode/earnings',
      icon: CurrencyDollarIcon,
      iconSolid: CurrencyDollarIconSolid,
    },
  ];

  const menuItems = isBusinessMode ? businessMenuItems : personalMenuItems;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2">
        <nav className="flex items-center gap-1">
          {menuItems.map((item, index) => {
            // Check if current path matches the href exactly
            let isActive = pathname === item.href;
            
            // For business mode, also check if pathname includes the route segment
            if (isBusinessMode && !isActive) {
              const routeSegment = item.href.split('/').pop();
              if (routeSegment === 'business-mode') {
                // For home, check if pathname ends with business-mode
                isActive = pathname?.endsWith('/business-mode') || pathname === '/yahshua-sis/business-mode';
              } else if (routeSegment) {
                // For other routes, check if pathname includes the route segment
                isActive = pathname?.includes(`/business-mode/${routeSegment}`) || pathname?.endsWith(`/${routeSegment}`);
              }
            }
            
            const Icon = isActive ? item.iconSolid : item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  'flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition-all',
                  isActive
                    ? 'bg-savoy-blue/10 text-savoy-blue'
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

