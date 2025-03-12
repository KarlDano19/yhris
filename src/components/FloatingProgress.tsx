'use client';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useSyncEmployees from './hooks/useSyncEmployees';

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import SyncingIcon from '@/svg/SyncingIcon';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';

const FloatingProgress = () => {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']) as { state: { data: any } | undefined };
  const [isProgressShow, setShowProgress] = useState(false);
  const { mutate: syncEmployees, isLoading: isSyncingEmployees } = useSyncEmployees();

  const handleSyncEmployees = () => {
    const callBackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    syncEmployees(void 0, callBackReq);
  };

  return (
    <div className='fixed z-50 bottom-4 left-6' onClick={() => setShowProgress(!isProgressShow)}>
      <div
        className={`${
          !isProgressShow ? 'flex' : 'hidden'
        } static bg-[#2c3e56fb] w-16 h-16 justify-center items-center rounded-full`}
      >
        <SyncingIcon />
        {/* <span className='flex absolute top-0 right-12 bg-gradient-to-r from-[#65C979] to-[#0EAE2E] w-7 h-7 text-white font-bold text-[9px] rounded-full px-[4px] py-[4px] border-white border-4'>
          0%
        </span> */}
      </div>

      <div className={`${isProgressShow ? 'flex' : 'hidden'} static py-3`}>
        <div className='mb-4 bottom-16 left-0 bg-white border-t-[1px] px-6 py-8 border-t-gray-300 drop-shadow-lg shadow-lg  w-80 h-96 absolute rounded-3xl'>
          <h2 className='h2 font-bold'>Hey, {cachedProfile?.state?.data?.name}! &#128075;</h2>
          <p className='text-sm mt-1'>{"You can sync your data from YAHSHUA Payroll here."}</p>
          <div className='w-72 h-[250px] overflow-hidden pr-[17px]'>
            <div className='mt-3'>
              {/* <div className='flex justify-between'>
                <p className='text-sm mt-3'>Profile</p>
                <div className='flex justify-center items-center gap-2'>
                  <div className='bg-gradient-to-r from-[#65C979] to-[#0EAE2E] w-6 h-6 px-1 py-1 mx-2 text-white font-bold text-[12px] rounded-full justify-center items-center my-3'>
                    0%
                  </div>
                  <ArrowPathIcon className='w-6 h-6' />
                </div>
              </div> */}
              <div className='flex items-center justify-between mt-3'>
                <p className='text-sm'>Employees</p>
                <div className='flex justify-center items-center gap-2'>
                  {/* <div className='bg-gradient-to-r from-[#65C979] to-[#0EAE2E] w-6 h-6 px-1 py-1 mx-2 text-white font-bold text-[12px] rounded-full justify-center items-center my-3'>
                    0%
                  </div> */}
                  <button
                    className='disabled:opacity-50'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSyncEmployees();
                    }}
                    disabled={isSyncingEmployees}
                  >
                    {isSyncingEmployees ? (
                      <ArrowPathIcon className='w-6 h-6 animate-spin' />
                    ) : (
                      <ArrowPathIcon className='w-6 h-6' />
                    )}
                  </button>
                </div>
              </div>
              {/* <div className='flex justify-between'>
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
              </div> */}
            </div>
          </div>
        </div>
        <div className={`flex bottom-0 left-0 absolute text-white bg-[#2c3e56fb] w-16 h-16 items-center rounded-full`}>
          <XMarkIcon className='w-[50px] h-[50px] m-auto' />
        </div>
      </div>
    </div>
  );
};
export default FloatingProgress;
