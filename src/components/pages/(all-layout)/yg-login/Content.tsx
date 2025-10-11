'use client';

import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { setCookie } from 'cookies-next';

import updateSession from '@/helpers/updateSession';
import SplitLayout from '@/components/SplitView';
import FloatingHelpButton from '@/components/FloatingHelpButton';

import SplitViewBg from '@/assets/split-view-bg.png';
import MainIconOnly from '@/svg/MainIconOnly';
import YahshuaPayrollLogo from '@/svg/YahshuaPayrollLogo';

function Content() {
  const broadcastChannel = new BroadcastChannel('integration-channel');
  const searchParams = useSearchParams();

  const setSession = async (data: any) => {
    setCookie('token', data.token, {
      maxAge: 60 * 60 * 3,
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

  const setSSOSession = async (data: any) => {
    await updateSession({
      token: data.token,
      email: data.email,
      hasPendingTransaction: data.has_pending_transaction,
      hasActiveSubscription: data.has_active_subscription,
      hasProfile: data.has_profile,
      accountType: data.account_type,
      loginType: data.login_type,
      isLoggedIn: true,
    });
    setSession(data);
  };

  useEffect(() => {
    broadcastChannel.onmessage = (event) => {
      if (event.data.isGranted) {
        setSSOSession(event.data);
      }
    };
    return () => {
      broadcastChannel.close();
    };
  }, []);

  const loginWithYGPayroll = () => {
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
      }
    }, 1000);
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
