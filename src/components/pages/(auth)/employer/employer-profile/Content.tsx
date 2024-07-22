'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import Details from './Details';
import Settings from './Settings';
import useSavedProfile from './hooks/useUpdateProfile';
import classNames from '@/helpers/classNames';
import ConfirmEditEmployerProfileModal from '../employer-profile/modal/ConfirmEditEmployerProfileModal'

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import { T_EmployerProfile } from '@/types/globals';

function Content() {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const [progressBar, setProgressBar] = useState(0);
  const { register, setValue, watch, handleSubmit } = useForm<T_EmployerProfile>();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState<T_EmployerProfile | null>(null);
  const { mutate, isLoading } = useSavedProfile();

  useEffect(() => {
    if (cachedProfile) {
      setTimeout(() => {
        const cachedData: any = cachedProfile?.state?.data;
        if (cachedData) {
          setValue('companyName', cachedData.name);
          setValue('companyDescription', cachedData.description);
          setValue('typeOfIndustry', cachedData.type_of_industry);
          setValue('workSetUp', cachedData.work_set_up);
          setValue('email', cachedData.email);
          setValue('mobileNumber', cachedData.mobile_number);
          setValue('landlineNumber', cachedData.landline_number);
          setValue('building', cachedData.building);
          setValue('street', cachedData.street);
          setValue('locality', cachedData.locality);
          setValue('city', cachedData.city);
          setValue('zipCode', cachedData.zip_code);
          setValue('country', cachedData.country);
          setValue('language', cachedData.language);
          setValue('currency', cachedData.currency);
          setValue('imagePath', cachedData.logo);
        }
      }, 250);
    }
  }, [cachedProfile]);

  const openConfirmModal = handleSubmit((data) => {
    setFormData(data);
    setIsSuccessModalOpen(true);
  });

  const confirmSubmit = () => {
    if (formData) {
      const callbackReq = {
        onSuccess: (data: any) => {
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
          setIsSuccessModalOpen(false);
          queryClient.refetchQueries({ queryKey: ['employerProfileCache'] });
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
        },
      };
      mutate(formData, callbackReq);
    }
  };

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex p-4'>
        <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200'>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Dashboard</h4>
        </Link>
      </div>
      <div className='px-2 md:px-8 lg:px-4 pb-8'>
        <h2 className='text-xl font-bold text-indigo-dye mb-6'>My Profile</h2>
        <div>
          <div className='sm:hidden'>
            <h5 className='text-savoy-blue text-center text-lg font-semibold'>
              {progressBar === 1 ? 'Account Settings' : 'Employer Details'}
            </h5>
          </div>
          <div className='hidden sm:block'>
            <div className='md:w-[76%] lg:w-[80%] mx-auto translate-y-[10px]'>
              <div className='w-full bg-gray-200 rounded-full h-1'>
                <div
                  className={classNames('bg-blue-600 h-1 rounded-full', progressBar === 1 ? 'w-[100%]' : 'w-0')}
                ></div>
              </div>
            </div>
            <div className='border-t-4 border-gray-300 mx-24 w-auto mb-3 translate-y-[23px] hidden'></div>
            <nav className='-mb-px flex relative justify-between w-[90%] mx-auto' aria-label='Tabs'>
              <li
                className='text-center text-sm font-semibold list-none flex flex-col items-center text-savoy-blue cursor-pointer'
                onClick={() => setProgressBar(0)}
              >
                <div className='bg-white px-2'>
                  <div className='h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center border-savoy-blue'>
                    <div className='h-2 w-2 rounded-full bg-savoy-blue'></div>
                  </div>
                </div>
                Employer Details
              </li>
              <li
                className={classNames(
                  'text-center text-sm font-semibold list-none flex flex-col items-center cursor-pointer',
                  progressBar >= 1 ? 'text-savoy-blue' : 'text-gray-500'
                )}
                onClick={() => setProgressBar(1)}
              >
                <div className='bg-white px-2'>
                  <div
                    className={classNames(
                      'h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center',
                      progressBar >= 1 ? 'border-savoy-blue' : 'border-gray-300'
                    )}
                  >
                    <div
                      className={classNames('h-2 w-2 rounded-full', progressBar >= 1 ? 'bg-savoy-blue' : 'bg-gray-300')}
                    ></div>
                  </div>
                </div>
                Account Settings
              </li>
            </nav>
          </div>
        </div>
        {progressBar === 0 && (
          <Details register={register} handleSubmit={handleSubmit} setValue={setValue} watch={watch} setProgressBar={setProgressBar}/>
        )}
        {progressBar === 1 && <Settings register={register} onSubmit={openConfirmModal} isLoading={isLoading} />}
      </div>
      <ConfirmEditEmployerProfileModal 
        isOpen={isSuccessModalOpen} 
        setIsOpen={setIsSuccessModalOpen} 
        confirmSubmit={confirmSubmit} 
        formData={formData}
      />
    </div>
  );
}

export default Content;
