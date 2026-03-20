import { Dispatch, Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Warning from "@/svg/Warning";
import JobSuccessfullyInactiveModal from "./JobSuccessfullyInactiveModal";

export default function SetJobInactiveModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
  const [jobSuccessInactiveModalOpen, setJobSuccessInactiveModalOpen] =
    useState(false);

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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-5 space-y-5">
                  <div className="flex justify-center">
                    <Warning />
                  </div>
                  <p className="text-xl font-bold text-gray-900 text-center">
                    Are you sure you want to set this job to inactive? 🧐
                  </p>
                  <p className="text-xl font-bold text-gray-900 text-center">
                    Setting this job to inactive will stop you from receiving
                    matched applicants.
                  </p>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between">
                    <button
                      type="button"
                      className="flex-1 sm:ml-10 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all"
                      onClick={() => {
                        setJobSuccessInactiveModalOpen(true);
                        setIsOpen(false);
                      }}
                    >
                      YES, I AM.
                    </button>
                    <button
                      type="submit"
                      className="flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue  shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      NO I&#39;M NOT.
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <JobSuccessfullyInactiveModal
        isOpen={jobSuccessInactiveModalOpen}
        setIsOpen={setJobSuccessInactiveModalOpen}
        setJobInactiveModal={setIsOpen}
      />
    </>
  );
}
