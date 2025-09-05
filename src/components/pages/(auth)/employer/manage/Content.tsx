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

import TileBadge from "@/components/TileBadge"; // adjust path if your folder differs

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex p-4">
        <Link href="/dashboard" className="flex-none flex gap-3 items-center hover:bg-gray-200">
          <ArrowLeftIcon className="h-5 w-5" />
          <h4>Dashboard</h4>
        </Link>
      </div>
      <div className="px-2 md:px-8 lg:px-4">
        <h2 className="text-xl font-bold text-indigo-dye">Manage</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
          {menus.map((menu, i) => {
            const is201 = menu.link === "/manage/employee-201-records";
            const show = is201 && (isLoading || count > 0);

            return (
              <Link
                href={menu.link}
                key={i}
                className="relative bg-white shadow rounded-lg px-4 py-8 flex flex-col gap-2 items-center justify-center hover:shadow-md focus:shadow-none focus:opacity-80"
              >
                {/* badge */}
                <TileBadge show={show} isLoading={isLoading} count={count} />

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
