'use client';

import { Fragment, useRef } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TourCompletionModal = ({ isOpen, onClose }: Props) => {
  const closeButtonRef = useRef(null);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-30"
        initialFocus={closeButtonRef}
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md">
                {/* Header */}
                <div className="flex bg-savoy-blue p-2 items-center gap-4">
                  <h3 className="flex-1 text-white ml-2 font-semibold">Setup Complete!</h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer self-start"
                    onClick={onClose}
                  />
                </div>

                {/* Body */}
                <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
                  <CheckCircleIcon className="w-16 h-16 text-savoy-blue" />

                  <div>
                    <h4 className="text-lg font-bold text-indigo-dye mb-2">
                      You&apos;re all set! 🎉
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Congratulations! Your YAHSHUA HRIS is now set up and ready to use.
                      You can now start managing your HR operations efficiently.
                    </p>
                  </div>

                  <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    className="mt-2 w-full bg-savoy-blue hover:opacity-90 active:opacity-80 text-white font-semibold py-2.5 px-6 rounded-lg transition-opacity shadow-sm"
                  >
                    Start Using YAHSHUA HRIS
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TourCompletionModal;
