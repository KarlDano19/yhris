'use client';

import { useState } from 'react';

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import SyncingIcon from '@/svg/SyncingIcon';

const FloatingProgress = () => {
  const [isProgressShow, setShowProgress] = useState(false);

  return (
    <div className='fixed z-50 bottom-11 right-11 cursor-pointer' onClick={() => setShowProgress(!isProgressShow)}>
      <div
        className={`${
          !isProgressShow ? 'flex' : 'hidden'
        } static bg-[#2c3e56fb] w-16 h-16 justify-center items-center rounded-full`}
      >
        <SyncingIcon />
        <span className='flex absolute top-0 right-12 bg-gradient-to-r from-[#65C979] to-[#0EAE2E] w-7 h-7 text-white font-bold text-[9px] rounded-full px-[4px] py-[4px] border-white border-4'>
          5%
        </span>
        <div className='absolute text-gray-600 mt-24 text-sm'>Syncing...</div>
      </div>

      <div className={`${isProgressShow ? 'flex' : 'hidden'} static py-3`}>
        <div className='mb-4 bottom-16 right-11 bg-white border-t-[1px] px-6 py-8 border-t-gray-300 drop-shadow-lg shadow-lg  w-80 h-96 absolute rounded-3xl'>
          <h2 className='h2 font-bold'>Hey, The ABBA Initiative! &#128075;</h2>
          <p className='text-sm mt-1'>{"Here's the status of your employee information sync with YAHSHUA Payroll:"}</p>
          <div className='w-72 h-[250px] overflow-hidden hover:overflow-auto pr-[17px] hover:pr-0'>
            <div className='mt-3'>
              <div className='flex justify-between'>
                <p className='text-sm mt-3'>Profile</p>
                <div className='bg-gradient-to-r from-[#65C979] to-[#0EAE2E] w-6 h-6 px-1 py-1 mx-2 text-white font-bold text-[12px] rounded-full justify-center items-center my-3'>
                  5%
                </div>
              </div>
              <div className='flex justify-between'>
                <p className='text-sm mt-3'>Employee ID</p>
                <div className='bg-gradient-to-r from-[#65C979] to-[#0EAE2E] w-6 h-6 px-1 py-1 mx-2 text-white font-bold text-[12px] rounded-full justify-center items-center my-3'>
                  5%
                </div>
              </div>
              <div className='flex justify-between'>
                <p className='text-sm mt-3'>Location</p>
                <div className='bg-gradient-to-r from-[#65C979] to-[#0EAE2E] w-6 h-6 px-1 py-1 mx-2 text-white font-bold text-[12px] rounded-full justify-center items-center my-3'>
                  5%
                </div>
              </div>
              <div className='flex justify-between'>
                <p className='text-sm mt-3'>Department & Position</p>
                <div className='bg-gradient-to-r from-[#65C979] to-[#0EAE2E] w-6 h-6 px-1 py-1 mx-2 text-white font-bold text-[12px] rounded-full justify-center items-center my-3'>
                  5%
                </div>
              </div>
              <div className='flex justify-between'>
                <p className='text-sm mt-3'>Employment Type</p>
                <div className='bg-gradient-to-r from-[#65C979] to-[#0EAE2E] w-6 h-6 px-1 py-1 mx-2 text-white font-bold text-[12px] rounded-full justify-center items-center my-3'>
                  5%
                </div>
              </div>
              <div className='flex justify-between'>
                <p className='text-sm mt-3'>Department & Position</p>
                <div className='bg-gradient-to-r from-[#65C979] to-[#0EAE2E] w-6 h-6 px-1 py-1 mx-2 text-white font-bold text-[12px] rounded-full justify-center items-center my-3'>
                  5%
                </div>
              </div>
              <div className='flex justify-between'>
                <p className='text-sm mt-3'>Department & Position</p>
                <div className='bg-gradient-to-r from-[#65C979] to-[#0EAE2E] w-6 h-6 px-1 py-1 mx-2 text-white font-bold text-[12px] rounded-full justify-center items-center my-3'>
                  5%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`flex bottom-0 right-0 absolute text-white bg-[#2c3e56fb] w-16 h-16 items-center rounded-full`}>
          <XMarkIcon className='w-[50px] h-[50px] m-auto' />
        </div>
      </div>
    </div>
  );
};
export default FloatingProgress;
