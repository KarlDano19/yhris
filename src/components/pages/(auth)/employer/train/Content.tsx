'use client';

import React from 'react';

import Link from 'next/link';

import MenuItem from '../../MenuItem';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Training from '@/svg/TrainingsLogo';
import Evaluation from '@/svg/EvaluationLogo';
import EvaluationScheduler from '@/svg/EvaluationSchedulerLogo';

const menus = [
  {
    icon: <Training />,
    text: 'Training',
    link: '/train/training',
    isAvailable: false,
  },
  {
    icon: <Evaluation />,
    text: 'Evaluation Template',
    link: '/train/evaluation-template',
    isAvailable: true,
  },
  {
    icon: <EvaluationScheduler />,
    text: 'Evaluation Scheduler',
    link: '/train/evaluation-scheduler',
    isAvailable: true,
  },
];

const Content = () => {
  return (
    <>
      <div className='min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex p-4'>
            <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
              <ArrowLeftIcon className='h-5 w-5' />
              <h4>Dashboard</h4>
            </Link>
          </div>
          <div className='px-2 md:px-8 lg:px-4'>
            <h2 className='text-xl font-bold text-indigo-dye'>Train</h2>
            <div className='grid grid-cols-5 gap-6 mt-6'>
              {menus.map((menu, index) => {
                return <MenuItem key={index} menu={menu} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
