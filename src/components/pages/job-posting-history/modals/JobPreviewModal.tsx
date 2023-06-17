import { Dispatch, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { T_JobPreviewModal } from "@/types/globals";
import { XCircleIcon } from "@heroicons/react/24/solid";

export default function JobPreviewModal({
  isOpen,
  setIsOpen,
  id,
  jobPostHistoryItems,
}: {
  isOpen: T_JobPreviewModal | null;
  setIsOpen: Dispatch<T_JobPreviewModal | null>;
  id: number | null;
  jobPostHistoryItems: any;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen?.isOpen ? true : false} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setIsOpen({ id: isOpen?.id ? isOpen?.id : null, isOpen: false })}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Job {id} - Preview
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => setIsOpen({ id: isOpen?.id ? isOpen?.id : null, isOpen: false })}
                  />
                </div>
                {jobPostHistoryItems &&
                  jobPostHistoryItems.map((item: any, index: number) => {
                    if (item.id == id) {
                      const markup = { __html: item.jobDescription };

                      return (
                        <div key={index} className="px-4 pb-6">
                          {/* start */}
                          <div className="sm:col-span-4 mt-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Preview
                            </label>
                            <div className="relative flex flex-col space-y-2 mt-2 text-sm font-medium leading-6 text-gray-900 rounded-md border-2 border-text-gray-400 px-2 py-3">
                              <p className="font-bold">{item.jobTitle}</p>
                              <p>
                                The ABBA Initiative -{" "}
                                <span>{item.placeAdvertise}</span>
                              </p>
                              <span className="absolute top-20 left-0 w-full border" />
                              <div>
                                <p
                                  className="mt-8"
                                  dangerouslySetInnerHTML={markup}
                                ></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                <hr />
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                    onClick={() => setIsOpen({ id: isOpen?.id ? isOpen?.id : null, isOpen: false })}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
