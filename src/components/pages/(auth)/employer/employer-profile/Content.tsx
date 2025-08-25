'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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
  const { register, setValue, watch, handleSubmit, formState: { errors }, clearErrors, trigger } = useForm<T_EmployerProfile>();
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
          <div className='flex justify-center items-center min-h-[400px]'>
            <div role='status' className='text-center'>
              <svg
                aria-hidden='true'
                className='inline w-20 h-20 text-gray-200 animate-spin fill-yellow-400'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
            </div>
          </div>
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
