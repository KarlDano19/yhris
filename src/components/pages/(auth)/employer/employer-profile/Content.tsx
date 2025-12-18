'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import Details from './Details';
import Settings from './Settings';
import useUpdateProfile from './hooks/useUpdateProfile';
import classNames from '@/helpers/classNames';
import ConfirmEditEmployerProfileModal from '../employer-profile/modal/ConfirmEditEmployerProfileModal'
import useGetEmployerProfile from '@/components/hooks/useGetEmployerProfile';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import { T_EmployerProfile } from '@/types/globals';

function Content() {
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
  const { data: profileData, isLoading: isProfileLoading } = useGetEmployerProfile();
  const [progressBar, setProgressBar] = useState(0);
  const { register, setValue, watch, handleSubmit, formState: { errors }, clearErrors, trigger, control } = useForm<T_EmployerProfile>();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState<T_EmployerProfile | null>(null);
  const { mutate, isLoading } = useUpdateProfile();

  // Function to check if all required fields are filled
  const areRequiredFieldsFilled = () => {
    const formValues = watch();
    const requiredFields = [
      'companyName',
      'mobileNumber', 
      'street',
      'typeOfIndustry',
      'region',
      'province',
      'city',
      'locality',
      'country',
      'zipCode'
    ] as const;
    
    return requiredFields.every(field => {
      const value = formValues[field];
      if (!value || value.trim() === '') return false;
      
      // Special check for typeOfIndustry - it should not be just the prefix
      if (field === 'typeOfIndustry') {
        const prefixes = ['Manufacturing of:', 'Service/s:', 'Others:'];
        return !prefixes.some(prefix => value.trim() === prefix);
      }
      
      return true;
    });
  };

  // Function to handle dashboard link click
  const handleDashboardClick = async (e: React.MouseEvent) => {
    if (!areRequiredFieldsFilled()) {
      e.preventDefault();
      
      // Trigger form validation to show field-specific error messages
      await trigger();
      
      // Show a toast message to guide the user
      toast.custom(() => <CustomToast message={'Please complete all required fields before proceeding to dashboard'} type='error' />, {
        duration: 4000,
      });
    }
  };

  // Watch form values to update dashboard link state in real-time
  const watchedValues = watch();
  useEffect(() => {
    // This effect will run whenever any form value changes
    // The areRequiredFieldsFilled function will be called and the UI will update
  }, [watchedValues]);

  useEffect(() => {
    // Use cached data first, then fallback to fetched data
    const data = cachedProfile?.state?.data || profileData;
    
    if (data) {
      setValue('companyName', data.name || '');
      setValue('companyDescription', data.description || '');
      setValue('typeOfIndustry', data.type_of_industry || '');
      setValue('workSetUp', data.work_set_up || '');
      setValue('email', data.email || '');
      setValue('mobileNumber', data.mobile_number || '');
      setValue('landlineNumber', data.landline_number || '');
      setValue('region', data.region || '');
      setValue('province', data.province || '');
      setValue('city', data.city || '');
      setValue('locality', data.locality || '');
      setValue('building', data.building || '');
      setValue('street', data.street || '');
      setValue('country', data.country || 'Philippines');
      setValue('zipCode', data.zip_code || '');
      setValue('language', data.language || '');
      setValue('currency', data.currency || '');
      setValue('timezone', data.timezone || '');
      setValue('timeFormat', data.time_format || '12hr');
      setValue('imagePath', data.logo || '');
    }
  }, [cachedProfile, profileData, setValue]);

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
        <Link href='/dashboard' className='flex-none flex gap-3 items-center hover:bg-gray-200' onClick={handleDashboardClick}>
          <ArrowLeftIcon className='h-5 w-5' />
          <h4>Dashboard</h4>
        </Link>
      </div>
      <div className='px-2 md:px-8 lg:px-4 pb-8'>
        <h2 className='text-xl font-bold text-indigo-dye mb-6'>My Profile</h2>
        
        {isProfileLoading ? (
          <LoadingSpinner size="2xl" color="yellow" />
        ) : (
          <>
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
            <div style={{ display: progressBar === 0 ? 'block' : 'none' }}>
              <Details 
                register={register} 
                handleSubmit={handleSubmit} 
                setValue={setValue} 
                watch={watch} 
                setProgressBar={setProgressBar}
                errors={errors}
                clearErrors={clearErrors}
                trigger={trigger}
              />
            </div>
            <div style={{ display: progressBar === 1 ? 'block' : 'none' }}>
              <Settings 
                register={register} 
                onSubmit={openConfirmModal} 
                isLoading={isLoading}
                onBack={() => setProgressBar(0)}
                watch={watch}
                setValue={setValue}
                control={control}
              />
            </div>
          </>
        )}
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
