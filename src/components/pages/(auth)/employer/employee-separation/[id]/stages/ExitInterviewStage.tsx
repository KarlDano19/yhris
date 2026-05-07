'use client';

import React from 'react';

import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

type Props = {
  separation: any;
};

const ExitInterviewStage = ({ separation }: Props) => (
  <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center text-center gap-4'>
    <div className='w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center'>
      <ClipboardDocumentListIcon className='h-7 w-7 text-teal-600' />
    </div>
    <div>
      <h3 className='text-base font-semibold text-gray-900'>Exit Interview</h3>
      <p className='text-sm text-gray-400 mt-1'>This stage is coming soon. Exit interview content will be added here.</p>
    </div>
  </div>
);

export default ExitInterviewStage;
