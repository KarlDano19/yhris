'use client';

import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

import ModalLayout from '@/components/ModalLayout';
import updateSession from '@/helpers/updateSession';
import GoogleIcon from '@/svg/GoogleIcon';

import { ACCESS_TOKEN_LIFETIME_SECONDS } from '@/lib/session';

interface ApplyNowModalProps {
  isOpen: boolean;
  handleClose: () => void;
  jobId: number | string;
}

const ApplyNowModal = ({ isOpen, handleClose, jobId }: ApplyNowModalProps) => {
  const router = useRouter();
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const redirectUrl = `/job-applicant-form/${jobId}`;

  const handleSSOData = (data: any) => {
    setCookie('token', data.token, {
      maxAge: ACCESS_TOKEN_LIFETIME_SECONDS,
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
    });
    updateSession({
      token: data.token,
      email: data.email,
      hasPendingTransaction: data.has_pending_transaction,
      hasActiveSubscription: data.has_active_subscription,
      hasProfile: data.has_profile,
      accountType: data.account_type,
      loginType: data.login_type,
      isLoggedIn: true,
    }).finally(() => {
      if (data.has_profile) {
        location.href = redirectUrl;
      } else {
        location.href = `/setup-applicant-profile?redirect=${encodeURIComponent(redirectUrl)}`;
      }
    });
  };

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

  // Primary: postMessage listener
  useEffect(() => {
    const handlePostMessage = (event: MessageEvent) => {
      if (event.data?.isGranted && event.data?.login_type === 'google') {
        handleSSOData(event.data);
      }
    };
    window.addEventListener('message', handlePostMessage);
    return () => window.removeEventListener('message', handlePostMessage);
  }, [jobId]);

  // Secondary: BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('integration-channel');
    broadcastChannelRef.current = channel;
    channel.onmessage = (event) => {
      if (event.data?.isGranted && event.data?.login_type === 'google') {
        handleSSOData(event.data);
      }
    };
    return () => {
      channel.close();
      broadcastChannelRef.current = null;
    };
  }, [jobId]);

  // Fallback: localStorage storage event
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'sso_result' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          if (data?.isGranted && data?.login_type === 'google') {
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
  }, [jobId]);

  const handleSignInWithGoogle = () => {
    localStorage.removeItem('sso_result');
    localStorage.setItem('postAuthRedirect', redirectUrl);
    localStorage.setItem('google_sso_account_type', 'applicant');
    const left = (window.innerWidth - 500) / 2;
    const top = (window.innerHeight - 600) / 2;
    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sso/login/google-login/`,
      'popup',
      `width=500,height=600,left=${left},top=${top}`
    );
    const check = setInterval(() => {
      if (popup?.closed) {
        clearInterval(check);
        setTimeout(() => consumeStoredSSOResult(), 300);
      }
    }, 500);
  };

  const handleApplyWithAccount = () => {
    router.push(`/register?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  const handleContinueAsGuest = () => {
    router.push(`/job-app-form/${jobId}`);
  };

  const handleLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title='How would you like to apply?' maxWidth='max-w-xl'>
      <div className='px-6 py-5'>
        <div className='flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] gap-4 sm:items-center'>
          {/* Left: all 3 sign-in options + benefits */}
          <div className='flex flex-col gap-3'>
            <button
              onClick={handleSignInWithGoogle}
              className='w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50'
            >
              <GoogleIcon className='w-4 h-4' />
              Sign in with Google
            </button>
            <button
              onClick={handleApplyWithAccount}
              className='w-full rounded-md bg-savoy-blue py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400'
            >
              Create an Account
            </button>
            <button
              onClick={handleLogin}
              className='w-full rounded-md border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50'
            >
              Login to Existing Account
            </button>
            <ul className='mt-1 flex flex-col gap-1.5'>
              {[
                'Track your application status.',
                'Chat directly with employers.',
                'Save jobs for later.',
                'Receive notifications.',
              ].map((benefit) => (
                <li key={benefit} className='flex items-start gap-1.5 text-xs text-gray-500'>
                  <span className='mt-0.5 text-savoy-blue'>✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider — horizontal on mobile, vertical on sm+ */}
          <div className='flex sm:flex-col items-center sm:self-stretch'>
            <div className='flex-1 h-px sm:h-auto sm:w-px bg-gray-200' />
            <span className='text-xs text-gray-400 font-medium px-3 sm:px-0 sm:py-2'>or</span>
            <div className='flex-1 h-px sm:h-auto sm:w-px bg-gray-200' />
          </div>

          {/* Right: guest */}
          <div className='flex flex-col items-center justify-center gap-3'>
            <button
              onClick={handleContinueAsGuest}
              className='w-full rounded-md border border-[#FFC107] bg-[#FFC107] py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-amber-500'
            >
              Continue without Account
            </button>
          </div>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ApplyNowModal;
