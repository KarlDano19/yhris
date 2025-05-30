'use client';
import React, { useState } from 'react';
import SplitLayout from '@/components/SplitView';
import SplitViewBg from '@/assets/split-view-bg.png';
import Link from 'next/link';

import MainIconOnly from '@/svg/MainIconOnly';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/solid';
import SuccessModal from './modal/SuccessModal';
import useUpdatePassword from './hooks/useUpdatePassword';
import useVerifyToken from './hooks/useVerifyToken';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import { T_UserPassword } from '@/types/globals';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';

const getPasswordRequirements = (pass: string) => ({
  length: pass.length >= 12,
  lowercase: /[a-z]/.test(pass),
  uppercase: /[A-Z]/.test(pass),
  digit: /[0-9]/.test(pass),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
  noSpaces: !/\s/.test(pass),
});


const Content = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const { register, handleSubmit, reset } = useForm<T_UserPassword>();
  const { mutate: updatePassword, isLoading: isUpdating } = useUpdatePassword();
  const [backendPasswordError, setBackendPasswordError] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState(getPasswordRequirements(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const params = useParams<{ id: string }>();
  const urlToken = params?.id;
  const { data: verifyToken, isLoading: isVerifying } =
    useVerifyToken(urlToken);

  const onSubmit = (data: T_UserPassword) => {
    data.code = urlToken;
    if (data.password !== '' || data.confirmPassword !== '') {
      if (data.password === data.confirmPassword) {
        const callBackReq = {
          onSuccess: (data: any) => {
            setSuccessModal(true);
            reset();
          },
          onError: (err: any) => {
            toast.custom(() => <CustomToast message={err} type='error' />, {
              duration: 4000,
            });
          },
        };
        updatePassword(data, callBackReq);
      } else {
        toast.custom(
          () => <CustomToast message={"Password doesn't match"} type='error' />,
          {
            duration: 4000,
          }
        );
      }
    } else {
      toast.custom(
        () => (
          <CustomToast
            message={'Password and confirm password required'}
            type='error'
          />
        ),
        {
          duration: 4000,
        }
      );
    }
  };
  if (isVerifying) {
    return (
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-full lg:py-0 mb-auto mt-20'>
        <h1 className='text-xl text-center font-bold leading-none tracking-tight text-indigo-dye lg:text-3xl mb-2'>
          Verifying token...
        </h1>
      </div>
    );
  }
  if (verifyToken) {
    return (
      <SplitLayout
        left={
          <>
            <div
              className={`w-full hidden lg:flex flex-col items-center justify-center  `}
            >
              <MainIconOnly className='w-24 h-24' />

              <h1 className='text-[50px] font-bold text-white mt-4'>
                YAHSHUA <span className='text-[#FFC107]'>HRIS</span>
              </h1>
              <h3 className='text-white text-3xl text-center w-96 mt-2'>
                Leading your employees in one place.
              </h3>
            </div>
          </>
        }
        right={
          <>
            <div
              className={`flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-full lg:py-0 `}
            >
              <div className='w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0'>
                <div className='p-6 space-y-4 sm:p-8'>
                  <div className='mb-6'>
                    <h1 className='text-xl text-center font-bold leading-none tracking-tight text-indigo-dye lg:text-3xl mb-2'>
                      Change Your Password
                    </h1>
                    <p className='text-center text-[#6F829B]'>
                      Please make sure your password contains one lowercase
                      letter, one number, and atleast 12 characters long.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-6'>
                      <div className='relative mx-auto'>
                        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                          <LockClosedIcon
                            className='h-5 w-5 text-savoy-blue'
                            aria-hidden='true'
                          />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id='password'
                          {...register('password', { required: true })}
                          disabled={isUpdating}
                          className='bg-gray-50 border border-gray-300 text-gray-900 pl-11 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                          placeholder='New Password'
                          tabIndex={1}
                          onChange={(e) => {
                            setPassword(e.currentTarget.value);
                            setPasswordRequirements(getPasswordRequirements(e.currentTarget.value));
                            setBackendPasswordError('');
                          }}
                        />
                        <button
                          type='button'
                          className='absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 text-blue-400'
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? (
                            <EyeSlashIcon className='h-5 w-5 text-[#CCD8EA]' />
                          ) : (
                            <EyeIcon className='h-5 w-5 text-[#CCD8EA]' />
                          )}
                        </button>
                      </div>
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
                              <li>• At least 1 special character (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
                            )}
                            {!passwordRequirements.noSpaces && (
                              <li>• Spaces are not allowed</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className='mb-9'>
                      <div className='relative mx-auto'>
                        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                          <LockClosedIcon
                            className='h-5 w-5 text-savoy-blue'
                            aria-hidden='true'
                          />
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id='confirm-password'
                          {...register('confirmPassword', { required: true })}
                          disabled={isUpdating}
                          className='bg-gray-50 border border-gray-300 text-gray-900 pl-11 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                          placeholder='Confirm Password'
                          tabIndex={2}
                        />
                        <button
                          type='button'
                          className='absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 text-blue-400'
                          onClick={() => {
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className='h-5 w-5 text-[#CCD8EA]' />
                          ) : (
                            <EyeIcon className='h-5 w-5 text-[#CCD8EA]' />
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      type='submit'
                      className='w-full uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center mb-5'
                      tabIndex={3}
                    >
                      {isUpdating ? (
                        <div
                          className='animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2'
                          role='status'
                          aria-label='loading'
                        >
                          <span className='sr-only'>Loading...</span>
                        </div>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                    <h6 className='text-center'>
                      <Link
                        href='/login'
                        className='font-semibold text-blue-600 hover:underline'
                      >
                        Back to Sign In
                      </Link>
                    </h6>
                  </form>
                </div>
              </div>
              <SuccessModal
                open={showSuccessModal}
                onClose={() => setSuccessModal(false)}
              />
            </div>
          </>
        }
        leftBG={SplitViewBg}
      />
    );
  } else {
    return (
      <SplitLayout
        left={
          <>
            <div
              className={`w-full hidden lg:flex flex-col items-center justify-center  `}
            >
              <MainIconOnly className='w-24 h-24' />

              <h1 className='text-[50px] font-bold text-white mt-4'>
                YAHSHUA <span className='text-[#FFC107]'>HRIS</span>
              </h1>
              <h3 className='text-white text-3xl text-center w-96 mt-2'>
                Leading your employees in one place.
              </h3>
            </div>
          </>
        }
        right={
          <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-full lg:py-0 mb-auto mt-auto'>
            <h1 className='text-xl text-center font-bold leading-none tracking-tight text-indigo-dye lg:text-3xl mb-2'>
              Link is expired or invalid.
            </h1>
            <p className='text-center text-[#6F829B]'>
              Reset password links are only available for a limited time. Return
              to the previous page to get a new link.
            </p>
          </div>
        }
        leftBG={SplitViewBg}
      />
    );
  }
};

export default Content;
