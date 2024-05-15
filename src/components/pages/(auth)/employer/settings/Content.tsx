import React from 'react';
import Link from 'next/link';
import AddressEmployeeIssueLogo from '@/svg/AddressEmployeeIssueLogo';

import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/solid';
import CreateMemoLogo from '@/svg/CreateMemoLogo';
import BenefitsLogo from '@/svg/BenefitsLogo';
import EmployeeLogo from '@/svg/EmployeeLogo';

const menus = [
  {
    icon: <AddressEmployeeIssueLogo />,
    text: "Company Settings",
    link: "/settings/company-settings"
  },
  {
    icon: <CreateMemoLogo />,
    text: "General Settings",
    link: "/settings/general-settings"
  },
  {
    icon: <BenefitsLogo />,
    text: "Users",
    link: "/settings/users"
  },
];

const Content = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex p-4">
        <Link href="/dashboard" className="flex-none flex gap-3 items-center hover:bg-gray-200">
          <ArrowLeftIcon className="h-5 w-5" />
          <h4>Settings</h4>
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