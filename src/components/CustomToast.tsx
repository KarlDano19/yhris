import React, { useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import classNames from '@/helpers/classNames';

import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  HandRaisedIcon,
} from '@heroicons/react/20/solid';

const CustomToast = ({ 
  message, 
  type, 
  duration = 4000 
}: { 
  message: string; 
  type: 'success' | 'error' | 'info' | 'warning'; 
  onClose?: () => void;
  duration?: number;
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const newProgress = Math.max(0, 100 - (elapsed / duration) * 100);
      
      setProgress(newProgress);
      
      // Only close when the full duration has passed
      if (elapsed >= duration) {
        clearInterval(interval);
        toast.remove();
      }
    }, 50); // Fixed 50ms interval for smooth animation
    
    return () => {
      clearInterval(interval);
    };
  }, [duration]);

  const renderIcon = () => {
    const className = 'h-9 w-9 text-white';
    if (type === 'success') {
      return <CheckCircleIcon className={className} aria-hidden='true' />;
    } else if (type === 'error') {
      return <XCircleIcon className={className} aria-hidden='true' />;
    } else if (type === 'info') {
      return <InformationCircleIcon className={className} aria-hidden='true' />;
    } else if (type === 'warning') {
      return <HandRaisedIcon className={className} aria-hidden='true' />;
    }
  };

  return (
    <div
      className={classNames(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-sm bg-green-500 shadow-lg ring-1 ring-black ring-opacity-5',
        type === 'success' ? 'bg-green-500' : '',
        type === 'error' ? 'bg-red-500' : '',
        type === 'info' ? 'bg-blue-500' : '',
        type === 'warning' ? 'bg-orange-500' : ''
      )}
    >
      <div className='px-4 py-3'>
        <div className='flex items-center'>
          {/* NOTE: Removed icon to be similar to the YP design */}
          {/* <div className='flex-shrink-0'>{renderIcon()}</div> */}
          <div className='ml-3 w-0 flex-1'>
            <p className='mt-1 text-sm text-white'>{message}</p>
          </div>
          <div className='ml-4 flex flex-shrink-0'>
            <button
              type='button'
              className='inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white'
              onClick={() => toast.remove()}
            >
              <span className='sr-only'>Close</span>
              <XMarkIcon className='h-7 w-7 text-white' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
      {/* Loading bar */}
      <div className='h-1 bg-black bg-opacity-30'>
        <div 
          className={classNames(
            'h-full transition-all duration-75 ease-out',
            type === 'success' ? 'bg-green-200' : '',
            type === 'error' ? 'bg-red-200' : '',
            type === 'info' ? 'bg-blue-200' : '',
            type === 'warning' ? 'bg-orange-200' : ''
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default CustomToast;
