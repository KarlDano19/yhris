import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import Link from "next/link";
import { EnvelopeIcon } from "@heroicons/react/24/outline";



interface InstructionModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
}

const InstructionModal = ({ open, onClose, name }: InstructionModalProps) => {
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 py-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-10">
                <div>
                  <h3 className="text-indigo-dye text-xl md:text-3xl font-bold text-center">
                    Instruction Sent
                  </h3>
                  <EnvelopeIcon className="h-20 w-20 text-savoy-blue mx-auto mt-3" />
                  <p className="text-center text-indigo-dye px-2 font-medium">
                    We sent instructions to change your password to{" "}
                    <span className="text-savoy-blue font-semibold">
                      {name}
                    </span>{" "}
                    Please check your inbox or spam folder. Thank you and GOD
                    bless!
                  </p>
                  <Link href="/login">
                    <button
                      type="button"
                      className="mt-6 inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300"
                      onClick={onClose}
                    >
                      OKAY
                    </button>
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default InstructionModal;
