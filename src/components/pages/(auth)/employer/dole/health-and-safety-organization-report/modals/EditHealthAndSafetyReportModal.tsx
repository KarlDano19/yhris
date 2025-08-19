import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import useGetHealthAndSafetyReportDetails from "../hooks/useGetHealthAndSafetyReportDetails";
import useUpdateHealthAndSafetyReport from "../hooks/useUpdateHealthAndSafetyReport";
import ReportInformation from "./tabs/ReportInformation";
import PolicyAndComittee from "./tabs/PolicyAndComittee";
import TechnicalAndSignature from "./tabs/TechnicalAndSignature";

import { XCircleIcon } from "@heroicons/react/24/solid";

type T_ModalData = {
    id: number;
  open: boolean;
};

function EditHealthAndSafetyReportModal({
  refetch,
  isOpen,
  setIsOpen,
  formMethods,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
  formMethods: any;
}) {
  const cancelButtonRef = useRef(null);
  const {
    data: healthAndSafetyReportData,
    refetch: refetchHealthAndSafetyReport,
    remove: removeHealthAndSafetyReport,
  } = useGetHealthAndSafetyReportDetails(isOpen.id);
  const { register, handleSubmit, reset, control, setValue, getValues, watch } = formMethods;
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
        setValue("number_of_workers_male", healthAndSafetyReportData.total_employees_male);
        setValue("number_of_workers_female", healthAndSafetyReportData.total_employees_female);
        setValue("number_of_workers_total", healthAndSafetyReportData.number_of_workers_total);
        setValue("position", healthAndSafetyReportData.position);
        setValue("risk_classification", healthAndSafetyReportData.risk_classification);

        // Add these for Tab 2
        setValue("chairman_name", healthAndSafetyReportData.chairman_name);
        setValue("chairman_position", healthAndSafetyReportData.chairman_position);
        setValue("secretary_name", healthAndSafetyReportData.secretary_name);
        setValue("secretary_position", healthAndSafetyReportData.secretary_position);
        setValue("member_name_1", healthAndSafetyReportData.member_name_1);
        setValue("member_position_1", healthAndSafetyReportData.member_position_1);
        setValue("member_name_2", healthAndSafetyReportData.member_name_2);
        setValue("member_position_2", healthAndSafetyReportData.member_position_2);
        setValue("member_name_3", healthAndSafetyReportData.member_name_3);
        setValue("member_position_3", healthAndSafetyReportData.member_position_3);

        // Set file field values (these will be URLs from the backend)
        setValue("policy_and_program_file", healthAndSafetyReportData.policy_and_program_file);
        setValue("technical_information_file", healthAndSafetyReportData.technical_information_file);
        setValue("signature", healthAndSafetyReportData.signature);

        // Set employees from shift_employees for editing shifts
        setValue("employees", healthAndSafetyReportData.shift_employees || []);
    }
  }, [healthAndSafetyReportData, setValue]);

  const onSubmit = handleSubmit((data: any) => {
    // Convert date_of_report to YYYY-MM-DD before appending to FormData
    if (data.date_of_report) {
      const dateObj = new Date(data.date_of_report);
      if (!isNaN(dateObj.getTime())) {
        data.date_of_report = dateObj.toLocaleDateString('en-CA');
      }
    }

    const formData = new FormData();

    // Add shift_employees to the payload from employees field
    if (data.employees) {
      formData.append('shift_employees', JSON.stringify(data.employees));
    }

    Object.entries(data).forEach(([key, value]) => {
      // For file fields, only append if it's a File (not a string/URL)
      if (
        key === 'policy_and_program_file' ||
        key === 'technical_information_file' ||
        key === 'signature'
      ) {
        if (value instanceof File) {
          formData.append(key, value);
        }
        // If it's a string (URL), do not append (let backend keep the old file)
      } else if (key !== 'employees') { // Don't append employees directly
        formData.append(key, value as string);
      }
    });

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
    
    updateHealthAndSafetyReport(
      {
        data: formData,
        health_and_safety_report_id: isOpen.id,
      },
      callbackReq
    );
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
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all my-4 w-full max-w-full mx-2 md:my-8 md:w-full md:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Edit Health and Safety Organization Report
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
                    isCreateModal={false}
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
                    isCreateModal={false}
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
