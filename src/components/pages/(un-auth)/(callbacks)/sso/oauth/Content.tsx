'use client';

import { useEffect, useState } from 'react';

import { LockClosedIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/solid';

import { useParams, useSearchParams } from 'next/navigation';

import useVerifyOauth from './hooks/useVerifyOauth';
import useGoogleLoginComplete from './hooks/useGoogleLoginComplete';
import useGoogleLoginLink from './hooks/useGoogleLoginLink';

function Content() {
  const broadcastChannel = new BroadcastChannel('integration-channel');
  const params = useParams();
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const error = searchParams.get('error') || '';
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [needsAccountType, setNeedsAccountType] = useState<boolean>(false);
  const [emailConflict, setEmailConflict] = useState<boolean>(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string>('');
  const [selectedAccountType, setSelectedAccountType] = useState<string>('applicant');
  const [linkPassword, setLinkPassword] = useState<string>('');
  const [showLinkPassword, setShowLinkPassword] = useState<boolean>(false);
  const { mutate, isLoading, isError, isSuccess } = useVerifyOauth();
  const { mutate: completeGoogleLogin, isLoading: isCompletingGoogle } = useGoogleLoginComplete();
  const { mutate: linkGoogleAccount, isLoading: isLinking } = useGoogleLoginLink();

  const postAndClose = (postMessageData: any) => {
    try {
      window.opener?.postMessage(postMessageData, '*');
    } catch (e) {
      console.warn('window.opener.postMessage failed:', e);
    }
    try {
      broadcastChannel.postMessage(postMessageData);
    } catch (e) {
      console.warn('BroadcastChannel postMessage failed:', e);
    }
    try {
      localStorage.setItem('sso_result', JSON.stringify({ ...postMessageData, _ts: Date.now() }));
    } catch (e) {
      console.warn('localStorage SSO fallback failed:', e);
    }
    setTimeout(() => {
      window.close();
    }, 1500);
  };

  useEffect(() => {
    if (isError) {
      setHasError(true);
    }
  }, [isError]);

  useEffect(() => {
    if (code) {
      const data = {
        code: code,
        provider: params?.provider,
      };
      const callbackRequest = {
        onSuccess: (data: any) => {
          // Existing non-applicant account with same email — needs password to link
          if (data.email_conflict) {
            setGoogleAccessToken(data.google_access_token);
            setEmailConflict(true);
            return;
          }

          // New Google user — needs to choose account type before account is created
          if (data.needs_account_type) {
            const presetAccountType = localStorage.getItem('google_sso_account_type');
            localStorage.removeItem('google_sso_account_type');
            if (presetAccountType) {
              // Context already known (e.g. job application flow) — skip the selection form
              completeGoogleLogin(
                { google_access_token: data.google_access_token, account_type: presetAccountType },
                {
                  onSuccess: (created: any) => {
                    postAndClose({
                      isGranted: created.is_granted,
                      provider: params?.provider,
                      token: created.token,
                      email: created.email,
                      has_pending_transaction: created.has_pending_transaction,
                      has_active_subscription: created.has_active_subscription,
                      has_profile: created.has_profile,
                      account_type: created.account_type,
                      login_type: created.login_type,
                    });
                  },
                  onError: (err: any) => {
                    setErrorMessage(typeof err === 'string' ? err : 'Something went wrong. Please try again.');
                    setHasError(true);
                  },
                }
              );
              return;
            }
            setGoogleAccessToken(data.google_access_token);
            setNeedsAccountType(true);
            return;
          }

          const postMessageData: any = {
            isGranted: data.is_granted,
            provider: params?.provider,
          };
          if (['yahshua-payroll', 'yg-payroll', 'google'].includes(data.login_type)) {
            postMessageData.token = data.token;
            postMessageData.email = data.email;
            postMessageData.has_pending_transaction = data.has_pending_transaction;
            postMessageData.has_active_subscription = data.has_active_subscription;
            postMessageData.has_profile = data.has_profile;
            postMessageData.account_type = data.account_type;
            postMessageData.login_type = data.login_type;
          }
          postAndClose(postMessageData);
        },
        onError: (err: any) => {
          setErrorMessage(err);
          setTimeout(() => {
            window.close();
          }, 1000);
        },
      };
      mutate(data, callbackRequest);
    } else if (error) {
      if (error === 'access_denied') {
        setErrorMessage('Access denied');
      } else {
        setErrorMessage(error);
      }
      setHasError(true);
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  }, []);

  const handleGoogleComplete = () => {
    completeGoogleLogin(
      { google_access_token: googleAccessToken, account_type: selectedAccountType },
      {
        onSuccess: (data: any) => {
          const postMessageData: any = {
            isGranted: data.is_granted,
            provider: params?.provider,
            token: data.token,
            email: data.email,
            has_pending_transaction: data.has_pending_transaction,
            has_active_subscription: data.has_active_subscription,
            has_profile: data.has_profile,
            account_type: data.account_type,
            login_type: data.login_type,
          };
          postAndClose(postMessageData);
        },
        onError: (err: any) => {
          setErrorMessage(typeof err === 'string' ? err : 'Something went wrong. Please try again.');
          setHasError(true);
        },
      }
    );
  };

  const handleGoogleLink = () => {
    linkGoogleAccount(
      { google_access_token: googleAccessToken, password: linkPassword },
      {
        onSuccess: (data: any) => {
          const postMessageData: any = {
            isGranted: data.is_granted,
            provider: params?.provider,
            token: data.token,
            email: data.email,
            has_pending_transaction: data.has_pending_transaction,
            has_active_subscription: data.has_active_subscription,
            has_profile: data.has_profile,
            account_type: data.account_type,
            login_type: data.login_type,
          };
          postAndClose(postMessageData);
        },
        onError: (err: any) => {
          setErrorMessage(typeof err === 'string' ? err : 'Something went wrong. Please try again.');
          setHasError(true);
        },
      }
    );
  };

  if (emailConflict) {
    return (
      <div className='w-screen h-screen flex justify-center items-center bg-gray-50'>
        <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-sm mx-4'>
          <h2 className='text-xl font-bold text-gray-900 mb-1 text-center'>Email already registered</h2>
          <p className='text-sm text-gray-500 text-center mb-6'>
            This email is linked to an existing account. Enter your HRIS password to sign in.
          </p>
          <div className='relative mb-3'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <LockClosedIcon className='h-5 w-5 text-savoy-blue' aria-hidden='true' />
            </div>
            <input
              type={showLinkPassword ? 'text' : 'password'}
              placeholder='Password'
              value={linkPassword}
              onChange={(e) => setLinkPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && linkPassword && !isLinking) handleGoogleLink(); }}
              className='bg-gray-50 border border-gray-300 text-gray-900 pl-11 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 flex items-center px-4 text-blue-400'
              onClick={() => setShowLinkPassword(!showLinkPassword)}
            >
              {showLinkPassword ? (
                <EyeIcon className='h-5 w-5 text-savoy-blue' />
              ) : (
                <EyeSlashIcon className='h-5 w-5 text-savoy-blue' />
              )}
            </button>
          </div>
          {hasError && (
            <p className='text-red-500 text-xs text-center mb-3'>{errorMessage}</p>
          )}
          <button
            onClick={handleGoogleLink}
            disabled={isLinking || !linkPassword}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50'
          >
            {isLinking ? (
              <span className='flex items-center justify-center gap-2'>
                <span className='animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full' />
                Signing in...
              </span>
            ) : (
              'SIGN IN'
            )}
          </button>
        </div>
      </div>
    );
  }

  if (needsAccountType) {
    return (
      <div className='w-screen h-screen flex justify-center items-center bg-gray-50'>
        <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-sm mx-4'>
          <h2 className='text-xl font-bold text-gray-900 mb-1 text-center'>You&apos;re almost in!</h2>
          <p className='text-sm text-gray-500 text-center mb-6'>How will you use YAHSHUA HRIS?</p>
          <div className='space-y-3 mb-6'>
            <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedAccountType === 'applicant' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type='radio'
                name='accountType'
                value='applicant'
                checked={selectedAccountType === 'applicant'}
                onChange={() => setSelectedAccountType('applicant')}
                className='text-blue-600'
              />
              <div>
                <p className='font-medium text-gray-900 text-sm'>Applicant</p>
                <p className='text-xs text-gray-500'>I&apos;m looking for jobs</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedAccountType === 'employer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type='radio'
                name='accountType'
                value='employer'
                checked={selectedAccountType === 'employer'}
                onChange={() => setSelectedAccountType('employer')}
                className='text-blue-600'
              />
              <div>
                <p className='font-medium text-gray-900 text-sm'>Employer</p>
                <p className='text-xs text-gray-500'>I&apos;m hiring</p>
              </div>
            </label>
          </div>
          {hasError && (
            <p className='text-red-500 text-xs text-center mb-3'>{errorMessage}</p>
          )}
          <button
            onClick={handleGoogleComplete}
            disabled={isCompletingGoogle}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50'
          >
            {isCompletingGoogle ? (
              <span className='flex items-center justify-center gap-2'>
                <span className='animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full' />
                Creating account...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    );
  }

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
      {hasError && (
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
    </>
  );
}

export default Content;
