import { Dispatch, Fragment, useEffect, useState, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';

interface ProgressModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  onConfirm: () => void;
  title: string;
  subtitle?: string;
  isProcessing: boolean;
  onSuccess?: () => void;
  progressColor?: string;
}

export default function ProgressModal({
  isOpen,
  setIsOpen,
  onConfirm,
  title,
  subtitle = "Please wait while we process your request",
  isProcessing,
  onSuccess,
  progressColor = "#FFC107"
}: ProgressModalProps) {
  const cancelButtonRef = useRef(null);
  const [progress, setProgress] = useState<number>(0);
  const [hasTriggeredApiCall, setHasTriggeredApiCall] = useState<boolean>(false);
  const hasCalledSuccess = useRef<boolean>(false);

  // Start progress animation when modal opens and API is processing
  useEffect(() => {
    if (isOpen && isProcessing && !hasTriggeredApiCall) {
      let currentProgress = 3;
      setProgress(currentProgress);
      
      const interval = setInterval(() => {
        const increment = Math.floor(Math.random() * 5) + 1;
        currentProgress = Math.min(currentProgress + increment, 95);
        setProgress(currentProgress);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, isProcessing, hasTriggeredApiCall]);

  // Trigger API call immediately when modal opens
  useEffect(() => {
    if (isOpen && !hasTriggeredApiCall) {
      setHasTriggeredApiCall(true);
      onConfirm();
    }
  }, [isOpen, hasTriggeredApiCall, onConfirm]);

  // Handle API completion - complete progress to 100% and close modal
  useEffect(() => {
    if (!isProcessing && hasTriggeredApiCall && !hasCalledSuccess.current) {
      hasCalledSuccess.current = true;
      setProgress(100);
      
      // Close modal after showing 100% briefly
      setTimeout(() => {
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 500);
    }
  }, [isProcessing, hasTriggeredApiCall, setIsOpen, onSuccess]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setHasTriggeredApiCall(false);
      hasCalledSuccess.current = false;
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog 
        as='div' 
        className='relative z-[9999]' 
        initialFocus={cancelButtonRef} 
        onClose={() => {
          // Only allow closing if processing is not in progress
          if (!isProcessing) {
            handleClose();
          }
        }}
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
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-[500px]'>
                <div className='text-center px-8 pt-10 pb-7'>
                  <div className='text-xl pb-6'>
                    <p className='text-xl text-gray-600 font-bold'>
                      {title}
                    </p>
                    <p className='text-sm text-gray-500 mt-2'>
                      {subtitle}
                    </p>
                  </div>
                  <div className='w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden'>
                    <div
                      className='h-6 font-medium text-white text-center p-0.5 leading-none rounded-full transition-all ease-out duration-300'
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: progressColor
                      }}
                    >
                      {progress}%
                    </div>
                  </div>
                  <div className='mt-4 text-sm text-gray-500'>
                    <p>Do not close this modal</p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}