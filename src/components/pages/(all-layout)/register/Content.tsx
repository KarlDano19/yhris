'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import SplitLayout from '@/components/SplitView';
import SplitViewBg from '@/assets/split-view-bg.png';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import FloatingHelpButton from '@/components/FloatingHelpButton';
import useRegisterAccount from './hooks/useRegisterAccount';
import { useLoopsSync } from '@/helpers/useLoopsSync';

import { EyeIcon } from '@heroicons/react/24/solid';
import { EyeSlashIcon } from '@heroicons/react/24/outline';
import DropDownArrow from '@/svg/DropDownArrow';
import MainIconOnly from '@/svg/MainIconOnly';
import ChevronLeftIcon from '@/svg/ChevronLeft';

import { T_Register } from '@/types/globals';

const getPasswordRequirements = (pass: string) => ({
  length: pass.length >= 12,
  lowercase: /[a-z]/.test(pass),
  uppercase: /[A-Z]/.test(pass),
  digit: /[0-9]/.test(pass),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
  noSpaces: !/\s/.test(pass),
});

const Content = () => {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  // const accountType = [
  //   {
  //     value: 'employer',
  //     label: 'Employer',
  //   },
  // ];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [conformPassword, setConfirmPassword] = useState('');
  const { register, handleSubmit, reset, watch, formState: { errors }, clearErrors } = useForm<T_Register>();
  const { mutate, isLoading } = useRegisterAccount();
  const { syncToLoops } = useLoopsSync();
  const [backendPasswordError, setBackendPasswordError] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState(getPasswordRequirements(''));
  const [backendEmailError, setBackendEmailError] = useState('');

  // Check if user is already logged in and redirect if so
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/get-session');
        const sessionData = await response.json();
        
        if (sessionData.isLoggedIn) {
          // User is already logged in, redirect appropriately
          if (sessionData.accountType === 'employer') {
            window.location.href = '/dashboard';
          } else if (sessionData.accountType === 'applicant') {
            window.location.href = '/apply-for-a-job';
          } else if (sessionData.accountType === 'admin') {
            window.location.href = '/admin/dashboard';
          }
          return;
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  const onSubmit = (data: T_Register) => {
    if (password !== '' || conformPassword !== '') {
      if (password === conformPassword) {
        const callBackReq = {
          onSuccess: (responseData: any) => {
            setBackendPasswordError('');
            setBackendEmailError('');
            
            // Sync new user to Loops.so (simplified fields only)
            const fullName = data.accountType === 'Employer' 
              ? data.name 
              : `${data.firstname} ${data.middlename ? data.middlename + ' ' : ''}${data.lastname}`.trim();
            
            syncToLoops({
              email: data.email,
              name: fullName, // Send the complete full name
              userGroup: 'YAHSHUA HRIS',
              product: 'YHRIS',
              source: 'registration',
            });
            
            reset();
            toast.custom(() => <CustomToast message={responseData.message} type='success' />, {
              duration: 7000,
            });
            router.push('/login');
          },
          onError: (err: any) => {
            if (typeof err === 'string' && err.toLowerCase().includes('password')) {
              setBackendPasswordError(err);
              setBackendEmailError('');
            } else if (typeof err === 'string' && err.toLowerCase().includes('already in use')) {
              setBackendEmailError(err);
              setBackendPasswordError('');
            } else {
              setBackendPasswordError('');
              setBackendEmailError('');
            }
          },
        };
        if (agree) {
          mutate(data, callBackReq);
        } else {
          toast.custom(() => <CustomToast message={'Please agree to the Terms of Service and Privacy Policy to proceed.'} type='error' />, {
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

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <>
        {/* Back Button */}
        <div className="fixed top-4 left-4 z-50">
          <Link 
            href="/landing-page" 
            className="inline-flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full 
            shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)] 
            hover:bg-white active:bg-gray-50 hover:-translate-y-1 active:translate-y-0 
            transform transition-all duration-300 ease-out hover:scale-105 active:scale-95
            border border-gray-100"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
          </Link>
        </div>
        
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
                <LoadingSpinner size="lg" color="yellow" showText text="Checking session..." />
              </div>
            </>
          }
          leftBG={SplitViewBg}
        />
        <FloatingHelpButton />
      </>
    );
  }

  return (
    <>
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          href="/landing-page" 
          className="inline-flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full 
          shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)] 
          hover:bg-white active:bg-gray-50 hover:-translate-y-1 active:translate-y-0 
          transform transition-all duration-300 ease-out hover:scale-105 active:scale-95
          border border-gray-100"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
        </Link>
      </div>
      
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
                  <form onSubmit={handleSubmit(onSubmit)} suppressHydrationWarning>
                    <div className='relative mb-2'>
                      <label htmlFor='role' className='text-sm leading-6 text-gray-900'>
                        Register As
                       <span className='text-red-500'>*</span>
                      </label>
                      <select
                        id='role'
                        {...register('accountType', { required: "Please select an account type" })}
                        className='rounded-md appearance-none mt-1 w-full border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6'
                        defaultValue=''
                        placeholder='Select...'
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
                      {errors.accountType && (
                        <p className="text-red-600 text-xs mt-1">{errors.accountType.message}</p>
                      )}
                    </div>
                    <div className='mb-2'>
                      <label htmlFor='email' className='text-sm leading-6 text-gray-900'>
                        Email Address
                       <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='email'
                        id='email'
                        {...register('email', { required: "Please enter an email address" })}
                        className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                        tabIndex={2}
                        onChange={(e) => {
                          setBackendEmailError('');
                          if (e.currentTarget.value) {
                            clearErrors('email');
                          }
                        }}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                      )}
                      {backendEmailError && (
                        <p className="text-red-600 text-xs mt-1">{backendEmailError}</p>
                      )}
                    </div>
                    {watch('accountType') === 'Applicant' ? (
                      <>
                        <div className='mb-2'>
                          <label htmlFor='name' className='text-sm leading-6 text-gray-900'>
                            First Name
                           <span className='text-red-500'>*</span>
                          </label>
                          <input
                            type='text'
                            id='firstname'
                            {...register('firstname', { required: "Please enter a first name" })}
                            className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                            tabIndex={2}
                          />
                          {errors.firstname && (
                            <p className="text-red-600 text-xs mt-1">{errors.firstname.message}</p>
                          )}
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
                            {...register('lastname', { required: "Please enter a last name" })}
                            className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                            tabIndex={2}
                          />
                          {errors.lastname && (
                            <p className="text-red-600 text-xs mt-1">{errors.lastname.message}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className='mb-2'>
                        <label htmlFor='name' className='text-sm leading-6 text-gray-900'>
                          Name
                         <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='text'
                          id='name'
                          {...register('name', { required: "Please enter a name" })}
                          className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                          tabIndex={2}
                        />
                        {errors.name && (
                          <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
                        )}
                      </div>
                    )}
                    <div className='mb-2'>
                      <label htmlFor='password' className='text-sm leading-6 text-gray-900'>
                        Password
                       <span className='text-red-500'>*</span>
                      </label>
                      <div className='relative'>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id='password'
                          {...register('password', { required: "Please enter a password" })}
                          className='bg-gray-50 border mt-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                          tabIndex={2}
                          onChange={(e) => {
                            setPassword(e.currentTarget.value);
                            setPasswordRequirements(getPasswordRequirements(e.currentTarget.value));
                            setBackendPasswordError('');
                            if (e.currentTarget.value) {
                              clearErrors('password');
                            }
                          }}
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
                      {errors.password && (
                        <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
                      )}
                      {backendPasswordError && (
                        <p className="text-red-600 text-xs mt-1">{backendPasswordError}</p>
                      )}
                      {password && (
                        <div className='mt-2 text-sm text-red-600'>
                          <ul className='space-y-1'>
                            {!passwordRequirements.length && (
                              <li>• At least 12 characters</li>
                            )}
                            {!passwordRequirements.lowercase && (
                              <li>• At least 1 lowercase letter (a-z)</li>
                            )}
                            {!passwordRequirements.uppercase && (
                              <li>• At least 1 uppercase letter (A-Z)</li>
                            )}
                            {!passwordRequirements.digit && (
                              <li>• At least 1 number (0-9)</li>
                            )}
                            {!passwordRequirements.special && (
                              <li>• At least 1 special character (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)</li>
                            )}
                            {!passwordRequirements.noSpaces && (
                              <li>• Spaces are not allowed</li>
                            )}
                          </ul>
                        </div>
                      )}
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
                          {...register('confirmPassword', { required: "Please confirm your password" })}
                          onChange={(e) => {
                            setConfirmPassword(e.currentTarget.value);
                            if (e.currentTarget.value) {
                              clearErrors('confirmPassword');
                            }
                          }}
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
                      {errors.confirmPassword && (
                        <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>
                      )}
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
                          <Link href='/terms-of-service' target='_blank' className='text-savoy-blue underline'>
                            Terms of Service
                          </Link>
                          ,and{' '}
                          <Link href='/privacy-notice' target='_blank' className='text-savoy-blue underline'>
                            Privacy Notice
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
      <FloatingHelpButton />
    </>
  );
};

export default Content;