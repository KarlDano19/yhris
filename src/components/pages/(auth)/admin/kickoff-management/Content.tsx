'use client';

import Link from 'next/link';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import AccountBalanceLogo from '@/svg/AccountBalanceLogo';
import PersonSearchLogo from '@/svg/PersonSearchLogo';

const menus = [
  {
    icon: <PersonSearchLogo />,
    text: 'Partners',
    link: '/admin/kickoff-management/partners',
  },
  {
    icon: <AccountBalanceLogo />,
    text: 'Prospect Clients',
    link: '/admin/kickoff-management/prospective-clients',
  },
];

const Content = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
      <div className="flex p-4">
        <Link href="/admin/dashboard" className="flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded">
          <ArrowLeftIcon className="h-5 w-5" />
          <h4>Dashboard</h4>
        </Link>
      </div>
      <div className="p-2 md:p-8 lg:p-4 relative">
        <h2 className="text-xl font-bold text-indigo-dye">Kickoff Management</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6 relative">
          {menus.map((menu, index) => (
            <Link
              href={menu.link}
              key={index}
              className="bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80"
            >
              {menu.icon}
              <h3 className="text-indigo-dye font-semibold text-center">{menu.text}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;
