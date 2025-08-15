import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import ExposureData from './tabs/ExposureData';
import InjurySummary from './tabs/InjurySummary';
import useGetAnnualAccidentIllnessReportDetails from '../hooks/useGetAnnualAccidentIllnessReportDetails';
import useUpdateAnnualAccidentIllnessReport from '../hooks/useUpdateAnnualAccidentIllness';

import { XCircleIcon } from '@heroicons/react/24/solid';

type T_ModalData = {
  id: number;
  open: boolean;
};

export default function EditReportModal({
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
    data: annualAccidentIllnessReportData,
    refetch: refetchAnnualAccidentIllnessReport,
    remove: removeAnnualAccidentIllnessReport,
  } = useGetAnnualAccidentIllnessReportDetails(isOpen.id);
  const { register, handleSubmit, reset, control, setValue, watch } = formMethods;
  const { mutate, isLoading: isLoadingUpdateAnnualAccidentIllnessReport } = useUpdateAnnualAccidentIllnessReport();
  const [selectedTab, setSelectedTab] = useState(1);

  useEffect(() => {
    if (isOpen) {
      refetchAnnualAccidentIllnessReport();
    }
  }, [isOpen]);

  useEffect(() => {
    if (annualAccidentIllnessReportData) {
      // Set form values with existing data
      setValue('address', annualAccidentIllnessReportData.address);
      setValue('company_name', annualAccidentIllnessReportData.company_name);
      setValue('date_of_report', annualAccidentIllnessReportData.date_of_report);
      setValue('frequency_rate', annualAccidentIllnessReportData.frequency_rate);
      setValue('name_signature', annualAccidentIllnessReportData.name_signature);
      setValue('number_of_employees', annualAccidentIllnessReportData.number_of_employees);
      setValue('severity_rate', annualAccidentIllnessReportData.severity_rate);
      setValue('total_disabling_injuries', annualAccidentIllnessReportData.total_disabling_injuries);
      setValue('total_hours_worked', annualAccidentIllnessReportData.total_hours_worked);
      setValue('total_non_disabling_injuries', annualAccidentIllnessReportData.total_non_disabling_injuries);
      setValue('type_of_industry', annualAccidentIllnessReportData.type_of_industry);
      setValue('year', annualAccidentIllnessReportData.year);
      setValue('injury_summary', annualAccidentIllnessReportData.injury_summary);
      
      // Set signature field value from backend data for preview
      setValue('signature', annualAccidentIllnessReportData.signature);
      
      // Handle date fields properly
      if (annualAccidentIllnessReportData.date_of_report) {
        setValue('date_of_report', new Date(annualAccidentIllnessReportData.date_of_report));
      }
    }
  }, [annualAccidentIllnessReportData, setValue]);

  const customCloseModal = () => {
    reset();
    removeAnnualAccidentIllnessReport();
    setIsOpen(null);
  };

  const onSubmit = handleSubmit((data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      // Format date_of_report as YYYY-MM-DD if it's a Date object
      if (key === 'date_of_report' && value instanceof Date) {
        formData.append(key, value.toISOString().split('T')[0]);
      } else if (key === 'signature') {
        if (value instanceof File) {
          formData.append(key, value);
        }
        // If it's a string (URL), do not append (let backend keep the old file)
      } else {
        formData.append(key, value as string);
      }
    });

    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
          duration: 5000,
        });
        customCloseModal();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate({ annual_work_accident_illness_exposure_data_report_id: isOpen.id, data: formData }, callbackReq);
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
                    Edit Annual Work Accident/ Illness Exposure Data Report
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => customCloseModal()}
                  />
                </div>
                {selectedTab === 1 && (
                  <ExposureData
                    control={control}
                    setValue={setValue}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                  />
                )}
                {selectedTab === 2 && (
                  <InjurySummary
                    control={control}
                    register={register}
                    onSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
                    isLoading={isLoadingUpdateAnnualAccidentIllnessReport}
                    setValue={setValue}
                    watch={watch}
                    initialEmployeeHours={annualAccidentIllnessReportData?.total_hours_worked || 0}
                    initialDaysLost={annualAccidentIllnessReportData?.days_lost || 0}
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