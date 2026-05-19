import { Dispatch, Fragment, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Dialog, Transition } from "@headlessui/react";

import LoadingSpinner from "@/components/LoadingSpinner";

import CheckIcon from "@/svg/CheckIcon";

export default function NavigationModal({
  isOpen,
  setIsOpen,
  jobPostingId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  jobPostingId: string;
}) {
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleGoToOnboarding = () => {
    setIsNavigating(true);
    
    // Navigate immediately
    router.push(`/onboarding/${jobPostingId}`);
    
    // Set a timeout to hide loading after navigation
    // This ensures loading persists during page transition
    setTimeout(() => {
      setIsNavigating(false);
    }, 2500); // 2.5-second timeout
  };

  const handleStayHere = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
          <LoadingSpinner size="xl" color="yellow" />
          <span className="text-yellow-600 font-semibold text-xl mt-4">Navigating to Onboarding page...</span>
        </div>
      )}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          initialFocus={cancelButtonRef}
          onClose={setIsOpen}
        >
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-9 space-y-5">
                  <div className="flex justify-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                      <CheckIcon />
                    </div>
                  </div>
                  
                  <h5 className='text-xl font-bold text-indigo-dye text-center pt-4'>
                    Applicant hired successfully!
                    <br />
                    <br />
                    Would you like to navigate to the Onboarding page or stay on the current page?
                  </h5>
                  
                  <div className='mt-5 sm:mt-4 sm:flex sm:flex-col sm:gap-3'>
                    <button
                      type='button'
                      className='text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all disabled:opacity-50'
                      onClick={handleGoToOnboarding}
                      disabled={isNavigating}
                    >
                      {isNavigating ? (
                        <>
                          <LoadingSpinner size="sm" color="white" className="mr-2 inline-block" />
                          Navigating...
                        </>
                      ) : (
                        'GO TO ONBOARDING'
                      )}
                    </button>
                    <button
                      ref={cancelButtonRef}
                      type='button'
                      className='text-lg text-center block w-full font-bold leading-6 text-savoy-blue shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all'
                      onClick={handleStayHere}
                    >
                      STAY HERE
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
} 