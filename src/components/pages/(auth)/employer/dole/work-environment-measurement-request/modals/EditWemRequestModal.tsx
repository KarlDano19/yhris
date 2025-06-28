import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import useGetWorkEnvironmentRequestDetails from "../hooks/useGetWorkEnvironmentRequestDetails";
import useUpdateWorkEnvironmentRequest from "../hooks/useUpdateWorkEnvironmentRequest";
import BasicAndRiskInfo from "./tabs/BasicAndRiskInfo";
import WEMDetailsRequest from "./tabs/WEMDetailsRequest";
import MonitoringAndHazardInfo from "./tabs/MonitoringAndHazardInfo";
import DataPrivacyAndCertification from "./tabs/DataPrivacyAndCertification";

import { XCircleIcon } from "@heroicons/react/24/solid";

type T_ModalData = {
  id: number;
  open: boolean;
};

export default function EditWemRequestModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const {
    data: workEnvironmentRequestData,
    refetch: refetchWorkEnvironmentRequest,
    remove: removeWorkEnvironmentRequest,
  } = useGetWorkEnvironmentRequestDetails(isOpen.id);
  const { register, handleSubmit, reset, control, setValue, watch } = useForm();
  const { mutate, isLoading: isLoadingUpdateWorkEnvironmentRequest } =
    useUpdateWorkEnvironmentRequest();
  const [selectedTab, setSelectedTab] = useState(1);

  useEffect(() => {
    if (isOpen) {
      refetchWorkEnvironmentRequest();
    }
  }, [isOpen]);

  useEffect(() => {
    if (workEnvironmentRequestData) {
      setValue("date_of_application",workEnvironmentRequestData.date_of_application);
      setValue("company_name", workEnvironmentRequestData.company_name);
      setValue("type_of_industry", workEnvironmentRequestData.type_of_industry);
      setValue("number_of_workers_male",workEnvironmentRequestData.number_of_workers_male);
      setValue("number_of_workers_female",workEnvironmentRequestData.number_of_workers_female);
      setValue("number_of_workers_total",workEnvironmentRequestData.number_of_workers_total);
      setValue("risk_classification",workEnvironmentRequestData.risk_classification);
      setValue("name_of_safety_officer",workEnvironmentRequestData.name_of_safety_officer);
      let levels = workEnvironmentRequestData.safety_officer_levels;
      if (Array.isArray(levels) && levels.length === 1 && typeof levels[0] === "string" && levels[0].includes(",")) {
        levels = levels[0].split(",").map((s: string) => s.trim());
      }
      if (typeof levels === "string") {
        levels = levels.split(",").map((s: string) => s.trim());
      }
      setValue("safety_officer_levels", levels);
      setValue("purpose_of_wem_request",workEnvironmentRequestData.purpose_of_wem_request);
      setValue("wem_conducted_by", workEnvironmentRequestData.wem_conducted_by);
      setValue("last_wem_date", workEnvironmentRequestData.last_wem_date);
      setValue("wem_internal_monitoring_capability",workEnvironmentRequestData.wem_internal_monitoring_capability);
      setValue("wem_equipment_owned_by_company",workEnvironmentRequestData.wem_equipment_owned_by_company);
      setValue("conducting_internal_wem",workEnvironmentRequestData.conducting_internal_wem ? "yes" : "no");
      setValue("date_of_internal_monitoring",workEnvironmentRequestData.date_of_internal_monitoring);      
      setValue("hazards_purpose_of_wem_request",workEnvironmentRequestData.hazards_purpose_of_wem_request);
      setValue("chemical_hazards", workEnvironmentRequestData.chemical_hazards);
      setValue("ventilation", workEnvironmentRequestData.ventilation);
      setValue("requesting_personnel_name",workEnvironmentRequestData.requesting_personnel_name);
      setValue("requesting_personnel_position",workEnvironmentRequestData.requesting_personnel_position);
      setValue("signature", workEnvironmentRequestData.signature);
    }
  }, [workEnvironmentRequestData]);

  const customCloseModal = () => {
    reset();
    removeWorkEnvironmentRequest();
    setIsOpen(null);
  };

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(
          () => <CustomToast message={data.message} type="success" />,
          {
            duration: 5000,
          }
        );
        customCloseModal();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type="error" />, {
          duration: 7000,
        });
      },
    };
    mutate({ work_environment_measurement_request_id: isOpen.id, data: data }, callbackReq);
  });

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
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Update Work Environment Measurement (WEM) Request
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => customCloseModal()}
                  />
                </div>
                {selectedTab === 1 && (
                  <BasicAndRiskInfo
                    name_of_safety_officer={
                      workEnvironmentRequestData?.name_of_safety_officer
                    }
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
