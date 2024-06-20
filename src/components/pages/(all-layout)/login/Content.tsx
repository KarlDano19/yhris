'use client';

import React, { useState } from 'react';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { setCookie } from 'cookies-next';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import EmailVerificationModal from './modal/EmailVerificationModal';
import useLogin from '@/components/pages/(all-layout)/login/hooks/useLogin';
import CustomToast from '@/components/CustomToast';
import SplitLayout from '@/components/SplitView';
import SplitViewBg from '@/assets/split-view-bg.png';
import MainIconOnly from '@/svg/MainIconOnly';

import { EnvelopeIcon, LockClosedIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/solid';
import GoogleIcon from '@/svg/GoogleIcon';
import FacebookRoundedIcon from '@/svg/FacebookRoundedIcon';
import YahshuaPayrollLogo from '@/svg/YahshuaPayrollLogo';

import { T_Login } from '@/types/globals';

function Content() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showCreateAccountModal, setCreateAccountModal] = useState(false);
  const [showEmailVerificationModal, setEmailVerificationModal] = useState(false);

  const { mutate, isLoading } = useLogin();
  const { register, getValues, handleSubmit } = useForm<T_Login>();

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        if (data.is_valid) {
          setSession(data);
          toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        } else {
          setEmailVerificationModal(true);
        }
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(data, callbackReq);
  });

  const setSession = async (data: any) => {
    if (data.account_type === 'employer') {
      if (data.has_profile) {
        const returnTo = searchParams.get('redirect') || '/dashboard';
        location.href = returnTo;
      } else {
        location.href = '/setup-employer-profile';
      }
    } else {
      if (data.has_profile) {
        location.href = '/apply-for-a-job';
      } else {
        location.href = '/setup-applicant-profile';
      }
    }
  };

  return (
    <SplitLayout
      left={
        <>
          <div className={`w-full hidden lg:flex flex-col items-center justify-center  `}>
            <MainIconOnly className='w-24 h-24' />

            <h1 className='text-[50px] font-bold text-white mt-4'>
              YAHSHUA <span className='text-[#FFC107]'>HRIS</span>
            </h1>
            <h3 className='text-white text-3xl text-center w-96 mt-2'>Leading your employees in one place.</h3>
          </div>
        </>
      }
      right={
        <>
          <div className={`flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-full lg:py-0 `}>
            <div className='w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0'>
              <div className='p-6 space-y-4 sm:p-8'>
                <div className='mb-9'>
                  <h1 className='text-2xl text-center font-bold leading-none tracking-tight text-indigo-dye lg:text-[45px] mb-4'>
                    Welcome back!
                  </h1>
                  <p className='text-center text-[#6F829B]'>Start managing your people faster and better.</p>
                </div>
                <form onSubmit={onSubmit}>
                  <div className='relative mb-5'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                      <EnvelopeIcon className='h-5 w-5 text-savoy-blue' aria-hidden='true' />
                    </div>
                    <input
                      type='email'
                      id='email'
                      {...register('email', { required: true })}
                      className='bg-gray-50 border border-gray-300 text-gray-900 pl-11 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                      placeholder='Email'
                      tabIndex={1}
                    />
                  </div>
                  <div className='mb-3'>
                    <div className='relative mx-auto'>
                      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                        <LockClosedIcon className='h-5 w-5 text-savoy-blue' aria-hidden='true' />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        {...register('password', { required: true })}
                        className='bg-gray-50 border border-gray-300 text-gray-900 pl-11 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                        placeholder='Password'
                        tabIndex={2}
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 flex items-center px-4 text-blue-400'
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className='h-5 w-5 text-savoy-blue' />
                        ) : (
                          <EyeIcon className='h-5 w-5 text-savoy-blue' />
                        )}
                      </button>
                    </div>
                  </div>
                  <Link
                    href='/forgot-password'
                    className='text-sm font-semibold text-blue-600 hover:underline float-right mb-5'
                    tabIndex={4}
                  >
                    Forgot password?
                  </Link>
                  <button
                    type='submit'
                    className='w-full uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center mb-5'
                    tabIndex={5}
                  >
                    Sign in
                  </button>
                  <p className='text-sm font-light text-gray-500 text-center mb-9'>
                    Don’t have an account yet?{' '}
                    <Link href='/register' className='font-semibold text-blue-600 hover:underline'>
                      Sign Up here
                    </Link>
                  </p>
                </form>
                <div className='border-t text-gray-400 border-gray-400 flex justify-center'>
                  <span className='absolute -translate-y-[15px] bg-white px-8'>or</span>
                </div>
                <div className='mb-5 relative'>
                  <button
                    className='flex lg:w-full items-center justify-center text-indigo-dye mt-8 lg:mt-4 font-semibold bg-white border border-gray-400 w-full lg:px-12 py-2.5 rounded-md disabled:opacity-50'
                    onClick={() => setCreateAccountModal(true)}
                    disabled={true}
                  >
                    <GoogleIcon className='w-4 h-4 mr-2' /> Google
                  </button>
                  <button
                    className='flex items-center justify-center text-indigo-dye mt-4 font-semibold bg-white border border-gray-400 w-full lg:w-full lg:px-10 py-2.5 rounded-md disabled:opacity-50'
                    onClick={() => setCreateAccountModal(true)}
                    disabled={true}
                  >
                    <FacebookRoundedIcon className='w-4 h-4 mr-2' /> Facebook
                  </button>
                  <button
                    className='flex items-center justify-center text-indigo-dye mt-4 font-semibold bg-white border border-gray-400 w-full lg:w-full lg:px-10 py-2.5 rounded-md disabled:opacity-50'
                    disabled={true}
                  >
                    <div className='mx-1'>
                      <YahshuaPayrollLogo />
                    </div>{' '}
                    YAHSHUA Payroll
                  </button>
                </div>
                <div>
                  <Link href='#' className='underline flex justify-center mt-6 text-indigo-dye'>
                    Privacy Notice
                  </Link>
                </div>
              </div>
            </div>
            <EmailVerificationModal
              email={getValues('email')}
              isOpen={showEmailVerificationModal}
              onClose={() => setEmailVerificationModal(false)}
            />
          </div>
        </>
      }
      leftBG={SplitViewBg}
    />
  );
}

export default Content;
