'use client';

import React, { useEffect, useState } from 'react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import emailVerification from './hooks/useEmailVerification';

const Content = () => {
  const router = useRouter();
  const { auth, token, code } = useParams();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const { mutate } = emailVerification();

  useEffect(() => {
    let payloads = {
      auth: auth,
      token: token,
      code: code,
    };
    const callbackReq = {
      onSuccess: (data: any) => {
        if (data.is_valid) {
          setIsProcessing(false);
          setIsEmailConfirmed(true);
        } else {
          setIsProcessing(false);
        }
      },
      onError: (err: any) => {
        setIsProcessing(false);
      },
    };
    mutate(payloads, callbackReq);
  }, []);

  const handleGoBack = () => {
    const urlRedirect = searchParams.get('redirect');
    const pendingRedirect = urlRedirect || localStorage.getItem('postAuthRedirect');
    if (pendingRedirect) {
      router.push(`/login?redirect=${encodeURIComponent(pendingRedirect)}`);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      {isProcessing ? (
        <div className='text-center bg-white shadow-md px-8 pt-6 pb-8 mb-4 rounded-lg'>
          <p className='text-[1.5rem]'>Processing...</p>
        </div>
      ) : (
        <>
          {isEmailConfirmed ? (
            <>
              <div className='text-center bg-white shadow-md px-8 pt-6 pb-8 mb-4 rounded-lg'>
                <p className='text-[1.5rem]'>Email has been confirmed!</p>
                <button
                  onClick={handleGoBack}
                  className='mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'
                >
                  Go back to login page
                </button>
              </div>
            </>
          ) : (
            <>
              <div className='text-center bg-white shadow-md px-8 pt-6 pb-8 mb-4 rounded-lg'>
                <p className='text-[1.5rem]'>Verification is invalid or Expired, Please try again.</p>
                <button
                  onClick={handleGoBack}
                  className='mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'
                >
                  Go back to login page
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Content;
