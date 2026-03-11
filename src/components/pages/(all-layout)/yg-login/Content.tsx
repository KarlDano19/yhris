'use client';

import { useEffect, useRef } from 'react';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { setCookie } from 'cookies-next';

import updateSession from '@/helpers/updateSession';
import { ACCESS_TOKEN_LIFETIME_SECONDS } from '@/lib/session';
import SplitLayout from '@/components/SplitView';
import FloatingHelpButton from '@/components/FloatingHelpButton';

import SplitViewBg from '@/assets/split-view-bg.png';
import MainIconOnly from '@/svg/MainIconOnly';
import YahshuaPayrollLogo from '@/svg/YahshuaPayrollLogo';

function Content() {
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const searchParams = useSearchParams();

  const setSession = async (data: any) => {
    setCookie('token', data.token, {
      maxAge: ACCESS_TOKEN_LIFETIME_SECONDS,
      sameSite: 'strict',
      httpOnly: false,
      secure: true,
    });

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

  const handleSSOData = (data: any) => {
    updateSession({
      token: data.token,
      email: data.email,
      hasPendingTransaction: data.has_pending_transaction,
      hasActiveSubscription: data.has_active_subscription,
      hasProfile: data.has_profile,
      accountType: data.account_type,
      loginType: data.login_type,
      isLoggedIn: true,
    })
      .catch((err) => {
        console.error('SSO updateSession failed, proceeding with redirect:', err);
      })
      .finally(() => {
        setSession(data);
      });
  };

  // Primary: BroadcastChannel (Chrome, Firefox, modern Safari 15.4+)
  useEffect(() => {
    const channel = new BroadcastChannel('integration-channel');
    broadcastChannelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data.isGranted) {
        handleSSOData(event.data);
      }
    };

    return () => {
      channel.close();
      broadcastChannelRef.current = null;
    };
  }, []);

  // Fallback: localStorage storage event (older Safari, restricted browsers)
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'sso_result' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          if (data?.isGranted) {
            localStorage.removeItem('sso_result');
            handleSSOData(data);
          }
        } catch (e) {
          console.error('SSO localStorage fallback parse error:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  const consumeStoredSSOResult = () => {
    try {
      const stored = localStorage.getItem('sso_result');
      if (stored) {
        const data = JSON.parse(stored);
        if (data?.isGranted) {
          localStorage.removeItem('sso_result');
          handleSSOData(data);
          return true;
        }
      }
    } catch (e) {
      console.error('SSO localStorage poll error:', e);
    }
    return false;
  };

  const loginWithYGPayroll = () => {
    localStorage.removeItem('sso_result');

    const left = (window.innerWidth - 900) / 2;
    const top = (window.innerHeight - 700) / 2;
    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sso/login/yg-payroll-oauth`,
      'popup',
      `width=900, height=900, left=${left}, top=${top}`
    );
    const checkOAuthStatus = setInterval(function () {
      if (popup?.closed) {
        clearInterval(checkOAuthStatus);
        setTimeout(() => consumeStoredSSOResult(), 300);
      }
    }, 500);
  };

  return (
    <>
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
                  <div className='mb-5 relative'>
                    <button
                      className='flex items-center justify-center text-indigo-dye mt-4 font-semibold bg-white border border-gray-400 w-full lg:w-full lg:px-10 py-2.5 rounded-md disabled:opacity-50'
                      onClick={() => loginWithYGPayroll()}
                    >
                      <YahshuaPayrollLogo className='w-4 h-4 mr-2' />
                      YAHSHUA YG Payroll
                    </button>
                  </div>
                  <div className='text-sm'>
                    By continuing, you agree to our{' '}
                    <Link href='/terms-of-service' target='_blank' className='text-[#355FD0] underline'>
                      Terms of Service
                    </Link>
                    , and{' '}
                    <Link href='/privacy-notice' target='_blank' className='text-[#355FD0] underline'>
                      Privacy Notice
                    </Link>
                    .
                  </div>
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
}

export default Content;
