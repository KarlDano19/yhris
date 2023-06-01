import { ArrowsRightLeftIcon, Cog6ToothIcon, InformationCircleIcon, LightBulbIcon, MagnifyingGlassIcon, PlusCircleIcon, PresentationChartLineIcon, UserGroupIcon, UsersIcon, WalletIcon } from '@heroicons/react/24/outline'
import React from 'react';
import Link from 'next/link';
import AddPostLogo from '@/svg/AddPostLogo';
import ScreenApplicantsLogo from '@/svg/ScreenApplicantsLogo';
import OrientLogo from '@/svg/OrientLogo';
import ManageLogo from '@/svg/ManageLogo';
import TrainLogo from '@/svg/TrainLogo';
import PayrollLogo from '@/svg/PayrollLogo';
import EmployeeSeparationLogo from '@/svg/EmployeeSeparationLogo';
import GetHelpLogo from '@/svg/GetHelpLogo';
import SettingsLogo from '@/svg/SettingsLogo';
import EmployeeKitLogo from '@/svg/EmployeeKitLogo';

const menus = [
  {
    icon: <AddPostLogo/>,
    text: "Post a Job",
    link: "/post-job"
  },
  {
    icon: <ScreenApplicantsLogo/>,
    text: "Screen Applicants",
    link: "/screen-applicants"
  },
  {
    icon: <OrientLogo/>,
    text: "Orient",
    link: "/orient"
  },
  {
    icon: <ManageLogo/>,
    text: "Manage",
    link: "/manage"
  },
  {
    icon: <TrainLogo/>,
    text: "Train",
    link: "/train"
  },
  {
    icon: <PayrollLogo/>,
    text: "Payroll",
    link: "/payroll"
  },
  {
    icon: <EmployeeSeparationLogo/>,
    text: "Employee Separation",
    link: "/employee-separation"
  },
  {
    icon: <EmployeeKitLogo/>,
    text: "Employee Kit",
    link: "/branding-kit"
  },
  {
    icon: <GetHelpLogo/>,
    text: "Get Help",
    link: "/get-help"
  },
  {
    icon: <SettingsLogo/>,
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

export default Home