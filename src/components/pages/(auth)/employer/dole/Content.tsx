'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

import MenuItem from '../../MenuItem';
import EstablishmentRegistrationConfirmationModal from './modals/EstablishmentRegistrationConfirmationModal';
import SafetyAndHealthPolicyModal from './safety-and-health-policy/modals/SafetyAndHealthPolicyModal';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import EmployeeCompensitionLogbookLogo from '@/svg/EmployeeCompensitionLogbookLogo';
import EstablishmentRegistrationLogo from '@/svg/EstablishmentRegistrationLogo';
import WorkAccidentIllnessReportLogo from '@/svg/WorkAccidentIllnessReportLogo';
import SafetyAndHealthLogo from '@/svg/SafetyAndHealthLogo'
import AnnualWAIR from '@/svg/AnnualWAIR';
import WemLogo from '@/svg/WemLogo';
import HealthAndSafetyReportLogo from '@/svg/HealthAndSafetyReportLogo';
import ShcMeetingOfMinutesLogo from '@/svg/ShcMeetingOfMinutesLogo';
import AnnualMedicalReportLogo from '@/svg/AnnualMedicalReportLogo';
import OSHProgramLogo from '@/svg/OSHProgramLogo';

interface CachedProfileData {
  name: string;
  type_of_industry: string;
}

function Content() {
  const [isEstablishmentRegistrationConfirmationModalOpen, setIsEstablishmentRegistrationConfirmationModalOpen] =
    useState(false);
    
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']) as { state: { data: CachedProfileData } | undefined };
  const [isSafetyAndHealthPolicyModalOpen, setIsSafetyAndHealthPolicyModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const cachedRigths = queryClient.getQueryCache().find(['userRightsCache']) as { state: { data: any } | undefined };

  useEffect(() => {
    if (cachedProfile?.state?.data) {
      setCompanyName(cachedProfile.state.data.name);
    }
  }, [cachedProfile]);
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
    {
      icon: <SafetyAndHealthLogo />,
      text: 'Safety and Health Policy',
      isAvailable: true,
      onClickEvent: () => {
        setIsSafetyAndHealthPolicyModalOpen(true);
      },
    },
    {
      icon: <AnnualWAIR />,
      text: 'Annual Work Accident/Illness Exposure Data Report',
      link: '/dole/annual-work-accident-illness-exposure-data-report',
      isAvailable: true,
    },
    {
      icon: <HealthAndSafetyReportLogo />,
      text: 'Health And Safety Organization Report',
      link: '/dole/health-and-safety-organization-report',
      isAvailable: true,
    },
    {
      icon: <ShcMeetingOfMinutesLogo />,
      text: 'SHC Minutes of Meetings',
      link: '/dole/shc-minutes-of-meetings',
      isAvailable: true,
    },
    {
      icon: <AnnualMedicalReportLogo />,
      text: 'Annual Medical Report',
      link: '/dole/annual-medical-report',
      isAvailable: true,
    },
    {
      icon: <OSHProgramLogo />,
      text: 'OSH Program',
      link: '/dole/osh-program',
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
      <SafetyAndHealthPolicyModal
        isOpen={isSafetyAndHealthPolicyModalOpen}
        setIsOpen={setIsSafetyAndHealthPolicyModalOpen}
        companyName={companyName}
      />
    </div>
  );
}

export default Content;
