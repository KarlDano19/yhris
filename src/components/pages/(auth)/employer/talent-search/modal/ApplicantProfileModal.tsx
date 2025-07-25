import { Dispatch, Fragment, useRef, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { XCircleIcon, PrinterIcon } from "@heroicons/react/24/solid";
import useGetApplicantDetails from "../hook/useGetApplicantDetails";
import ApplicantProfile from "../profile/ApplicantProfile";
import WorkExperience from "../profile/WorkExperience";

type T_ModalData = {
  id: number;
  open: boolean;
};

function ApplicantProfileModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { data: applicantDetailsData, refetch: refetchApplicantDetails, isLoading } = useGetApplicantDetails(isOpen.id);
  
  const customCloseModal = () => {
    refetch();
    setIsOpen(null);
  };

  useEffect(() => {
    if (isOpen.open && isOpen.id) {
      refetchApplicantDetails();
    }
  }, [isOpen.open, isOpen.id, refetchApplicantDetails]);

  useEffect(() => {
    if (applicantDetailsData) {
      console.log(applicantDetailsData);
    }
  }, [applicantDetailsData]);

  return (
    <Transition.Root show={isOpen.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => customCloseModal()}
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
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Profile Details
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(applicantDetailsData);
                      }}
                      className="p-1 text-white hover:bg-savoy-blue/80 rounded"
                    >
                      <PrinterIcon className="w-6 h-6" />
                    </button>
                    <XCircleIcon
                      className="w-8 h-8 text-white cursor-pointer"
                      onClick={() => customCloseModal()}
                    />
                  </div>
                </div>
                <div className="p-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading profile/s...</p>
                    </div>
                  ) : (
                    <div className="flex gap-6">
                      <div className="w-1/3 h-full">
                        <ApplicantProfile
                          applicant={applicantDetailsData}
                        />
                      </div>
                      <div className="w-2/3 h-full">
                        <WorkExperience
                          workExperience={applicantDetailsData?.work_experience || []}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ApplicantProfileModal;
