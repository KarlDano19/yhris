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
      </div>
      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>Client Onboarding</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8'>
          {menus.map((menu, index) => (
            <Link
              href={menu.link}
              key={index}
              className='bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80'
            >
              {menu.icon}
              <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;
