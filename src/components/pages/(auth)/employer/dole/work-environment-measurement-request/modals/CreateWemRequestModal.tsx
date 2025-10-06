import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useQueryClient } from '@tanstack/react-query';
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import useAddWorkEnvironmentRequest from "../hooks/useAddWorkEnvironmentRequest";
import BasicAndRiskInfo from "./tabs/BasicAndRiskInfo";
import WEMDetailsRequest from "./tabs/WEMDetailsRequest";
import MonitoringAndHazardInfo from "./tabs/MonitoringAndHazardInfo";
import DataPrivacyAndCertification from "./tabs/DataPrivacyAndCertification";

import { XCircleIcon } from "@heroicons/react/24/solid";

interface CachedProfileData {
  name: string;
  type_of_industry: string;
  user: {
    email: string;
  };
  building: string;
  street: string;
  locality: string;
  city: string;
  country: string;
  zip_code: string;
  region: string;
}

function CreateWemRequestModal({
  refetch,
  isOpen,
  setIsOpen,
  formMethods,
}: {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  formMethods: any;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, control, setValue, watch, getValues, formState: { errors }, setError, clearErrors } = formMethods;
  const {
    mutate: addWorkEnvironmentRequest,
    isLoading: isLoadingAddWorkEnvironmentRequest,
  } = useAddWorkEnvironmentRequest();
  const [selectedTab, setSelectedTab] = useState(1);
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']) as { state: { data: CachedProfileData } | undefined };

  // Pre-fill form with cached profile data when modal opens
  useEffect(() => {
    if (isOpen && cachedProfile?.state?.data) {
      setValue("company_name", cachedProfile.state.data.name || "");
      setValue("type_of_industry", cachedProfile.state.data.type_of_industry || "");
      setValue("email_address", cachedProfile.state.data.user?.email || "");
      setValue("region", cachedProfile.state.data.region || "");
      
      // Combine address fields from cached profile
      const addressParts = [
        cachedProfile.state.data.building,
        cachedProfile.state.data.street,
        cachedProfile.state.data.locality,
        cachedProfile.state.data.city,
        cachedProfile.state.data.country,
        cachedProfile.state.data.zip_code
      ].filter(Boolean); // Remove empty/undefined values
      
      const combinedAddress = addressParts.join(', ') || '';
      setValue("address", combinedAddress);
    }
  }, [isOpen, cachedProfile, setValue]);

  const onSubmit = handleSubmit((data: any) => {
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
        onClose={() => {setIsOpen(false)}}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl w-full max-w-[95vw] mx-2">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold text-sm sm:text-base">
                    Create Work Environment Measurement (WEM) Request
                  </h3>
                  <XCircleIcon
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white cursor-pointer"
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
                    getValues={getValues}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                  />
                )}
                {selectedTab === 2 && (
                  <WEMDetailsRequest
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    getValues={getValues}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                  />
                )}
                {selectedTab === 3 && (
                  <MonitoringAndHazardInfo
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    getValues={getValues}
                    watch={watch}
                    errors={errors}
                    setError={setError}
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
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
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
