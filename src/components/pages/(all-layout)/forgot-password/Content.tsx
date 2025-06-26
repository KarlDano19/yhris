'use client';
import React, { useState } from 'react';
import SplitLayout from '@/components/SplitView';
import SplitViewBg from '@/assets/split-view-bg.png';
import Link from 'next/link';

import MainIconOnly from '@/svg/MainIconOnly';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import InstructionModal from './modal/InstructionModal';
import useSendLink from './hooks/useSendLink';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from "@/components/CustomToast";



const Content = () => {
  const [showInstructionModal, setInstructionModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { register, handleSubmit, reset } = useForm<any>();
  const { mutate } = useSendLink();

  const onSubmit = (data: any) => {
    const callBackReq = {
      onSuccess: () => {
        setSubmittedEmail(data.email);
        setInstructionModal(true);
        reset();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 4000,
        });
      },
    };

    mutate(data, callBackReq);
  };

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
                <div className='mb-9'>
                  <h1 className='text-xl text-center font-bold leading-none tracking-tight text-indigo-dye lg:text-3xl mb-4'>
                    Forgot your Password?
                  </h1>
                  <p className='text-center text-[#6F829B]'>
                    Enter your email below and we&apos;ll send you a link to
                    reset your password.
                  </p>
                </div>
                <form className='' onSubmit={handleSubmit(onSubmit)}>
                  <div className='relative mb-10'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                      <EnvelopeIcon
                        className='h-5 w-5 text-savoy-blue'
                        aria-hidden='true'
                      />
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
                  <button
                    type='submit'
                    className='w-full uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center mb-5'
                    tabIndex={5}
                  >
                    Submit
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
            <InstructionModal
              open={showInstructionModal}
              onClose={() => setInstructionModal(false)}
              name={submittedEmail}
            />
          </div>
        </>
      }
      leftBG={SplitViewBg}
    />
  );
};

export default Content;
