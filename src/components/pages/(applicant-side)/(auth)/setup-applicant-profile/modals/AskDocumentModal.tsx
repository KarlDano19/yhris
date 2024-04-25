"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import findFaceEmoji from "@/assets/find-face-emoji.png";
import Image from "next/image";



interface AskDocumentModalProps {
  open: boolean;
  onAgree: () => void;
  onClose: () => void;
}

const AskDocumentModal = ({
  open,
  onAgree,
  onClose,
}: AskDocumentModalProps) => {
  const handleLinkClick = () => {
    sessionStorage.setItem("showSuccessOnLoad", "true");
  };

  return (
    <>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-md sm:p-6">
                  <div>
                    <div className="mx-auto flex items-center justify-center rounded-full">
                      <ExclamationCircleIcon className="h-24 w-24 text-[#FFC107]" />
                    </div>
                    <div className="mt-1 text-center sm:mt-3">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-semibold text-indigo-dye"
                      >
                        <p className="relative">
                          Do you want to set-up your <br />
                          documents now or do it later?
                          <Image
                            className="w-6 h-6 mx-auto md:mx-0 mt-2 md:mt-0 md:absolute bottom-1 md:right-0"
                            src={findFaceEmoji}
                            width={0}
                            height={0}
                            alt="Find face emoji"
                          />
                        </p>
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-7 md:flex justify-between md:space-x-9">
                    <Link
                      href="/apply-for-a-job"
                      className="inline-flex w-full mb-4 md:mb-0 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue border border-savoy-blue shadow-sm"
                      onClick={handleLinkClick}
                    >
                      DO IT LATER
                    </Link>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300"
                      tabIndex={-1}
                      onClick={() => {
                        onAgree();
                        onClose();
                      }}
                    >
                      SET-UP NOW
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
};

export default AskDocumentModal;
