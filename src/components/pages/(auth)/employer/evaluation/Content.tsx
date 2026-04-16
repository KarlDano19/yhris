'use client';

import React from 'react';

import MenuItem from '../../MenuItem';
import BackButton from '@/components/BackButton';
// import Training from '@/svg/TrainingsLogo';
import EvaluationTemplateLogo from '@/svg/EvaluationTemplateLogo';
import EvaluationScheduler from '@/svg/EvaluationSchedulerLogo';
import EvaluationHistory from '@/svg/EvalHistoryLogo';

const menus = [
  // {
  //   icon: <Training />,
  //   text: 'Training',
  //   link: '/training',
  //   isAvailable: false,
  // },
  {
    icon: <EvaluationTemplateLogo />,
    text: 'Evaluation Template',
    link: '/evaluation/evaluation-template',
    isAvailable: true,
  },
  {
    icon: <EvaluationScheduler />,
    text: 'Evaluation Scheduler',
    link: '/evaluation/evaluation-scheduler',
    isAvailable: true,
  },
  {
    icon: <EvaluationHistory />,
    text: 'Evaluation History',
    link: '/evaluation/evaluation-history',
    isAvailable: true,
  },
];

const Content = () => {
  return (
    <>
      <div className='min-h-screen'>
        <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
          <div className='flex p-4'>
            <BackButton label="Dashboard" />
          </div>
          <div className='px-2 md:px-8 lg:px-4'>
            <h2 className='text-xl font-bold text-indigo-dye'>Evaluation</h2>
            <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6'>
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
