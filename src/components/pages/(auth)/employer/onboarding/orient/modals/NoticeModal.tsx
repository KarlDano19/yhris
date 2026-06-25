import { Dispatch, Fragment, useRef, ReactNode } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import Warning from "@/svg/Warning";

export default function NoticeModal({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  children: ReactNode;
}) {
  const cancelButtonRef = useRef(null);
  return (
    <>
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          initialFocus={cancelButtonRef}
          onClose={setIsOpen}
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
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-9 space-y-5">
                  <div className="flex justify-center">
                    <Warning />
                  </div>
                  {children}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
