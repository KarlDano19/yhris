import { Dispatch, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import CheckIcon from "@/svg/CheckIcon";
import { useRouter } from "next/navigation";

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

  const handleGoToOrient = () => {
    setIsOpen(false);
    router.push(`/orient/${jobPostingId}`);
  };

  const handleStayHere = () => {
    setIsOpen(false);
  };

  return (
    <>
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
                    Would you like to navigate to the Orient page or stay on the current page?
                  </h5>
                  
                  <div className='mt-5 sm:mt-4 sm:flex sm:flex-col sm:gap-3'>
                    <button
                      type='button'
                      className='text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all'
                      onClick={handleGoToOrient}
                    >
                      GO TO ORIENT
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