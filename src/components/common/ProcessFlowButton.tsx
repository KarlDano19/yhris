'use client';

import { useState } from 'react';

import { RectangleGroupIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';

import ModalLayout from '@/components/ModalLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

const ProcessFlowButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const handleOpen = () => {
    setIsIframeLoading(true);
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className='relative flex items-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 p-2'
        data-tooltip-id='process-flow-button-tooltip'
        data-tooltip-content='View process flow documentation'
        data-tooltip-place='bottom'
      >
        <span className='sr-only'>View process flow documentation</span>
        <RectangleGroupIcon className='h-6 w-6 text-blue-800' aria-hidden='true' />
      </button>
      <Tooltip id='process-flow-button-tooltip' />

      <ModalLayout
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        title='Process Flow Documentation'
        maxWidth='max-w-6xl'
      >
        <div className='relative h-[80vh] w-full'>
          {isIframeLoading && (
            <div className='absolute inset-0 z-10 flex items-center justify-center bg-white'>
              <LoadingSpinner size='lg' color='yellow' showText text='Loading documentation...' />
            </div>
          )}
          <iframe
            src='/process-flows/index.html'
            title='YAHSHUA HRIS Process Flow'
            className='h-full w-full border-0'
            onLoad={() => setIsIframeLoading(false)}
          />
        </div>
      </ModalLayout>
    </>
  );
};

export default ProcessFlowButton;
