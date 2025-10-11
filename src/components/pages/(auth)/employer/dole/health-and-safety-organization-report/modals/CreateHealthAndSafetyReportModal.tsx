import { Dispatch, Fragment, useRef, useState, useEffect } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import useAddHealthAndSafetyReport from "../hooks/useAddHealthAndSafetyReport";
import ReportInformation from "./tabs/ReportInformation";
import PolicyAndComittee from "./tabs/PolicyAndComittee";
import TechnicalAndSignature from "./tabs/TechnicalAndSignature";

import { XCircleIcon } from "@heroicons/react/24/solid";

interface CachedProfileData {
  name: string;
  type_of_industry: string;
  building: string;
  street: string;
  locality: string;
  city: string;
  country: string;
  zip_code: string;
  region: string;
}

function CreateHealthAndSafetyReportModal({
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
  const { register, handleSubmit, reset, control, setValue, watch } = formMethods;
  const {
    mutate: addWorkEnvironmentRequest,
    isLoading: isLoadingAddHealthAndSafetyReport,
    } = useAddHealthAndSafetyReport();
  const [selectedTab, setSelectedTab] = useState(1);
  const queryClient = useQueryClient();
  
  const cachedProfile = queryClient
    .getQueryCache()
    .find(["employerProfileCache"]) as {
    state: { data: CachedProfileData } | undefined;
  };

  // Set cached profile data when modal opens
  useEffect(() => {
    if (isOpen && cachedProfile?.state?.data) {
      setValue("company_name", cachedProfile.state.data.name || "");
      setValue(
        "type_of_industry",
        cachedProfile.state.data.type_of_industry || ""
      );
      
      // Combine address fields from cached profile
      const addressParts = [
        cachedProfile.state.data.building,
        cachedProfile.state.data.street,
        cachedProfile.state.data.locality,
        cachedProfile.state.data.city,
        cachedProfile.state.data.country,
        cachedProfile.state.data.zip_code
      ].filter(Boolean); // Remove empty/undefined values
      
      const combinedAddress = addressParts.join(', ') || '\u00A0';
      setValue("address", combinedAddress);
    }
  }, [isOpen, cachedProfile, setValue]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = handleSubmit((data: any) => {
    if (data.employees) {
      data.shift_employees = JSON.stringify(data.employees);
    }
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(
          () => <CustomToast message={data.message} type="success" />,
          {
            duration: 5000,
          }
        );
        resetForm();
        if (typeof refetch === 'function') {
          refetch();
        }
      },
      onError: (err: any) => {
        let errorMessage = err.message || "An unexpected error occurred.";
        if (err.description && typeof err.description === 'string' && err.description.toLowerCase().includes('chairman')) {
          errorMessage = err.description;
        }
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
        onClose={() => handleClose()}
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all my-4 w-full max-w-full mx-2 md:my-8 md:w-full md:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Create Health and Safety Organization Report
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={handleClose}
                  />
                </div>
                {selectedTab === 1 && (
                  <ReportInformation
                    control={control}
                    setValue={setValue}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    watch={watch}
                  />
                )}
                {selectedTab === 2 && (
                  <PolicyAndComittee
                    control={control}
                    setValue={setValue}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    watch={watch}
                    isCreateModal={true}
                  />
                )}
                {selectedTab === 3 && (
                  <TechnicalAndSignature
                    control={control}
                    setValue={setValue}
                    register={register}
                    onSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
                    watch={watch}
                    isCreateModal={true}
                    isLoading={isLoadingAddHealthAndSafetyReport}
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

export default CreateHealthAndSafetyReportModal;
