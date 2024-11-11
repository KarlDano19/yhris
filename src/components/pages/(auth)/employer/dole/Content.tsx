'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import MenuItem from '../../MenuItem';
import EstablishmentRegistrationConfirmationModal from './modals/EstablishmentRegistrationConfirmationModal';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import EmployeeCompensitionLogbookLogo from '@/svg/EmployeeCompensitionLogbookLogo';
import EstablishmentRegistrationLogo from '@/svg/EstablishmentRegistrationLogo';
import WorkAccidentIllnessReportLogo from '@/svg/WorkAccidentIllnessReportLogo';
import WemLogo from '@/svg/WemLogo';

function Content() {
  const [isEstablishmentRegistrationConfirmationModalOpen, setIsEstablishmentRegistrationConfirmationModalOpen] =
    useState(false);
  const menus = [
    {
      icon: <EmployeeCompensitionLogbookLogo />,
      text: 'Employee Compensation Logbook',
      link: '/dole/employee-compensation-logbook',
      isAvailable: true,
    },
    {
      icon: <EstablishmentRegistrationLogo />,
      text: 'Establishment Registration',
      isAvailable: true,
      onClickEvent: () => {
        setIsEstablishmentRegistrationConfirmationModalOpen(true);
      },
    },
    {
      icon: <WorkAccidentIllnessReportLogo />,
      text: 'Work Accident/Illness Report',
      link: '/dole/work-accident-illness-report',
      isAvailable: true,
    },
    {
      icon: <WemLogo />,
      text: 'Work Environment Measurement Request',
      link: '/dole/work-environment-measurement-request',
      isAvailable: true,
    },
  ];
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Dashboard</h4>
        </Link>
      </div>
      <div className='px-2 md:px-8 lg:px-4'>
        <h2 className='text-xl font-bold text-indigo-dye'>DOLE</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6'>
          {menus.map((menu, index) => {
            return <MenuItem key={index} menu={menu} />;
          })}
        </div>
      </div>
      <EstablishmentRegistrationConfirmationModal
        isOpen={isEstablishmentRegistrationConfirmationModalOpen}
        setIsOpen={setIsEstablishmentRegistrationConfirmationModalOpen}
      />
    </div>
  );
}

export default Content;
