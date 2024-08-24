'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import SplitLayout from '@/components/SplitView';
import SplitViewBg from '@/assets/split-view-bg.png';
import CustomToast from '@/components/CustomToast';
import useRegisterAccount from './hooks/useRegisterAccount';

import { EyeIcon } from '@heroicons/react/24/solid';
import { EyeSlashIcon } from '@heroicons/react/24/outline';
import DropDownArrow from '@/svg/DropDownArrow';
import MainIconOnly from '@/svg/MainIconOnly';

import { T_Register } from '@/types/globals';

const Content = () => {
  const router = useRouter();
  const accountType = [
    {
      value: 'employer',
      label: 'Employer',
    },
  ];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [conformPassword, setConfirmPassword] = useState('');
  const [isApplicant, setIsApplicant] = useState("")
  const { register, handleSubmit, reset } = useForm<T_Register>();
  const { mutate, isLoading } = useRegisterAccount();

  const onSubmit = (data: T_Register) => {
    if (password !== '' || conformPassword !== '') {
      if (password === conformPassword) {
        const callBackReq = {
          onSuccess: (data: any) => {
            reset();
            toast.custom(() => <CustomToast message={data.message} type='success' />, {
              duration: 7000,
            });
            router.push('/login');
          },
          onError: (err: any) => {
            toast.custom(() => <CustomToast message={err} type='error' />, {
              duration: 7000,
            });
          },
        };
        if (agree) {
          mutate(data, callBackReq);
        } else {
          toast.custom(() => <CustomToast message={'Please agree to user agreement policy'} type='error' />, {
            duration: 4000,
          });
        }
      } else {
        toast.custom(() => <CustomToast message={"Password doesn't match"} type='error' />, {
          duration: 4000,
        });
      }
    } else {
      toast.custom(() => <CustomToast message={'Password and confirm password required'} type='error' />, {
        duration: 4000,
      });
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
              <div className='p-6 space-y-4 md:space-y-5 sm:p-8'>
                <h1 className='text-2xl font-bold leading-none tracking-tight text-indigo-dye lg:text-3xl'>
                  Create Account
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='relative mb-2'>
                    <label htmlFor='role' className='text-sm leading-6 text-gray-900'>
                      Register As
                      <span className='text-red-500'>*</span>
                    </label>
                    <select
                      id='role'
                      {...register('accountType', { required: true })}
                      className='rounded-md appearance-none mt-1 w-full border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                      defaultValue=''
                      placeholder='Select...'
                      onChange={(e) => setIsApplicant(e.target.value)}
                    >
                      <option value='' disabled className='text-gray-400'>
                        Select...
                      </option>
                      <option value={'Employer'}>Employer</option>
                      <option value={'Applicant'}>Applicant</option>
                    </select>
                    <div className='absolute right-4 top-[46px]'>
                      <DropDownArrow />
                    </div>
                  </div>
                  <div className='mb-2'>
                    <label htmlFor='email' className='text-sm leading-6 text-gray-900'>
                      Email Address
                      <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='email'
                      id='email'
                      {...register('email', { required: true })}
                      className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                      tabIndex={2}
                    />
                  </div>
                  {isApplicant === 'Applicant' ? (
                    <>
                      <div className='mb-2'>
                        <label htmlFor='name' className='text-sm leading-6 text-gray-900'>
                          First Name
                          <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='text'
                          id='firstname'
                          {...register('firstname', { required: true })}
                          className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                          tabIndex={2}
                        />
                      </div>
                      <div className='mb-2'>
                        <label htmlFor='name' className='text-sm leading-6 text-gray-900'>
                          Middle Name
                        </label>
                        <input
                          type='text'
                          id='middlename'
                          {...register('middlename')}
                          className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                          tabIndex={2}
                        />
                      </div>
                      <div className='mb-2'>
                        <label htmlFor='name' className='text-sm leading-6 text-gray-900'>
                          Last Name
                          <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='text'
                          id='lastname'
                          {...register('lastname', { required: true })}
                          className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                          tabIndex={2}
                        />
                      </div>
                    </>
                  ):
                  <div className='mb-2'>
                    <label htmlFor='name' className='text-sm leading-6 text-gray-900'>
                      Name
                      <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      id='name'
                      {...register('name', { required: true })}
                      className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                      tabIndex={2}
                    />
                  </div>
                  }
                  <div className='mb-2'>
                    <label htmlFor='password' className='text-sm leading-6 text-gray-900'>
                      Password
                      <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        {...register('password', { required: true })}
                        className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                        tabIndex={2}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 flex items-center px-4 text-blue-400'
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? (
                          <EyeIcon className='h-5 w-5 text-savoy-blue' />
                        ) : (
                          <EyeSlashIcon className='h-5 w-5 text-savoy-blue' />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='confirm-password' className='text-sm leading-6 text-gray-900'>
                      Confirm Password
                      <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id='confirm-password'
                        className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                        tabIndex={2}
                        {...register('confirmPassword', { required: true })}
                        onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 flex items-center px-4 text-blue-400'
                        onClick={() => {
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                      >
                        {showConfirmPassword ? (
                          <EyeIcon className='h-5 w-5 text-savoy-blue' />
                        ) : (
                          <EyeSlashIcon className='h-5 w-5 text-savoy-blue' />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='relative flex items-start'>
                    <div className='flex h-6 items-center'>
                      <input
                        id='checkbox-agree'
                        aria-describedby='checkbox-agree'
                        name='checkbox-agree'
                        type='checkbox'
                        onChange={() => {
                          setAgree(!agree);
                        }}
                        className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                      />
                    </div>
                    <div className='ml-3 text-sm leading-6'>
                      <p id='checkbox-agree'>
                        I have read and agree with{' '}
                        <Link href='#' className='text-savoy-blue underline'>
                          Terms of Service
                        </Link>
                        ,{' '}
                        <Link href='#' className='text-savoy-blue underline'>
                          Privacy Notice
                        </Link>
                        , and{' '}
                        <Link href='#' className='text-savoy-blue underline'>
                          Personal Data Collection and Disclosure Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      type='submit'
                      className='w-full mt-5 uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center mb-5'
                      tabIndex={5}
                    >
                      {isLoading ? (
                        <div
                          className='animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2'
                          role='status'
                          aria-label='loading'
                        >
                          <span className='sr-only'>Loading...</span>
                        </div>
                      ) : (
                        'Sign up'
                      )}
                    </button>
                    <h6 className='text-center'>
                      <Link href='/login' className='font-semibold text-blue-600 hover:underline'>
                        Back to Sign In
                      </Link>
                    </h6>
                  </div>
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
