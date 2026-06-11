import { Dispatch, Fragment, useRef, useEffect, useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

import { XCircleIcon, PrinterIcon } from "@heroicons/react/24/solid";

import LoadingSpinner from '@/components/LoadingSpinner';
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
      refetch();
    }
  }, [applicantDetailsData]);

  return (
    <Transition show={isOpen.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => customCloseModal()}
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
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-screen-2xl">
                <div className="flex bg-savoy-blue p-2 items-center rounded-t-lg">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Profile Details
                  </h3>
                  <div className="flex items-center gap-2">
                    <XCircleIcon
                      className="w-8 h-8 text-white cursor-pointer"
                      onClick={() => customCloseModal()}
                    />
                  </div>
                </div>
                <div className="p-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size='md' showText={true} text='Loading profile...' />
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3 h-full">
                        <ApplicantProfile
                          applicant={applicantDetailsData}
                        />
                      </div>
                      <div className="w-full md:w-2/3 h-full">
                        <WorkExperience
                          workExperience={applicantDetailsData?.work_experience || []}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ApplicantProfileModal;
