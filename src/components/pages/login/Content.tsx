'use client';
import React, { useEffect, useState } from 'react';
import SplitLayout from '@/components/SplitView';
import SplitViewBg from '@/assets/split-view-bg.png';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import EyePassword from '@/svg/EyePassword';
import toast from 'react-hot-toast';
import { T_Login } from '@/types/globals';
import useAccessAuth from './hooks/useAccessAuth';
const Content = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isLoading } = useAccessAuth();
  const { register, handleSubmit } = useForm<T_Login>();
  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.success(data.message, { duration: 5000 });
        localStorage.token = data.token;
        localStorage.hasProfile = data.has_profile;
        localStorage.accountType = data.account_type;
      },
      onError: (err: any) => {
        toast.error(err);
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
            <div className='w-full rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
              <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                <h1 className='text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
                  Welcome back!
                </h1>
                <p className='text-center text-gray-400'>
                  Start managing your people faster and better.
                </p>
                <form className='space-y-4 md:space-y-6' onSubmit={onSubmit}>
                  <div>
                    <label
                      htmlFor='email'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Email
                    </label>
                    <input
                      type='email'
                      id='email'
                      {...register('email', { required: true })}
                      className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='password'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Password
                    </label>
                    <div className='relative mx-auto'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        {...register('password', { required: true })}
                        className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
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
                          className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800'
                        />
                      </div>
                      <div className='ml-3 text-sm'>
                        <label
                          htmlFor='remember'
                          className='text-gray-500 dark:text-gray-300'
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <a
                      href='#'
                      className='text-sm font-medium text-blue-600 hover:underline dark:text-blue-500'
                    >
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type='submit'
                    className='w-full uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                  >
                    Sign in
                  </button>
                  <p className='text-sm font-light text-gray-500 dark:text-gray-400 text-center'>
                    Don’t have an account yet?{' '}
                    <Link
                      href='/register'
                      className='font-medium text-blue-600 hover:underline dark:text-blue-500'
                    >
                      Sign up
                    </Link>
                  </p>
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
