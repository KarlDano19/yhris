'use client';

import { useState, useEffect, useRef } from 'react';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { useForm } from 'react-hook-form';
import { setCookie } from 'cookies-next';
import toast from 'react-hot-toast';

import useLogin from '@/components/pages/(all-layout)/login/hooks/useLogin';
import updateSession from '@/helpers/updateSession';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import SplitLayout from '@/components/SplitView';
import FloatingHelpButton from '@/components/FloatingHelpButton';
import EmailVerificationModal from './modal/EmailVerificationModal';
import OTPVerificationModal from './modal/OTPVerificationModal';

import { EnvelopeIcon, LockClosedIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/24/solid';
import SplitViewBg from '@/assets/split-view-bg.png';
import GoogleIcon from '@/svg/GoogleIcon';
import MainIconOnly from '@/svg/MainIconOnly';
import FacebookRoundedIcon from '@/svg/FacebookRoundedIcon';
import YahshuaPayrollLogo from '@/svg/YahshuaPayrollLogo';
import ChevronLeftIcon from '@/svg/ChevronLeft';

import { T_Login } from '@/types/globals';
import { ACCESS_TOKEN_LIFETIME_SECONDS } from '@/lib/session';

function Content() {
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showCreateAccountModal, setCreateAccountModal] = useState(false);
  const [showEmailVerificationModal, setEmailVerificationModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpData, setOtpData] = useState<any>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  
  // NEW: Rate limiting timer states
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  const { mutate, isLoading } = useLogin();
  const { register, getValues, handleSubmit, formState: { errors } } = useForm<T_Login>();

  // Check if user is already logged in and redirect if so
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/get-session');
        const sessionData = await response.json();
        
        if (sessionData.isLoggedIn) {
          // User is already logged in, redirect appropriately
          if (sessionData.accountType === 'employer') {
            const returnTo = searchParams.get('redirect') || '/dashboard';
            window.location.href = returnTo;
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
  }, [router, searchParams]);

  // NEW: Function to extract time from error message
  const extractTimeFromError = (errorMessage: string) => {
    // Extract minutes and seconds from messages like:
    // "Too many OTP requests. Please try again in 45 minute(s) and 23 second(s)."
    // "Please wait 15 second(s) before requesting another code."
    const minutesMatch = errorMessage.match(/(\d+) minute\(s\)/);
    const secondsMatch = errorMessage.match(/(\d+) second\(s\)/);
    
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;
    
    return (minutes * 60) + seconds;
  };

  // NEW: Format countdown display
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  // NEW: Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRateLimited && rateLimitCountdown > 0) {
      timer = setInterval(() => {
        setRateLimitCountdown((prev) => {
          if (prev <= 1) {
            setIsRateLimited(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRateLimited, rateLimitCountdown]);

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
      onSuccess: (response: any) => {
        // Reset rate limit state on success
        setIsRateLimited(false);
        setRateLimitCountdown(0);
        
        if (response.otp_required) {
          // Show OTP modal
          setOtpData({
            sessionId: response.session_id,
            expiresAt: response.expires_at,
            remainingAttempts: response.remaining_attempts,
            timeRemainingSeconds: response.time_remaining_seconds,
            email: data.email
          });
          setShowOTPModal(true);
          toast.custom(() => <CustomToast message={response.message} type='success' />, { duration: 4000 });
        } else if (response.is_valid) {
          setSession(response);
          toast.custom(() => <CustomToast message={response.message} type='success' />, { duration: 4000 });
        } else {
          setEmailVerificationModal(true);
        }
      },
      onError: (err: any) => {
        // Check if this is a rate limit error
        if (err.includes('Too many OTP requests') || err.includes('Please wait')) {
          const timeRemaining = extractTimeFromError(err);
          if (timeRemaining > 0) {
            setIsRateLimited(true);
            setRateLimitCountdown(timeRemaining);
          }
        }
        
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(data, callbackReq);
  });

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

  const handleOTPSuccess = (data: any) => {
    setSession(data);
    setShowOTPModal(false);
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
        toast.custom(() => <CustomToast message='Session sync failed — redirecting anyway. If issues persist, please contact support.' type='error' />, { duration: 5000 });
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

  const loginWithYahshuaPayroll = () => {
    // Clear any stale SSO result before starting
    localStorage.removeItem('sso_result');

    const left = (window.innerWidth - 900) / 2;
    const top = (window.innerHeight - 700) / 2;
    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sso/login/yahshua-payroll-oauth`,
      'popup',
      `width=900, height=900, left=${left}, top=${top}`
    );
    const checkOAuthStatus = setInterval(function () {
      if (popup?.closed) {
        clearInterval(checkOAuthStatus);
        // Last-resort: poll localStorage after popup closes.
        // Catches cases where BroadcastChannel and the storage event
        // both fail (e.g. macOS Chrome cross-origin popup isolation).
        setTimeout(() => consumeStoredSSOResult(), 300);
      }
    }, 500);
  };

  // Show the login page but redirect if already logged in
  if (isCheckingSession) {
    // Still show the layout/header while checking
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
                <div className='p-6 space-y-4 sm:p-8'>
                  <div className='mb-9'>
                    <h1 className='text-2xl text-center font-bold leading-none tracking-tight text-indigo-dye lg:text-[45px] mb-4'>
                      Welcome back!
                    </h1>
                    <p className='text-center text-[#6F829B]'>Start managing your people faster and better.</p>
                  </div>
                  <form method='POST' onSubmit={onSubmit}>
                    <div className='mb-5'>
                      <div className='relative'>
                        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                          <EnvelopeIcon className='h-5 w-5 text-savoy-blue' aria-hidden='true' />
                        </div>
                        <input
                          type='email'
                          id='email'
                          {...register('email', { required: "Please enter an email address" })}
                          className='bg-gray-50 border border-gray-300 text-gray-900 pl-11 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                          placeholder='Email'
                          tabIndex={1}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div className='mb-3'>
                      <div className='relative mx-auto'>
                        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                          <LockClosedIcon className='h-5 w-5 text-savoy-blue' aria-hidden='true' />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id='password'
                          {...register('password', { required: "Please enter your password" })}
                          className='bg-gray-50 border border-gray-300 text-gray-900 pl-11 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                          placeholder='Password'
                          tabIndex={2}
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
                    </div>
                    <Link
                      href='/forgot-password'
                      className='text-sm font-semibold text-blue-600 hover:underline float-right mb-5'
                      tabIndex={4}
                    >
                      Forgot password?
                    </Link>
                    <button
                      type='submit'
                      id='login-button'
                      className='w-full uppercase text-white bg-blue-600 enabled:hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center mb-5 disabled:opacity-50'
                      tabIndex={5}
                      disabled={isLoading || isRateLimited}
                    >
                      {isLoading && (
                        <LoadingSpinner size="sm" color="blue" />
                      )}
                      {isRateLimited ? (
                        `Please wait ${formatCountdown(rateLimitCountdown)}`
                      ) : !isLoading ? (
                        'Sign in'
                      ) : null}
                    </button>
                    
                    {/* Rate limit visual indicator */}
                    {isRateLimited && (
                      <div className="text-center text-sm text-orange-600 mb-3">
                        <div className="flex items-center justify-center gap-2">
                          <LoadingSpinner size="xs" color="red" />
                          <span>Too many requests. Please wait {formatCountdown(rateLimitCountdown)}</span>
                        </div>
                      </div>
                    )}
                    
                    <p className='text-sm font-light text-gray-500 text-center mb-9'>
                      Don&apos;t have an account yet?{' '}
                      <Link id='sign-up-link' href='/register' className='font-semibold text-blue-600 hover:underline'>
                        Sign Up here
                      </Link>
                    </p>
                  </form>
                  <div className='border-t text-gray-400 border-gray-400 flex justify-center'>
                    <span className='absolute -translate-y-[15px] bg-white px-8'>or</span>
                  </div>
                  <div className='mb-5 relative'>
                    <button
                      id='google-login-button'
                      className='flex lg:w-full items-center justify-center text-indigo-dye mt-8 lg:mt-4 font-semibold bg-white border border-gray-400 w-full lg:px-12 py-2.5 rounded-md disabled:opacity-50'
                      onClick={() => setCreateAccountModal(true)}
                      disabled={true}
                    >
                      <GoogleIcon className='w-4 h-4 mr-2' /> Google
                    </button>
                    <button
                      id='facebook-login-button'
                      className='flex items-center justify-center text-indigo-dye mt-4 font-semibold bg-white border border-gray-400 w-full lg:w-full lg:px-10 py-2.5 rounded-md disabled:opacity-50'
                      onClick={() => setCreateAccountModal(true)}
                      disabled={true}
                    >
                      <FacebookRoundedIcon className='w-4 h-4 mr-2' /> Facebook
                    </button>
                    <div className="relative w-full lg:w-full group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg opacity-100 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-timed"></div>
                      <button
                        id='yahshua-payroll-login-button'
                        className='relative flex items-center justify-center text-indigo-dye mt-4 font-semibold bg-white w-full lg:w-full lg:px-10 py-2.5 rounded-md disabled:opacity-50 transition-all duration-300 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] animate-button-border-timed'
                        onClick={() => loginWithYahshuaPayroll()}
                      >
                        <YahshuaPayrollLogo className='w-4 h-4 mr-2' />
                        YAHSHUA Payroll
                      </button>
                      <style jsx>{`
                        @keyframes gradient-timed {
                          0% {
                            background-size: 400% 400%;
                            background-position: left center;
                            opacity: 1;
                          }
                          15% {
                            background-size: 200% 200%;
                            background-position: right center;
                            opacity: 1;
                          }
                          30% {
                            background-size: 400% 400%;
                            background-position: left center;
                            opacity: 1;
                          }
                          45% {
                            background-size: 200% 200%;
                            background-position: right center;
                            opacity: 1;
                          }
                          60% {
                            background-size: 400% 400%;
                            background-position: left center;
                            opacity: 1;
                          }
                          75% {
                            opacity: 1;
                          }
                          100% {
                            opacity: 0;
                            background-size: 400% 400%;
                            background-position: left center;
                          }
                        }
                        @keyframes button-border-timed {
                          0% {
                            border: none;
                          }
                          75% {
                            border: none;
                          }
                          100% {
                            border: 1px solid #9CA3AF;
                          }
                        }
                        .animate-gradient-timed {
                          animation: gradient-timed 5s ease forwards;
                          background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899, #06b6d4, #3b82f6);
                        }
                        .animate-button-border-timed {
                          animation: button-border-timed 5s ease forwards;
                        }
                      `}</style>
                    </div>
                  </div>
                  <div className='text-sm'>
                    By continuing, you agree to our{' '}
                    <Link id='terms-of-service-link' href='/terms-of-service' target='_blank' className='text-[#355FD0] underline'>
                      Terms of Service
                    </Link>
                    , and{' '}
                    <Link id='privacy-notice-link' href='/privacy-notice' target='_blank' className='text-[#355FD0] underline'>
                      Privacy Notice
                    </Link>
                    .
                  </div>
                </div>
              </div>
              <EmailVerificationModal
                email={getValues('email')}
                isOpen={showEmailVerificationModal}
                onClose={() => setEmailVerificationModal(false)}
              />
              {otpData && (
                <OTPVerificationModal
                  email={otpData.email}
                  sessionId={otpData.sessionId}
                  expiresAt={otpData.expiresAt}
                  remainingAttempts={otpData.remainingAttempts}
                  timeRemainingSeconds={otpData.timeRemainingSeconds}
                  isOpen={showOTPModal}
                  onClose={() => setShowOTPModal(false)}
                  onSuccess={handleOTPSuccess}
                />
              )}
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