import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

interface SuccessProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

const SuccessPopAlert = ({ message, open, onClose }: SuccessProps) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="fixed md:right-7 lg:right-10 left-0 md:left-auto w-full top-9 z-20">
          <div className="mx-auto h-24 max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative">
            <div className="md:absolute right-0">
              <div className="rounded-md bg-[#65C979] p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-7 w-7 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs lg:text-[15px] font-medium text-white md:ml-2 md:mr-8">
                      {message}
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                      <button
                        type="button"
                        className="inline-flex p-1.5 text-white"
                        onClick={onClose}
                      >
                        <span className="sr-only">Dismiss</span>
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="z-20 fixed top-9 mr-0">
          <div className="rounded-md bg-[#65C979] p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  className="h-7 w-7 text-white"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm lg:text-[15px] font-medium text-white md:ml-2 md:mr-8">
                  {message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className="inline-flex p-1.5 text-white"
                    onClick={onClose}
                  >
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </Transition.Child>
    </Transition.Root>
  );
};

export default SuccessPopAlert;
