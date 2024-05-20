import React from 'react';
import Link from 'next/link';

import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/solid';
import EnvelopeIcon from '@/svg/EnvelopeIcon';
import EmployeeIdLogo from '@/svg/EmployeeIdLogo';
import HiringLogo from '@/svg/HiringLogo';

const menus = [
  {
    icon: <HiringLogo />,
    text: "Hiring",
    link: "/settings/general-settings/"
  },
  {
    icon: <EmployeeIdLogo />,
    text: "Employees",
    link: "/settings/general-settings/"
  },
  {
    icon: <EnvelopeIcon />,
    text: "Email Template",
    link: "/settings/general-settings/email-template"
  },
];

const Content = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex p-4">
        <Link href="/settings" className="flex-none flex gap-3 items-center hover:bg-gray-200">
          <ArrowLeftIcon className="h-5 w-5" />
          <h4 className='font-semibold text-xl'>Settings | General Settings</h4>
        </Link>
      </div>
      <div className="px-2 md:px-8 lg:px-4">
        <div className="grid grid-cols-5 gap-6 mt-6">
          {menus.map((menu, index) => {
            return (
              <Link href={menu.link} key={index} className="bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80">
                {menu.icon}
                <h3 className="text-indigo-dye font-semibold text-center">{menu.text}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Content