'use client';

import { useState } from 'react';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import { useLoopsSync } from '@/helpers/useLoopsSync';
import { syncContactSimple, syncCompanyViaEvent } from '@/helpers/loopsSimple';
import { getUserEmail } from '@/helpers/sessionUtils';
import { LOOPS_CONFIG } from '@/lib/loopsConfig';
import Details from './Details';
import Settings from './Settings';
import useSavedProfile from './hooks/useSavedProfile';
import classNames from '@/helpers/classNames';
import updateSession from '@/helpers/updateSession';

import { T_EmployerProfile } from '@/types/globals';

const Content = () => {
  const [progressBar, setProgressBar] = useState(0);
  const { register, setValue, watch, handleSubmit, formState: { errors }, clearErrors, trigger } = useForm<T_EmployerProfile>();
  const { mutate, isLoading } = useSavedProfile();
  const { updateContact } = useLoopsSync(); // Removed sendEvent

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: async (responseData: any) => {
        await updateSession({ hasProfile: true });
        
        // Update Loops with company profile
        const userEmail = await getUserEmail(responseData, data);
        
        if (userEmail) {
          try {
            // Simple contact sync
            await syncContactSimple({
              email: userEmail,
              name: responseData.first_name ? `${responseData.first_name} ${responseData.last_name || ''}`.trim() : 'User',
              company: data.companyName,
              source: 'employer-profile-setup',
            });
            
            // Company data update
            await syncCompanyViaEvent(userEmail, data);
            
            // Comprehensive contact update
            updateContact({
              email: userEmail,
              properties: {
                company: data.companyName,
                name: responseData.first_name ? `${responseData.first_name} ${responseData.last_name || ''}`.trim() : 'User',
                source: 'setup-employer-profile',
                userGroup: 'YAHSHUA HRIS',
                product: 'YHRIS',
              }
            });
            
          } catch (error) {
            if (LOOPS_CONFIG.FEATURES.LOG_ERRORS) {
              console.error('Error updating Loops:', error);
            }
          }
        }
        
        toast.custom(() => <CustomToast message={responseData.message} type='success' />, { duration: 4000 });
        location.href = '/dashboard';
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    mutate(data, callbackReq);
  });

  return (
    <>
      <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-8'>
        <h3 className='text-2xl text-indigo-dye font-semibold'>Tell us more about you!</h3>
        <div className='px-5 sm:px-7 lg:px-9'>
          <div className='mt-5'>
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
                <li className='text-center text-sm font-semibold list-none flex flex-col items-center text-savoy-blue'>
                  <div className='bg-white px-2'>
                    <div className='h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center border-savoy-blue'>
                      <div className='h-2 w-2 rounded-full bg-savoy-blue'></div>
                    </div>
                  </div>
                  Employer Details
                </li>
                <li
                  className={classNames(
                    'text-center text-sm font-semibold list-none flex flex-col items-center',
                    progressBar >= 1 ? 'text-savoy-blue' : 'text-gray-500'
                  )}
                >
                  <div className='bg-white px-2'>
                    <div
                      className={classNames(
                        'h-4 w-4 bg-white border-2 mb-2 rounded-full flex justify-center items-center',
                        progressBar >= 1 ? 'border-savoy-blue' : 'border-gray-300'
                      )}
                    >
                      <div
                        className={classNames(
                          'h-2 w-2 rounded-full',
                          progressBar >= 1 ? 'bg-savoy-blue' : 'bg-gray-300'
                        )}
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
              onSubmit={onSubmit} 
              setProgressBar={setProgressBar} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
