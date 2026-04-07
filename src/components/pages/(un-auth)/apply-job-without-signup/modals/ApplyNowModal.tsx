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

  // const handleContinueAsGuest = () => {
  //   router.push(`/job-app-form/${jobId}`);
  // };

  const handleLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title='How would you like to apply?' maxWidth='max-w-sm'>
      <div className='px-6 py-5'>
        <p className='text-sm text-gray-600 mb-6'>
          Applying with an account lets you chat with the employer and track your application status.
        </p>
        <div className='flex flex-col gap-3'>
          <button
            onClick={handleSignInWithGoogle}
            className='w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50'
          >
            <GoogleIcon className='w-4 h-4' />
            Sign in with Google
          </button>
          <button
            onClick={handleApplyWithAccount}
            className='w-full rounded-md bg-savoy-blue py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Register with Account
          </button>
          <button
            onClick={handleLogin}
            className='w-full rounded-md border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50'
          >
            Login to Existing Account
          </button>
          {/* <button
            onClick={handleContinueAsGuest}
            className='w-full rounded-md border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50'
          >
            Continue as Guest
          </button> */}
        </div>
      </div>
    </ModalLayout>
  );
};

export default ApplyNowModal;
