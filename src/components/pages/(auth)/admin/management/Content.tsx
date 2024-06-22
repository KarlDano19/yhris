'use client';

import React from 'react';

import Link from 'next/link';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import VoucherLogo from '@/svg/VoucherLogo';
import PlansLogo from '@/svg/PlansLogo';
import PrivilegeLogo from '@/svg/PrivilegeLogo';
import PaymentLogo from '@/svg/PaymentLogo';

const menus = [
  {
    icon: <VoucherLogo />,
    text: 'Vouchers',
    link: '/admin/management/voucher',
  },
  {
    icon: <PlansLogo />,
    text: 'Subscription Plans',
    link: '/admin/management',
  },
  {
    icon: <PrivilegeLogo />,
    text: 'Plan Privileges',
    link: '/admin/management',
  },
  {
    icon: <PaymentLogo />,
    text: 'Payment Channels',
    link: '/admin/management',
  },
];

const Content = () => {
  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link href='/admin/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Dashboard</h4>
          </Link>
        </div>
        <div className='px-2 md:px-8 lg:px-4'>
          <h2 className='text-xl font-bold text-indigo-dye'>Payment Management</h2>
          <div className='grid grid-cols-5 gap-6 mt-6'>
            {menus.map((menu, index) => {
              return (
                <Link
                  href={menu.link}
                  key={index}
                  className='bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80'
                >
                  {menu.icon}
                  <h3 className='text-indigo-dye font-semibold text-center'>{menu.text}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
