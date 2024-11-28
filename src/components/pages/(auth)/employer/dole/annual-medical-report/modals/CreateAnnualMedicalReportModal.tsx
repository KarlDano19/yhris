import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import classNames from "@/helpers/classNames";
import useGetEmployeeItems from "@/components/hooks/useGetEmployeeItems";
import GeneralInfo from "./tabs/GeneralInfo";
import PreventiveAndEmergency from "./tabs/PreventiveAndEmergency";
import EmergencyOccupational from "./tabs/EmergencyOccupational";
import OccupationalHealthService from "./tabs/OccupationalHealthService";
import ReportOfDisease from "./tabs/ReportOfDisease";
import WorkplaceSafetyCompliance from "./tabs/WorkplaceSafetyCompliance";
import WorkplaceHazards from "./tabs/WorkplaceHazards";
import WorkplaceWelfare from "./tabs/WorkplaceWelfare";
import useAddAnnualMedicalReport from "../hooks/useAddAnnualMedicalReport";

import { XCircleIcon } from "@heroicons/react/24/solid";

function CreateAnnualMedicalReportModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const { data: employeeData } = useGetEmployeeItems();
  const { register, handleSubmit, reset, control, setValue, watch } = useForm();
  const {
    mutate: addAnnualMedicalReport,
    isLoading: isLoadingAddAnnualMedicalReport,
  } = useAddAnnualMedicalReport();
  const [selectedTab, setSelectedTab] = useState(1);

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(
          () => <CustomToast message={data.message} type="success" />,
          { duration: 5000 }
        );
        setIsOpen(false);
        reset();
        refetch();
      },
      onError: (err: any) => {
        const errorMessage = err.message || "An unexpected error occurred."; // Extract message from error
        toast.custom(
          () => <CustomToast message={errorMessage} type="error" />,
          { duration: 7000 }
        );
      },
    };
    addAnnualMedicalReport(data, callbackReq);
  });

  useEffect(() => {
    if (employeeData) {
      setEmployeeItems(employeeData);
    }
  }, [employeeData]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
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
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Create Work Accident/Illness Report
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <div>
                  <div className="pt-4 pb-2 pl-4 flex flex-row space-x-4">
                    <div className="flex space-x-2">
                      <h1 className={classNames('text-base font-semibold border-2 py-1 px-3 rounded-full', selectedTab === 1 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>1</h1>
                      <h1 className={classNames('self-center text-base font-semibold', selectedTab === 1 ? 'text-savoy-blue' : 'hidden')}>General Information</h1>
                    </div>
                    <div className="flex space-x-2">
                      <h1 className={classNames('text-base font-semibold border-2 py-1 px-3 rounded-full', selectedTab === 2 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>2</h1>
                      <h1 className={classNames('self-center text-base font-semibold', selectedTab === 2 ? 'text-savoy-blue' : 'hidden')}>Preventive and Emergency Health Services</h1>
                    </div>
                    <div className="flex space-x-2">
                      <h1 className={classNames('text-base font-semibold border-2 py-1 px-3 rounded-full', selectedTab === 3 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>3</h1>
                      <h1 className={classNames('self-center text-base font-semibold', selectedTab === 3 ? 'text-savoy-blue' : 'hidden')}>Emergency Occupational Health Services</h1>
                    </div>
                    <div className="flex space-x-2">
                      <h1 className={classNames('text-base font-semibold border-2 py-1 px-3 rounded-full', selectedTab === 4 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>4</h1>
                      <h1 className={classNames('self-center text-base font-semibold', selectedTab === 4 ? 'text-savoy-blue' : 'hidden')}>Occupational Health Services</h1>
                    </div>
                    <div className="flex space-x-2">
                      <h1 className={classNames('text-base font-semibold border-2 py-1 px-3 rounded-full', selectedTab === 5 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>5</h1>
                      <h1 className={classNames('self-center text-base font-semibold', selectedTab === 5 ? 'text-savoy-blue' : 'hidden')}>Report of Disease</h1>
                    </div>
                    <div className="flex space-x-2">
                      <h1 className={classNames('text-base font-semibold border-2 py-1 px-3 rounded-full', selectedTab === 6 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>6</h1>
                      <h1 className={classNames('self-center text-base font-semibold', selectedTab === 6 ? 'text-savoy-blue' : 'hidden')}>Workplace Safety Compliance</h1>
                    </div>
                    <div className="flex space-x-2">
                      <h1 className={classNames('text-base font-semibold border-2 py-1 px-3 rounded-full', selectedTab === 7 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>7</h1>
                      <h1 className={classNames('self-center text-base font-semibold', selectedTab === 7 ? 'text-savoy-blue' : 'hidden')}>Workplace Welfare</h1>
                    </div>
                    <div className="flex space-x-2">
                      <h1 className={classNames('text-base font-semibold border-2 py-1 px-3 rounded-full', selectedTab === 8 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>8</h1>
                      <h1 className={classNames('self-center text-base font-semibold', selectedTab === 8 ? 'text-savoy-blue' : 'hidden')}>Workplace Hazards</h1>
                    </div>
                  </div>
                  <div className="pl-4">
                    <h1 className="text-sm font-semibold text-gray-500">Step {selectedTab} out of 8</h1>
                  </div>

                </div>
                {selectedTab === 1 && (
                  <GeneralInfo
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                  />
                )}
                {selectedTab === 2 && (
                  <PreventiveAndEmergency
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                  />
                )}
                {selectedTab === 3 && (
                  <EmergencyOccupational
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                  />
                )}
                {selectedTab === 4 && (
                  <OccupationalHealthService
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                  />
                )}
                {selectedTab === 5 && (
                  <ReportOfDisease
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                  />
                )}
                {selectedTab === 6 && (
                  <WorkplaceSafetyCompliance
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                  />
                )}
                {selectedTab === 7 && (
                  <WorkplaceWelfare
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                  />
                )}
                {selectedTab === 8 && (
                  <WorkplaceHazards
                    control={control}
                    register={register}
                    onSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default CreateAnnualMedicalReportModal;
