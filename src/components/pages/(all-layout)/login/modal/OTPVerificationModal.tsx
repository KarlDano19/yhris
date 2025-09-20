'use client';

import { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import useOTPVerification from '@/components/pages/(all-layout)/login/hooks/useOTPVerification';
import useOTPResend from '@/components/pages/(all-layout)/login/hooks/useOTPResend';

import { XCircleIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

interface OTPVerificationModalProps {
  email: string;
  sessionId: string;
  expiresAt: string;
  remainingAttempts: number;
  timeRemainingSeconds: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  email,
  sessionId,
  expiresAt,
  remainingAttempts,
  timeRemainingSeconds,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [otpCode, setOtpCode] = useState<string[]>(new Array(6).fill(''));
  const [timeRemaining, setTimeRemaining] = useState<number>(timeRemainingSeconds);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(false); // NEW: Add remember device state
  const [currentRemainingAttempts, setCurrentRemainingAttempts] = useState<number>(remainingAttempts); // Track attempts internally
  const [resendCooldown, setResendCooldown] = useState<number>(0); // NEW: Resend cooldown timer

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verifyOTP, isLoading: isVerifying } = useOTPVerification();
  const { mutate: resendOTP, isLoading: isResendLoading } = useOTPResend();

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (!isOpen || resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, resendCooldown]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtpCode(new Array(6).fill(''));
      setTimeRemaining(timeRemainingSeconds); 
      setIsResending(false);
      setCurrentRemainingAttempts(remainingAttempts); // Reset attempts counter
      setResendCooldown(0); // Reset resend cooldown
    }
  }, [isOpen, timeRemainingSeconds, remainingAttempts]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length === 6) {
      const newOtpCode = pastedData.split('');
      setOtpCode(newOtpCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = () => {
    // If no attempts remaining, trigger resend instead
    if (currentRemainingAttempts <= 0) {
      handleResendOTP();
      return;
    }

    const otpString = otpCode.join('');
    if (!otpString || otpString.length !== 6) {
      toast.custom(() => <CustomToast message='Please enter the complete 6-digit OTP code' type='error' />, {
        duration: 4000,
      });
      return;
    }

    const payload = {
      session_id: sessionId,
      code: otpString,
      email: email,
      remember_device: rememberDevice, // NEW: Include remember device option
    };

    const callbackReq = {
      onSuccess: (data: any) => {
        onSuccess(data);
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
          duration: 4000,
        });
      },
      onError: (err: any) => {
        // Extract remaining attempts from error message
        // Error format: "Invalid OTP code. X attempt(s) remaining."
        const attemptMatch = err.match(/(\d+)\s+attempt\(s\)\s+remaining/);
        if (attemptMatch) {
          const remaining = parseInt(attemptMatch[1], 10);
          setCurrentRemainingAttempts(remaining);
        } else {
          // If no attempts info in error, assume we used one attempt
          setCurrentRemainingAttempts(Math.max(0, currentRemainingAttempts - 1));
        }
        
        // Clear OTP input for next attempt
        setOtpCode(new Array(6).fill(''));
        
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 4000,
        });
      },
    };

    verifyOTP(payload, callbackReq);
  };

  const handleResendOTP = () => {
    if (isResending || resendCooldown > 0) return;

    const payload = {
      session_id: sessionId,
    };

    const callbackReq = {
      onSuccess: (data: any) => {
        setIsResending(false);
        setTimeRemaining(data.time_remaining_seconds || 300); // 5 minutes default
        
        // Set 30-second cooldown for next resend
        setResendCooldown(30);
        
        // Reset attempts counter when new OTP is sent
        if (data.remaining_attempts) {
          setCurrentRemainingAttempts(data.remaining_attempts);
        } else {
          // Default to 3 attempts if not specified
          setCurrentRemainingAttempts(3);
        }
        
        // Clear any entered OTP
        setOtpCode(new Array(6).fill(''));
        
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
          duration: 4000,
        });
      },
      onError: (err: any) => {
        setIsResending(false);
        
        // Extract cooldown time from error message if it's a rate limit error
        if (err.includes('Please wait') && err.includes('second(s)')) {
          const secondsMatch = err.match(/(\d+) second\(s\)/);
          if (secondsMatch) {
            const seconds = parseInt(secondsMatch[1], 10);
            setResendCooldown(seconds);
          }
        }
        
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 4000,
        });
      },
    };

    setIsResending(true);
    resendOTP(payload, callbackReq);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isExpired = timeRemaining <= 0;
  const isOtpComplete = otpCode.join('').length === 6;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-50 overflow-y-auto flex items-center justify-center'
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-50' />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center'>
                <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10'>
                  <EnvelopeIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />
                </div>
                <div className='ml-3'>
                  <Dialog.Title as='h3' className='text-lg leading-6 font-medium text-gray-900'>
                    Enter Verification Code
                  </Dialog.Title>
                  <p className='text-sm text-gray-500'>We sent a code to {email}</p>
                </div>
              </div>
              <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
                <XCircleIcon className='h-6 w-6' />
              </button>
            </div>

            <div className='space-y-4'>
              {/* OTP Input */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Verification Code</label>
                <div className='flex justify-center space-x-2' onPaste={handlePaste}>
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className='w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                      disabled={isVerifying || isExpired || currentRemainingAttempts <= 0}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Remember Device Checkbox */}
              <div className='flex items-center mb-4'>
                <input
                  id='remember-device'
                  type='checkbox'
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label htmlFor='remember-device' className='ml-2 block text-sm text-gray-700'>
                  Remember this device for 14 days
                </label>
              </div>

              {/* Timer and Attempts */}
              <div className='flex justify-between items-center text-sm'>
                <div className='text-gray-600'>
                  {isExpired ? (
                    <span className='text-red-600'>Code expired</span>
                  ) : (
                    <span>Expires in {formatTime(timeRemaining)}</span>
                  )}
                </div>
                <div className={`text-gray-600 ${
                  currentRemainingAttempts <= 0 ? 'text-red-600 font-semibold' : 
                  currentRemainingAttempts === 1 ? 'text-orange-600 font-semibold' : ''
                }`}>
                  {currentRemainingAttempts <= 0 ? 'No attempts remaining' : `${currentRemainingAttempts} attempts remaining`}
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col space-y-3'>
                <button
                  type='button'
                  onClick={handleVerifyOTP}
                  disabled={isVerifying || isExpired || (currentRemainingAttempts > 0 && !isOtpComplete)}
                  className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:text-sm'
                >
                  {isVerifying ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Verifying...
                    </>
                  ) : currentRemainingAttempts <= 0 ? (
                    'Request New OTP'
                  ) : (
                    'Verify Code'
                  )}
                </button>

                <button
                  type='button'
                  onClick={handleResendOTP}
                  disabled={isResendLoading || isResending || resendCooldown > 0}
                  className='w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:text-sm'
                >
                  {isResendLoading || isResending ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend Code (${resendCooldown}s)`
                  ) : (
                    'Resend Code'
                  )}
                </button>

                <button
                  type='button'
                  onClick={onClose}
                  className='w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default OTPVerificationModal;
