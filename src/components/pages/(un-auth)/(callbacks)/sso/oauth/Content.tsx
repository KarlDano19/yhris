'use client';

import { useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import useVerifyOauth from './hooks/useVerifyOauth';

function Content() {
  const broadcastChannel = new BroadcastChannel('integration-channel');
  const params = useParams();
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const errorParam = searchParams.get('error');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { mutate, isLoading, isError, isSuccess } = useVerifyOauth();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (code) {
      const data = {
        code: code,
        provider: params?.provider,
      };
      const callbackRequest = {
        onSuccess: (data: any) => {
          const postMessageData: any = {
            isGranted: data.is_granted,
            provider: params?.provider,
          }
          if (data.login_type === 'sso') {
            postMessageData.token = data.token;
            postMessageData.email = data.email;
            postMessageData.hasPendingTransaction = data.has_pending_transaction;
            postMessageData.hasActiveSubscription = data.has_active_subscription;
            postMessageData.hasProfile = data.has_profile;
            postMessageData.isLoggedIn = true;
            postMessageData.accountType = data.account_type;
          }
          broadcastChannel.postMessage(postMessageData);
          setTimeout(() => {
            window.close();
          }, 500);
        },
        onError: (err: any) => {
          setErrorMessage(err);
        },
      };
      mutate(data, callbackRequest);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/login';
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div className='w-screen h-screen flex justify-center items-center'>
          <div className='fixed z-20 inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0'>
              <div className='fixed inset-0 transition-opacity'>
                <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
              </div>
              <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
              <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6'>
                <div className='text-center sm:text-left'>
                  <div className='mt-2 sm:p-6 flex justify-center'>
                    <svg className='h-[56px] w-[83] mr-3 animate-spin' viewBox='0 0 24 24'>
                      <circle cx='12' cy='12' r='10' stroke='#2757ED' strokeWidth='4' fill='none' />
                      <path
                        fill='#2757ED'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20.735a8 8 0 008-8h4a12 12 0 01-12 12v-4.265zM20 12a8 8 0 01-8 8v4.265a12 12 0 0012-12h-4zm-8-6.735a8 8 0 018-8v-4.265a12 12 0 00-12 12h4z'
                      />
                    </svg>
                  </div>
                  <h1 className='text-center text-blue-600 text-[32px] font-bold'>PENDING</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isSuccess && (
        <div className='w-screen h-screen flex justify-center items-center'>
          <div className='fixed z-20 inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0'>
              <div className='fixed inset-0 transition-opacity'>
                <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
              </div>
              <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
              <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6'>
                <div className='text-center sm:text-left'>
                  <div className='mt-2 sm:p-6 flex justify-center'>
                    <svg width='56' height='83' viewBox='0 0 104 104' fill='5cb85c' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M51.5309 0C23.0704 0 0 23.0704 0 51.5309C0 79.9914 23.0704 103.062 51.5309 103.062C79.9914 103.062 103.062 79.9914 103.062 51.5309C103.062 23.0704 79.9914 0 51.5309 0ZM56.684 77.2964H46.3778V66.9902H56.684V77.2964ZM56.684 56.684H46.3778L43.8013 25.7655H59.2605L56.684 56.684Z'
                        fill='#5cb85c'
                      />
                    </svg>
                  </div>
                  <h1 className='text-center text-[#5cb85c] text-[32px] font-bold'>SUCCESS</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isError && (
        <div className='w-screen h-screen flex justify-center items-center'>
          <div className='fixed z-20 inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0'>
              <div className='fixed inset-0 transition-opacity'>
                <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
              </div>
              <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
              <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6'>
                <div className='text-center sm:text-left'>
                  <div className='mt-2 sm:p-6 flex justify-center'>
                    <svg width='56' height='83' viewBox='0 0 104 104' fill='d65846' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M51.5309 0C23.0704 0 0 23.0704 0 51.5309C0 79.9914 23.0704 103.062 51.5309 103.062C79.9914 103.062 103.062 79.9914 103.062 51.5309C103.062 23.0704 79.9914 0 51.5309 0ZM56.684 77.2964H46.3778V66.9902H56.684V77.2964ZM56.684 56.684H46.3778L43.8013 25.7655H59.2605L56.684 56.684Z'
                        fill='#d65846'
                      />
                    </svg>
                  </div>
                  <h1 className='text-center text-[#d65846] text-[32px] font-bold'>ERROR</h1>
                  <h1 className='text-xl text-center'>{errorMessage}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {errorParam === 'access_denied' && (
        <div className='w-screen h-screen flex justify-center items-center'>
          <div className='fixed z-20 inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0'>
              <div className='fixed inset-0 transition-opacity'>
                <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
              </div>
              <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
              <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6'>
                <div className='text-center sm:text-left'>
                  <div className='mt-2 sm:p-6 flex justify-center'>
                    <svg width='56' height='83' viewBox='0 0 104 104' fill='d65846' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M51.5309 0C23.0704 0 0 23.0704 0 51.5309C0 79.9914 23.0704 103.062 51.5309 103.062C79.9914 103.062 103.062 79.9914 103.062 51.5309C103.062 23.0704 79.9914 0 51.5309 0ZM56.684 77.2964H46.3778V66.9902H56.684V77.2964ZM56.684 56.684H46.3778L43.8013 25.7655H59.2605L56.684 56.684Z'
                        fill='#d65846'
                      />
                    </svg>
                  </div>
                  <h1 className='text-center text-[#d65846] text-[32px] font-bold'>Access Denied</h1>
                  <h1 className='text-xl text-center'>You have denied access to the application.</h1>
                  <h2 className='text-lg text-center'>Redirecting to login in {countdown} seconds...</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Content;
