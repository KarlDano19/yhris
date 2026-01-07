import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip } from 'react-tooltip';

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
  disabled?: boolean;
  tooltip?: string;
}

const FloatingMenuBar = () => {
  const pathname = usePathname();
  
  // Determine if we're in business mode
  const isBusinessMode = pathname?.includes('business-mode');

  // Personal Mode Menu Items
  const personalMenuItems: MenuItem[] = [
    {
      name: 'Home',
      href: '/personal-mode',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: 'Jobs',
      href: '/personal-mode/jobs',
      icon: BriefcaseIcon,
      iconSolid: BriefcaseIconSolid,
    },
    {
      name: 'Trainings',
      href: '/personal-mode/trainings',
      icon: AcademicCapIcon,
      iconSolid: AcademicCapIconSolid,
      disabled: true,
      tooltip: 'Coming soon',
    },
    {
      name: 'Transactions',
      href: '/personal-mode/transactions',
      icon: DocumentTextIcon,
      iconSolid: DocumentTextIconSolid,
      disabled: true,
      tooltip: 'Coming soon',
    },
  ];

  // Business Mode Menu Items
  const businessMenuItems: MenuItem[] = [
    {
      name: 'Home',
      href: '/business-mode',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: 'Find Work',
      href: '/business-mode/find-work',
      icon: MagnifyingGlassIcon,
      iconSolid: MagnifyingGlassIconSolid,
    },
    {
      name: 'Hire',
      href: '/business-mode/hire',
      icon: UserPlusIcon,
      iconSolid: UserPlusIconSolid,
    },
    {
      name: 'My Jobs',
      href: '/business-mode/my-jobs',
      icon: BriefcaseIcon,
      iconSolid: BriefcaseIconSolid,
    },
    {
      name: 'Earnings',
      href: '/business-mode/earnings',
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
                isActive = pathname?.endsWith('/business-mode') || pathname === '/personal-mode/business-mode';
              } else if (routeSegment) {
                // For other routes, check if pathname includes the route segment
                isActive = pathname?.includes(`/business-mode/${routeSegment}`) || pathname?.endsWith(`/${routeSegment}`);
              }
            }
            
            const Icon = isActive ? item.iconSolid : item.icon;

            const linkContent = (
              <>
                <Icon className="h-5 w-5 mb-0.5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </>
            );

            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  data-tooltip-id="floating-menu-tooltip"
                  data-tooltip-content={item.tooltip || ''}
                  data-tooltip-place="top"
                  className={classNames(
                    'flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition-all opacity-50 cursor-not-allowed',
                    'text-gray-400'
                  )}
                >
                  {linkContent}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                data-tooltip-id="floating-menu-tooltip"
                data-tooltip-content={item.tooltip || ''}
                data-tooltip-place="top"
                className={classNames(
                  'flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition-all',
                  isActive
                    ? 'bg-savoy-blue/10 text-savoy-blue'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                )}
              >
                {linkContent}
              </Link>
            );
          })}
        </nav>
      </div>
      <Tooltip id="floating-menu-tooltip" />
    </div>
  );
};

export default FloatingMenuBar;

