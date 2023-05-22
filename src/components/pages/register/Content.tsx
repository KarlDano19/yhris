'use client';
import React, { useEffect, useState } from 'react';
import SplitLayout from '@/components/SplitView';
import SplitViewBg from '@/assets/split-view-bg.png';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import EyePassword from '@/svg/EyePassword';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast'
import { T_Register } from '@/types/globals';
import useRegisterAccount from './hooks/useRegisterAccount';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
const Content = () => {
  const router = useRouter();
  const [isAgree, setIsAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isLoading } = useRegisterAccount();
  const { register, handleSubmit } = useForm<T_Register>();
  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type="success" />, { duration: 4000 });
        setCookie('token', data.token, {maxAge: 60*60*24*1});
        router.push("/setup-employer-profile");
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type="error" />, { duration: 4000 });
      },
    };
    mutate(data, callbackReq);
  });
  return (
    <SplitLayout
      left={<></>}
      right={
        <>
          <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-full lg:py-0'>
            <div className='w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0'>
              <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
                  Create Account
                </h1>
                <form className='space-y-4 md:space-y-6' onSubmit={onSubmit}>
                  <div className='mt-2'>
                    <label
                      htmlFor='name'
                      className='block mb-2 text-sm font-medium text-gray-900'
                    >
                      Register As
                    </label>
                    <select
                      id='position'
                      {...register('accountType', { required: true })}
                      className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                      tabIndex={1}
                    >
                      <option value=''>Select...</option>
                      <option>Employer</option>
                      <option>Applicant</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor='name'
                      className='block mb-2 text-sm font-medium text-gray-900'
                    >
                      Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      {...register('name', { required: true })}
                      className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                      tabIndex={2}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='email'
                      className='block mb-2 text-sm font-medium text-gray-900'
                    >
                      Email Address
                    </label>
                    <input
                      type='email'
                      id='email'
                      {...register('email', { required: true })}
                      className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                      tabIndex={3}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='password'
                      className='block mb-2 text-sm font-medium text-gray-900'
                    >
                      Password
                    </label>
                    <div className='relative mx-auto'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        {...register('password', { required: true })}
                        className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                        tabIndex={4}
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 text-blue-400'
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        <EyePassword visible={showPassword} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor='confirm-password'
                      className='block mb-2 text-sm font-medium text-gray-900'
                    >
                      Confirm Password
                    </label>
                    <div className='relative mx-auto'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id='confirm-password'
                        {...register('confirmPassword', { required: true })}
                        className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                        tabIndex={5}
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 text-blue-400'
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        <EyePassword visible={showPassword} />
                      </button>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-start'>
                      <div className='flex items-center h-5'>
                        <input
                          id='remember'
                          aria-describedby='remember'
                          type='checkbox'
                          className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300'
                          checked={isAgree}
                          onChange={() => {
                            setIsAgree(!isAgree);
                          }}
                          tabIndex={6}
                        />
                      </div>
                      <div className='ml-3 text-sm'>
                        <label
                          htmlFor='remember'
                          className='text-gray-500'
                        >
                          I have read and agree with{' '}
                          <Link href='#' className='text-blue-500'>
                            Terms of Service, Privacy Notice
                          </Link>
                          , and{' '}
                          <Link href='#' className='text-blue-500'>
                            Personal Data Collection and Disclosure Policy.
                          </Link>
                        </label>
                      </div>
                    </div>
                  </div>
                  <button
                    type='submit'
                    className='w-full uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-75'
                    disabled={!isAgree}
                    tabIndex={7}
                  >
                    Sign up
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      }
      leftBG={SplitViewBg}
    />
  );
};

export default Content;
