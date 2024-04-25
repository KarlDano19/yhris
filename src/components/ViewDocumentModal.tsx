"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import {
  XCircleIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";



interface ViewDocumentModalProps {
  open: boolean;
  onClose: () => void;
}

const ViewDocumentModal = ({ open, onClose }: ViewDocumentModalProps) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`relative z-10 `}
        onClose={onClose}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full md:max-w-xl lg:max-w-3xl">
                <div className="header bg-savoy-blue rounded-md flex justify-between px-4 py-2">
                  <h6 className="text-white font-medium">View Document</h6>
                  <button tabIndex={-1} onClick={onClose}>
                    <XCircleIcon className="h-7 w-7 text-white" />
                  </button>
                </div>
                <div className="document container p-4">
                  <div className="bg-gray-100 h-96 rounded-md p-4 relative">
                    <span className="text-indigo">Total Page: 1</span>
                    <div className="absolute bottom-8 flex flex-col">
                      <button>
                        <PlusCircleIcon className="h-14 w-14 text-savoy-blue" />
                      </button>
                      <button>
                        <MinusCircleIcon className="h-14 w-14 text-savoy-blue" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-300 mt-3">
                  <div className="flex justify-end p-4 space-x-5">
                    <button
                      type="button"
                      className="inline-flex w-full md:w-auto justify-center rounded-md bg-white px-7 py-2 text-sm font-semibold text-savoy-blue shadow-sm border border-savoy-blue"
                      tabIndex={-1}
                      onClick={onClose}
                    >
                      Close
                    </button>
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

export default ViewDocumentModal;
