"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import PartyFaceIcon from "@/svg/PartyFaceIcon";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import DragDrop from "../DragDrop";
import { useForm } from "react-hook-form";
import { T_Directive } from "@/types/globals";



interface WelcomeModalProps {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const WelcomeModal = ({ open, onSuccess, onClose }: WelcomeModalProps) => {
  const [modalState, setModalState] = useState("welcome-modal");

  const { setValue } = useForm<T_Directive>();

  const renderWelcome = () => {
    return (
      <>
        <div>
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full">
            <PartyFaceIcon className="h-24 w-24" />
          </div>
          <div className="mt-1 text-center sm:mt-3">
            <Dialog.Title
              as="h3"
              className="text-3xl font-semibold text-indigo-dye"
            >
              Welcome home to <br /> YASHUA HRIS!
            </Dialog.Title>
          </div>
        </div>
        <div className="mt-5 sm:mt-7">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300"
            tabIndex={-1}
            onClick={() => setModalState("ask-resume-modal")}
          >
            Next
          </button>
        </div>
      </>
    );
  };

  const renderAskResume = () => {
    return (
      <>
        <div>
          <div className="mx-auto flex items-center justify-center rounded-full">
            <ExclamationCircleIcon className="h-24 w-24 text-[#FFC107]" />
          </div>
          <div className="mt-1 text-center sm:mt-3">
            <Dialog.Title
              as="h3"
              className="text-2xl font-semibold text-indigo-dye"
            >
              Would you like to upload your Curriculum Vitae or Resume?
            </Dialog.Title>
            <p className="text-[#ACB9CB] text-md mt-6">
              Details in your Curriculum Vitae or Resume will be automatically
              filled out in the fields available.
            </p>
          </div>
        </div>
        <div className="mt-5 sm:mt-7 md:flex justify-between md:space-x-9">
          <button
            type="button"
            className="inline-flex w-full mb-4 md:mb-0 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue border border-savoy-blue shadow-sm"
            tabIndex={-1}
            onClick={onClose}
          >
            SORRY, I DISAGREE.
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300"
            tabIndex={-1}
            onClick={() => setModalState("file-upload-modal")}
          >
            YES, I AGREE.
          </button>
        </div>
      </>
    );
  };

  const renderFileUpload = () => {
    return (
      <>
        <div className="max-w-xl py-4">
          <DragDrop setValue={(value: any) => setValue("file", value)} />
        </div>
        <button
          type="button"
          className="mt-4 inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300"
          tabIndex={-1}
          onClick={() => {
            onClose();
            onSuccess();
          }}
        >
          UPLOAD
        </button>
      </>
    );
  };

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-md sm:p-6">
                {modalState === "ask-resume-modal"
                  ? renderAskResume
                  : modalState === "file-upload-modal"
                  ? renderFileUpload
                  : renderWelcome}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default WelcomeModal;
