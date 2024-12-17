import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import useGetEmployeeItems from '@/components/hooks/useGetEmployeeItems';
import useGetAnnualAccidentIllnessReportDetails from '../hooks/useGetAnnualAccidentIllnessReportDetails';
import useUpdateAnnualAccidentIllnessReport from '../hooks/useUpdateAnnualAccidentIllness';


import { XCircleIcon } from '@heroicons/react/24/solid';
import ExposureData from './tabs/ExposureData';
import InjurySummary from './tabs/InjurySummary';

type T_ModalData = {
  id: number;
  open: boolean;
};

export default function UpdateReportModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
    const cancelButtonRef = useRef(null);
    const [employeeItems, setEmployeeItems] = useState<any>([]);
    const { data: employeeData } = useGetEmployeeItems();
    const {
        data: workAccidentIllnessReportData,
        refetch: refetchWorkAccidentIllnessReport,
        remove: removeWorkAccidentIllnessReport,
  } = useGetAnnualAccidentIllnessReportDetails(isOpen.id);
  const { register, handleSubmit, reset, control, setValue } = useForm();
  const { mutate, isLoading: isLoadingUpdateAnnualAccidentIllnessReport } = useUpdateAnnualAccidentIllnessReport();
  const [selectedTab, setSelectedTab] = useState(1);

  useEffect(() => {
    if (employeeData) {
      setEmployeeItems(employeeData);
    }
  }, [employeeData]);

  useEffect(() => {
    if (isOpen) {
      refetchWorkAccidentIllnessReport();
    }
  }, [isOpen]);

  useEffect(() => {
    if (workAccidentIllnessReportData) {
      setValue('address', workAccidentIllnessReportData.address);
      setValue('company_name', workAccidentIllnessReportData.company_name);
      setValue('date_of_report', workAccidentIllnessReportData.date_of_report);
      setValue('frequency_rate', workAccidentIllnessReportData.frequency_rate);
      setValue('name_signature', workAccidentIllnessReportData.name_signature);
      setValue('number_of_employees', workAccidentIllnessReportData.number_of_employees);
      setValue('severity_rate', workAccidentIllnessReportData.severity_rate);
      setValue('total_disabling_injuries', workAccidentIllnessReportData.total_disabling_injuries);
      setValue('total_hours_worked', workAccidentIllnessReportData.total_hours_worked);
      setValue('total_non_disabling_injuries', workAccidentIllnessReportData.total_non_disabling_injuries);
      setValue('type_of_industry', workAccidentIllnessReportData.type_of_industry);
      setValue('name_signature', workAccidentIllnessReportData.name_signature);
      setValue('year', workAccidentIllnessReportData.year);
      setValue('date_of_report', workAccidentIllnessReportData.date_of_report);
    }
  }, [workAccidentIllnessReportData]);

  const customCloseModal = () => {
    reset();
    removeWorkAccidentIllnessReport();
    setIsOpen(null);
  }

  const onSubmit = handleSubmit((data: any) => {
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
    mutate({ work_accident_illness_report_id: isOpen.id, data: data }, callbackReq);
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
                    Create Work Accident/Illness Report
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

