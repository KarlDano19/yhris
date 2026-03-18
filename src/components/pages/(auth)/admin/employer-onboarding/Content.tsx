'use client';

import Link from 'next/link';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import AddChecklistLogo from '@/svg/AddChecklistLogo';
import OnboardingTrackerLogo from '@/svg/OnboardingTrackerLogo';

const menus = [
  {
    icon: <AddChecklistLogo />,
    text: 'Add Checklist',
    link: '/admin/employer-onboarding/add-checklist',
  },
  {
    icon: <OnboardingTrackerLogo />,
    text: 'Onboarding Tracker',
    link: '/admin/employer-onboarding/onboarding-tracker',
  },
];

const Content = () => {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <Link
          href='/admin/dashboard'
          className='flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded'
        >
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Dashboard</h4>
        </Link>
      </div>
      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>Client Onboarding</h2>
        <p className='text-sm text-gray-500 mt-1'>HRIS Onboarding Management</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
          {menus.map((menu, index) => (
            <Link
              href={menu.link}
              key={index}
              className='bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80'
            >
              {menu.icon}
              <h3 className='text-indigo-dye font-semibold text-lg'>{menu.text}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;
