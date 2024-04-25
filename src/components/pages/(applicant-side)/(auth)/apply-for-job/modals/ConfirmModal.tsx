"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import SubmittedModal from "./SubmittedModal";
import Link from "next/link";



interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

const ConfirmModal = ({ open, onClose }: ConfirmModalProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in"
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:px-6 sm:py-6">
                  <div>
                    <div className="mx-auto flex items-center justify-center rounded-full">
                      <ExclamationCircleIcon
                        className="h-28 w-28 text-[#FFC107]"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-xl sm:text-2xl text-indigo-dye mx-auto font-semibold leading-6 sm:w-[420px] text-gray-900"
                      >
                        Would you like to send your application now or edit your
                        profile?
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-10">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={() => {
                        onClose();
                        setIsSubmitted(true);
                      }}
                    >
                      Send Application
                    </button>
                    <Link
                      href="/edit-profile"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-3.5 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <SubmittedModal
        open={isSubmitted}
        onClose={() => setIsSubmitted(false)}
      />
    </>
  );
};

export default ConfirmModal;
