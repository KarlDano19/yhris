'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';

interface VerificationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  email: string;
  onResendCode?: () => void;
  initialLoading?: boolean;
}

const VerificationCodeModal = ({ isOpen, onClose, onSubmit, email, onResendCode, initialLoading = false }: VerificationCodeModalProps) => {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [cooldown, setCooldown] = useState<number>(0);
  const [isResending, setIsResending] = useState<boolean>(initialLoading);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cooldown]);

  useEffect(() => {
    if (isOpen && initialLoading) {
      setIsResending(true);
      
      const initialLoadingDelay = 500;
      
      const timer = setTimeout(() => {
        setIsResending(false);
        setCooldown(30);
      }, initialLoadingDelay);
      
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setVerificationCode('');
      setIsResending(false);
      setCooldown(0);
    }
  }, [isOpen, initialLoading]);

  const handleSubmit = () => {
    if (verificationCode) {
      onSubmit(verificationCode);
    }
  };

  const handleResendCode = async () => {
    if (onResendCode && cooldown === 0) {
      setIsResending(true);
      try {
        await onResendCode();
        setCooldown(30);
      } catch (error: any) {
        if (error && typeof error.cooldown_remaining === 'number') {
          setCooldown(error.cooldown_remaining);
        }
      } finally {
        setIsResending(false);
      }
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="flex bg-[#355FD0] p-4 items-center">
                  <Dialog.Title as="h3" className="flex-1 text-white ml-2 font-semibold text-lg">
                    Enter Verification Code
                  </Dialog.Title>
                  <XCircleIcon 
                    className="w-8 h-8 text-white cursor-pointer" 
                    onClick={onClose}
                  />
                </div>

                <div className="px-6 pt-6 pb-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Please enter the verification code sent to {email}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter verification code"
                        value={verificationCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
                        className="rounded-md appearance-none w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={cooldown > 0 || isResending}
                        className={`text-sm text-[#355FD0] hover:text-[#2347B2] ${(cooldown > 0 || isResending) ? 'text-gray-400 cursor-not-allowed pointer-events-none' : ''}`}
                      >
                        {isResending ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#355FD0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending verification code...
                          </span>
                        ) : cooldown > 0 ? (
                          `Wait ${cooldown}s to resend code`
                        ) : (
                          "Didn't receive a code? Click to resend"
                        )}
                      </button>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!verificationCode}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#355FD0] rounded-md hover:bg-[#2347B2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default VerificationCodeModal; 