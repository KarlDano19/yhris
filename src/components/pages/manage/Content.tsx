import React from 'react';
import Link from 'next/link';
import AddressEmployeeIssueLogo from '@/svg/AddressEmployeeIssueLogo';
import CreateMemoLogo from '@/svg/CreateMemoLogo';
import BenefitsLogo from '@/svg/BenefitsLogo';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const menus = [
  {
    icon: <AddressEmployeeIssueLogo />,
    text: "Address Employee Issue",
    link: "/manage/address-employee-issue"
  },
  {
    icon: <CreateMemoLogo />,
    text: "Create Memo/Policy",
    link: "/manage/create-memo-policy"
  },
  {
    icon: <BenefitsLogo />,
    text: "Design Benefits",
    link: "/manage/design-benefits"
  },
];

const Content = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex p-4">
        <Link href="/" className="flex-none flex gap-3 items-center hover:bg-gray-200">
          <ArrowLeftIcon className="h-5 w-5" />
          <h4>Home</h4>
        </Link>
      </div>
      <div className="px-2 md:px-8 lg:px-4">
        <h2 className="text-xl font-bold text-indigo-dye">Manage</h2>
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