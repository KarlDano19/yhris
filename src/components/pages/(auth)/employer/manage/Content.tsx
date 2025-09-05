"use client";

import React from 'react';
import Link from 'next/link';
import AddressEmployeeIssueLogo from '@/svg/AddressEmployeeIssueLogo';

import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/solid';
import CreateMemoLogo from '@/svg/CreateMemoLogo';
import BenefitsLogo from '@/svg/BenefitsLogo';
import EmployeeLogo from '@/svg/EmployeeLogo';
import EvaluationHistoryLogo from '@/svg/EvalHistoryLogo';
import EmployeeMovementLogo from '@/svg/EmployeeMovementLogo';
import DocumentGeneratorLogo from '@/svg/DocumentGeneratorLogo';
import Employee201RecordsLogo from '@/svg/Employee201RecordsLogo';
import { useIncompleteEmployeeCount } from "./employee-201-records/hooks/useIncompleteEmployeeCount";

const menus = [
  {
    icon: <AddressEmployeeIssueLogo />,
    text: 'Address Employee Issue',
    link: '/manage/address-employee-issue',
  },
  {
    icon: <CreateMemoLogo />,
    text: 'Create Memo/Policy',
    link: '/manage/create-memo-policy',
  },
  {
    icon: <BenefitsLogo />,
    text: 'Design Benefits',
    link: '/manage/design-benefits',
  },
  {
    icon: <EmployeeLogo />,
    text: 'Employees',
    link: '/manage/employees',
  },
  {
    icon: <EvaluationHistoryLogo />,
    text: 'Evaluation History',
    link: '/manage/evaluation-history',
  },
  {
    icon: <EmployeeMovementLogo />,
    text: 'Employee Movement',
    link: '/manage/employee-movement',
  },
  {
    icon: <DocumentGeneratorLogo />,
    text: 'Document Generator',
    link: '/manage/document-generator',
  },
  {
    icon: <Employee201RecordsLogo />,
    text: 'Employee 201 Records',
    link: '/manage/employee-201-records',
  },
];

const Content = () => {
  const { count, isLoading } = useIncompleteEmployeeCount();

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Dashboard</h4>
        </Link>
      </div>
      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>Manage</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
          {menus.map((menu, i) => {
            const is201 = menu.link === "/manage/employee-201-records";
            const showBadge = is201 && (isLoading || count > 0);
            const badgeText = count > 99 ? "99+" : String(count);

            return (
              <Link
                href={menu.link}
                key={i}
                className="relative bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80"
              >
                {/* circular badge (inside tile, top-right) */}
                {showBadge && (
                  <span
                    className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-rose-500 text-white ring-2 ring-white shadow-sm sm:h-7 sm:w-7"
                    aria-live="polite"
                  >
                    {isLoading ? (
                      // spinner
                      <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    ) : (
                      <span className="text-[14px] font-bold leading-none sm:text-[13px]">{badgeText}</span>
                    )}
                    <span className="sr-only">
                      {isLoading ? "Loading incomplete count…" : `${badgeText} incomplete employee records`}
                    </span>
                  </span>
                )}

                {menu.icon}
                <h3 className="text-indigo-dye font-semibold text-center">{menu.text}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Content;
