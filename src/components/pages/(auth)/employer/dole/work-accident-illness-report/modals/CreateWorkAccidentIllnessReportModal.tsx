import { Dispatch, Fragment, useRef, useState } from "react";

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import toast from 'react-hot-toast';
import useAddWorkAccidentIllnessReport from "../hooks/useAddWorkAccidentIllnessReports";
import CustomToast from '@/components/CustomToast';

import { XCircleIcon } from "@heroicons/react/24/solid";
import PersonalInformation from "./tabs/PersonalInformation";
import EmploymentDetails from "./tabs/EmploymentDetails";
import IllnessDetails from "./tabs/IllnessDetails";
import InjuryDetails from "./tabs/InjuryDetails";

function CreateWorkAccidentIllnessReportModal({
  refetch,
  isOpen,
  setIsOpen,
  formMethods,
  employeeSearch,
  setEmployeeSearch,
  employeeSelected,
  setEmployeeSelected,
  employeeDateHired,
  setEmployeeDateHired,
}: {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  formMethods: any;
  employeeSearch: string;
  setEmployeeSearch: (value: string) => void;
  employeeSelected: boolean;
  setEmployeeSelected: (value: boolean) => void;
  employeeDateHired: string | null;
  setEmployeeDateHired: (value: string | null) => void;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = formMethods;
  const {
    mutate: addWorkAccidentIllnessReport,
    isLoading: isLoadingAddWorkAccidentIllnessReport,
  } = useAddWorkAccidentIllnessReport();
  const [selectedTab, setSelectedTab] = useState(1);

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message='Created successfully.' type='success' />, { duration: 4000 });
        setIsOpen(false);
        reset();
        setEmployeeSearch('');
        setEmployeeSelected(false);
        setEmployeeDateHired(null);
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    addWorkAccidentIllnessReport(data, callbackReq);
  });


  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {setIsOpen(false)}}
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
              <DialogPanel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl w-full max-w-[95vw] mx-2">
                <div className="flex bg-savoy-blue p-2 items-center rounded-t-lg">
                  <h3 className="flex-1 text-white ml-2 font-semibold text-sm sm:text-base">
                    Create Work Accident/Illness Report
                  </h3>
                  <XCircleIcon
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                {selectedTab === 1 && (
                  <PersonalInformation
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                    employeeSearch={employeeSearch}
                    setEmployeeSearch={setEmployeeSearch}
                    employeeSelected={employeeSelected}
                    setEmployeeSelected={setEmployeeSelected}
                    employeeDateHired={employeeDateHired}
                    setEmployeeDateHired={setEmployeeDateHired}
                    errors={errors}
                  />
                )}
                {selectedTab === 2 && (
                  <EmploymentDetails
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    errors={errors}
                  />
                )}
                {selectedTab === 3 && (
                  <IllnessDetails
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                  />
                )}
                {selectedTab === 4 && (
                  <InjuryDetails
                    control={control}
                    register={register}
                    onSubmit={onSubmit}
                    isLoading={isLoadingAddWorkAccidentIllnessReport}
                    setSelectedTab={setSelectedTab}
                  />
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CreateWorkAccidentIllnessReportModal;
