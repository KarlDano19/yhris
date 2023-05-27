import { ArrowsRightLeftIcon, Cog6ToothIcon, InformationCircleIcon, LightBulbIcon, MagnifyingGlassIcon, PlusCircleIcon, PresentationChartLineIcon, UserGroupIcon, UsersIcon, WalletIcon } from '@heroicons/react/24/outline'
import React from 'react';
import Link from 'next/link';

const menus = [
  {
    icon: <PlusCircleIcon className="h-20 w-20 text-savoy-blue" />,
    text: "Post a Job",
    link: "/post-job"
  },
  {
    icon: <MagnifyingGlassIcon className="h-20 w-20 text-savoy-blue" />,
    text: "Screen Applicants",
    link: "/screen-applicants"
  },
  {
    icon: <UsersIcon className="h-20 w-20 text-savoy-blue" />,
    text: "Orient",
    link: "/hired-applicants"
  },
  {
    icon: <UserGroupIcon className="h-20 w-20 text-savoy-blue" />,
    text: "Manage",
    link: "/manage"
  },
  {
    icon: <PresentationChartLineIcon className="h-20 w-20 text-savoy-blue" />,
    text: "Train",
    link: "/train"
  },
  {
    icon: <WalletIcon className="h-20 w-20 text-savoy-blue" />,
    text: "Payroll",
    link: "/payroll"
  },
  {
    icon: <ArrowsRightLeftIcon className="h-20 w-20 text-savoy-blue" />,
    text: "Employee Separation",
    link: "/employee-separation"
  },
  {
    icon: <LightBulbIcon className="h-20 w-20 text-savoy-blue" />,
    text: "Branding Kit",
    link: "/branding-kit"
  },
  {
    icon: <InformationCircleIcon className="h-20 w-20 text-savoy-blue" />,
    text: "Get Help",
    link: "/get-help"
  },
  {
    icon: <Cog6ToothIcon className="h-20 w-20 text-savoy-blue" />,
    text: "Settings",
    link: "/settings"
  },
];

const Home = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="p-2 md:p-8 lg:p-4">
        <h2 className="text-xl font-bold text-indigo-dye">Dashboard</h2>
        <div className="grid grid-cols-5 gap-6 mt-6">
          {menus.map((menu, index) => {
            return (
              <Link href={menu.link} key={index} className="bg-white shadow rounded-lg px-4 py-8 flex flex-col items-center hover:shadow-md focus:shadow-none focus:opacity-80">
                {menu.icon}
                <h3 className="text-indigo-dye font-semibold">{menu.text}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Home