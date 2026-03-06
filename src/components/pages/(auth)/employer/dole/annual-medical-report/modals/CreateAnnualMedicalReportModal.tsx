import { Dispatch, Fragment, useRef, useState, useEffect } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm, FormProvider } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import classNames from "@/helpers/classNames";
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

function CreateAnnualMedicalReportModal({
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
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors }, setError, clearErrors } = formMethods;
  const {
    mutate: addAnnualMedicalReport,
    isLoading: isLoadingAddAnnualMedicalReport,
  } = useAddAnnualMedicalReport();
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
      setValue("name_of_establishment", cachedProfile.state.data.name || "");
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

  const resetForm = () => {
    reset();
    setIsOpen(false);
    setSelectedTab(1);
  };

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
              onSuccess: (data: any) => {
          toast.custom(
            () => <CustomToast message={data.message} type="success" />,
            { duration: 5000 }
          );
          resetForm();
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all my-0 md:my-8 w-full md:max-w-5xl">
                <FormProvider {...formMethods}>
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
                  <div className="pt-4 pb-2 pl-4 pr-4 flex flex-row overflow-x-auto whitespace-nowrap space-x-4 scrollbar-hide">
                    <div 
                      className="flex space-x-2 transition-opacity"
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 1 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>1</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 1 ? 'text-savoy-blue' : 'hidden')}>General Information</h1>
                    </div>
                    <div 
                      className="flex space-x-2 transition-opacity"
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 2 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>2</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 2 ? 'text-savoy-blue' : 'hidden')}>Preventive and Emergency Health Services</h1>
                    </div>
                    <div 
                      className="flex space-x-2 transition-opacity"
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 3 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>3</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 3 ? 'text-savoy-blue' : 'hidden')}>Emergency Occupational Health Services</h1>
                    </div>
                    <div 
                      className="flex space-x-2 transition-opacity"
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 4 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>4</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 4 ? 'text-savoy-blue' : 'hidden')}>Occupational Health Services</h1>
                    </div>
                    <div 
                      className="flex space-x-2 transition-opacity"
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 5 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>5</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 5 ? 'text-savoy-blue' : 'hidden')}>Report of Disease</h1>
                    </div>
                    <div 
                      className="flex space-x-2 transition-opacity"
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 6 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>6</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 6 ? 'text-savoy-blue' : 'hidden')}>Workplace Safety Compliance</h1>
                    </div>
                    <div 
                      className="flex space-x-2 transition-opacity"
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 7 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>7</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 7 ? 'text-savoy-blue' : 'hidden')}>Workplace Welfare</h1>
                    </div>
                    <div 
                      className="flex space-x-2 transition-opacity"
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 8 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>8</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 8 ? 'text-savoy-blue' : 'hidden')}>Workplace Hazards</h1>
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
                    watch={watch}
                    errors={errors}
                  />
                )}
                {selectedTab === 2 && (
                  <PreventiveAndEmergency
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                  />
                )}
                {selectedTab === 3 && (
                  <EmergencyOccupational
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                    setValue={setValue}
                  />
                )}
                {selectedTab === 4 && (
                  <OccupationalHealthService
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                    setValue={setValue}
                  />
                )}
                {selectedTab === 5 && (
                  <ReportOfDisease
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                    watch={watch}
                  />
                )}
                {selectedTab === 6 && (
                  <WorkplaceSafetyCompliance
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                    watch={watch}
                  />
                )}
                {selectedTab === 7 && (
                  <WorkplaceWelfare
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
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
                    isLoading={isLoadingAddAnnualMedicalReport}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                  />
                )}
                </FormProvider>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default CreateAnnualMedicalReportModal;
