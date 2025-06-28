import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import useAddWorkEnvironmentRequest from "../hooks/useAddWorkEnvironmentRequest";
import BasicAndRiskInfo from "./tabs/BasicAndRiskInfo";
import WEMDetailsRequest from "./tabs/WEMDetailsRequest";
import MonitoringAndHazardInfo from "./tabs/MonitoringAndHazardInfo";
import DataPrivacyAndCertification from "./tabs/DataPrivacyAndCertification";

import { XCircleIcon } from "@heroicons/react/24/solid";
import SelectChevronDown from "@/svg/SelectChevronDown";

function CreateWemRequestModal({
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
  const { register, handleSubmit, reset, control, setValue, getValues, watch } = useForm();
  const {
    mutate: addWorkEnvironmentRequest,
    isLoading: isLoadingAddWorkEnvironmentRequest,
  } = useAddWorkEnvironmentRequest();
  const [selectedTab, setSelectedTab] = useState(1);

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(
          () => <CustomToast message={data.message} type="success" />,
          {
            duration: 5000,
          }
        );
        setIsOpen(false);
        reset();
        refetch();
      },
      onError: (err: any) => {
        const errorMessage = err.message || "An unexpected error occurred."; // Extract message from error
        toast.custom(
          () => <CustomToast message={errorMessage} type="error" />,
          {
            duration: 7000,
          }
        );
      },
    };
    addWorkEnvironmentRequest(data, callbackReq);
  });

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
                    Create Work Environment Measurement (WEM) Request
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                {selectedTab === 1 && (
                  <BasicAndRiskInfo
                    control={control}
                    setValue={setValue}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                  />
                )}
                {selectedTab === 2 && (
                  <WEMDetailsRequest
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                  />
                )}
                {selectedTab === 3 && (
                  <MonitoringAndHazardInfo
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                  />
                )}
                {selectedTab === 4 && (
                  <DataPrivacyAndCertification
                    control={control}
                    register={register}
                    onSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                    watch={watch}
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

export default CreateWemRequestModal;
