import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import useGetHealthAndSafetyReportDetails from "../hooks/useGetHealthAndSafetyReportDetails";
import useUpdateHealthAndSafetyReport from "../hooks/useUpdateHealthAndSafetyReport";
import ReportInformation from "./tabs/ReportInformation";
import PolicyAndComittee from "./tabs/PolicyAndComittee";
import TechnicalAndSignature from "./tabs/TechnicalAndSignature";

import { XCircleIcon } from "@heroicons/react/24/solid";
import SelectChevronDown from "@/svg/SelectChevronDown";

type T_ModalData = {
    id: number;
  open: boolean;
};

function EditHealthAndSafetyReportModal({
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
    data: healthAndSafetyReportData,
    refetch: refetchHealthAndSafetyReport,
    remove: removeHealthAndSafetyReport,
  } = useGetHealthAndSafetyReportDetails(isOpen.id);
  const { register, handleSubmit, reset, control, setValue, getValues } = useForm();
  const {
    mutate: updateHealthAndSafetyReport,
    isLoading: isLoadingUpdateHealthAndSafetyReport,
    } = useUpdateHealthAndSafetyReport();
  const [selectedTab, setSelectedTab] = useState(1);

  const customCloseModal = () => {
    reset();
    removeHealthAndSafetyReport();
    setIsOpen(null);
  };

  useEffect(() => {
    if (isOpen) {
      refetchHealthAndSafetyReport();
    }
  }, [isOpen]);

  useEffect(() => {
    if (healthAndSafetyReportData) {
        setValue("date_of_report", healthAndSafetyReportData.date_of_report);
        setValue("company_name", healthAndSafetyReportData.company_name);
        setValue("address", healthAndSafetyReportData.address);
        setValue("comittee_type", healthAndSafetyReportData.comittee_type);
        setValue("submitted_by", healthAndSafetyReportData.submitted_by);
        setValue("type_of_industry", healthAndSafetyReportData.type_of_industry);
        setValue("number_of_workers_male", healthAndSafetyReportData.number_of_workers_male);
        setValue("number_of_workers_female", healthAndSafetyReportData.number_of_workers_female);
        setValue("number_of_workers_total", healthAndSafetyReportData.number_of_workers_total);
        setValue("risk_classification", healthAndSafetyReportData.risk_classification);
    }
  })

  const onSubmit = handleSubmit((data) => {
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
        const errorMessage = err.message || "An unexpected error occurred."; // Extract message from error
        toast.custom(
          () => <CustomToast message={errorMessage} type="error" />,
          {
            duration: 7000,
          }
        );
      },
    };
    updateHealthAndSafetyReport(data, callbackReq);
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
                    Create Work Environment Measurement (WEM) Request
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => customCloseModal()}
                  />
                </div>
                {selectedTab === 1 && (
                  <ReportInformation
                    control={control}
                    setValue={setValue}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                  />
                )}
                {selectedTab === 2 && (
                  <PolicyAndComittee
                    control={control}
                    setValue={setValue}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                  />
                )}
                {selectedTab === 3 && (
                  <TechnicalAndSignature
                    control={control}
                    setValue={setValue}
                    register={register}
                    onSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
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

export default EditHealthAndSafetyReportModal;
