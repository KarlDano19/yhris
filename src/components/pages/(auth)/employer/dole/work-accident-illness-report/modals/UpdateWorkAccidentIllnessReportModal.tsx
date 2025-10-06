import { Dispatch, Fragment, useRef, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useGetWorkAccidentIllnessReportDetails from '../hooks/useGetWorkAccidentIllnessReportDetails';
import useUpdateWorkAccidentIllnessReport from '../hooks/useUpdateWorkAccidentIlnessReport';
import PersonalInformation from './tabs/PersonalInformation';
import EmploymentDetails from './tabs/EmploymentDetails';
import InjuryDetails from './tabs/InjuryDetails';
import IllnessDetails from './tabs/IllnessDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';

type T_ModalData = {
  id: number;
  open: boolean;
};

export default function UpdateWorkAccidentIllnessReportModal({
  refetch,
  isOpen,
  setIsOpen,
  formMethods,
  employeeSearch,
  setEmployeeSearch,
  employeeSelected,
  setEmployeeSelected,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
  formMethods: any;
  employeeSearch: string;
  setEmployeeSearch: (value: string) => void;
  employeeSelected: boolean;
  setEmployeeSelected: (value: boolean) => void;
}) {
    const cancelButtonRef = useRef(null);
    const {
        data: workAccidentIllnessReportData,
        refetch: refetchWorkAccidentIllnessReport,
        remove: removeWorkAccidentIllnessReport,
  } = useGetWorkAccidentIllnessReportDetails(isOpen.id);
  const { register, handleSubmit, reset, control, setValue } = formMethods;
  const { mutate, isLoading: isLoadingUpdateWorkAccidentIllnessReport } = useUpdateWorkAccidentIllnessReport();
  const [selectedTab, setSelectedTab] = useState(1);


  useEffect(() => {
    if (isOpen) {
      refetchWorkAccidentIllnessReport();
    }
  }, [isOpen, refetchWorkAccidentIllnessReport]);

  useEffect(() => {
    if (workAccidentIllnessReportData) {
      setValue('employee', workAccidentIllnessReportData.employee);
      setValue('date_of_incident', workAccidentIllnessReportData.date_of_incident);
      setValue('time_of_incident', workAccidentIllnessReportData.time_of_incident);
      setValue('nature_of_injury', workAccidentIllnessReportData.nature_of_injury);
      setValue('part_of_body_affected', workAccidentIllnessReportData.part_of_body_affected);
      setValue('date_returned_to_work', workAccidentIllnessReportData.date_returned_to_work);
      setValue('days_of_absence', workAccidentIllnessReportData.days_of_absence);
      setValue('days_chargeable', workAccidentIllnessReportData.days_chargeable);
      setValue('age', workAccidentIllnessReportData.age);
      setValue('sex', workAccidentIllnessReportData.sex);
      setValue('address', workAccidentIllnessReportData.address);
      setValue('civil_status', workAccidentIllnessReportData.civil_status);
      setValue('no_of_dependents', workAccidentIllnessReportData.no_of_dependents);
      setValue('occupation', workAccidentIllnessReportData.occupation);
      setValue('employment_status', workAccidentIllnessReportData.employment_status);
      setValue('average_weekly_earnings', workAccidentIllnessReportData.average_weekly_earnings);
      setValue('length_of_service', workAccidentIllnessReportData.length_of_service);
      setValue('years_of_experience', workAccidentIllnessReportData.years_of_experience);
      setValue('hours_worked_per_day', workAccidentIllnessReportData.hours_worked_per_day);
      setValue('hours_worked_per_week', workAccidentIllnessReportData.hours_worked_per_week);
      setValue('date_of_illness', workAccidentIllnessReportData.date_of_illness);
      setValue('reportable_illness', workAccidentIllnessReportData.reportable_illness);
      setValue('date_of_disability', workAccidentIllnessReportData.date_of_disability);
      setValue('location_of_incident', workAccidentIllnessReportData.location_of_incident);
      setValue('extent_of_injury', workAccidentIllnessReportData.extent_of_injury);
      setValue('days_of_absence_illness', workAccidentIllnessReportData.days_of_absence_illness);
      setValue('days_chargeable_illness', workAccidentIllnessReportData.days_chargeable_illness);
      setValue('date_returned_to_work_illness', workAccidentIllnessReportData.date_returned_to_work_illness);
      setValue('disabling_injury', workAccidentIllnessReportData.disabling_injury ? 'yes' : 'no');

      // Set employee search to show selected employee name from the API response
      if (workAccidentIllnessReportData.employee_name) {
        setEmployeeSearch(workAccidentIllnessReportData.employee_name);
        setEmployeeSelected(true);
      } else if (workAccidentIllnessReportData.employee) {
        setEmployeeSearch('Loading employee...');
        setEmployeeSelected(true);
      }
    }
  }, [workAccidentIllnessReportData, setValue, setEmployeeSearch, setEmployeeSelected]);

  const customCloseModal = () => {
    reset();
    setEmployeeSearch('');
    setEmployeeSelected(false);
    removeWorkAccidentIllnessReport();
    setIsOpen(null);
  }

  const onSubmit = handleSubmit((data: any) => {
    data.disabling_injury = data.disabling_injury === 'yes';
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
        onClose={() => {customCloseModal()}}
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
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl w-full max-w-[95vw] mx-2">
                <div className="flex bg-savoy-blue p-2 items-center rounded-t-lg">
                  <h3 className="flex-1 text-white ml-2 font-semibold text-sm sm:text-base">
                    Edit Work Accident/Illness Report
                  </h3>
                  <XCircleIcon
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white cursor-pointer"
                    onClick={() => customCloseModal()}
                  />
                </div>
                {selectedTab === 1 && (
                  <PersonalInformation
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                    employeeSearch={employeeSearch}
                    setEmployeeSearch={setEmployeeSearch}
                    employeeSelected={employeeSelected}
                    setEmployeeSelected={setEmployeeSelected}
                    employeeName={workAccidentIllnessReportData?.employee_name}
                  />
                )}
                {selectedTab === 2 && (
                  <EmploymentDetails
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                  />
                )}
                {selectedTab === 3 && (
                  <IllnessDetails
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                  />
                )}
                {selectedTab === 4 && (
                  <InjuryDetails
                    control={control}
                    register={register}
                    onSubmit={onSubmit}
                    isLoading={isLoadingUpdateWorkAccidentIllnessReport}
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

