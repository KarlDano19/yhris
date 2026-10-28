'use client';

import { Dispatch, Fragment, useRef } from 'react';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';

type T_ViewModalData = {
  id: number;
  open: boolean;
  name?: string;
  emails?: string[];
  phones?: string[];
};

export default function ViewPartnerEmailsModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: T_ViewModalData;
  setIsOpen: Dispatch<T_ViewModalData | null>;
}) {
  const closeButtonRef = useRef(null);

  return (
    <Transition show={!!isOpen?.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={closeButtonRef} onClose={() => setIsOpen(null)}>
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Partner Details — {isOpen?.name}
                  </h3>
                  <XCircleIcon className="w-8 h-8 text-white cursor-pointer" onClick={() => setIsOpen(null)} />
                </div>

                <div className="px-4 pt-4 pb-6 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Phone(s)</p>
                    {isOpen?.phones && isOpen.phones.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {isOpen.phones.map((phone) => (
                          <span
                            key={phone}
                            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                          >
                            {phone}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">—</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email(s)</p>
                    {isOpen?.emails && isOpen.emails.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {isOpen.emails.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                          >
                            {email}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">—</p>
                    )}
                  </div>
                </div>

                <hr />
                <div className="mt-4 flex justify-end px-4">
                  <button
                    type="button"
                    ref={closeButtonRef}
                    onClick={() => setIsOpen(null)}
                    className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
