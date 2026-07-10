import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import SchedulerInfoTab from '../tabs/SchedulerInfoTab';
import CustomFrequencyModal from './CustomFrequencyModal';
import EmployeeAssigneeTab from '../tabs/EmployeeAssigneeTab';
import useGetEvaluationSchedulerDetails from '../hooks/useGetEvaluationSchedulerDetails';
import useUpdateEvaluationScheduler from '../hooks/useUpdateEvaluationScheduler';

import { XCircleIcon } from '@heroicons/react/24/solid';

interface EditEvaluationSchedulerModalProps {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  selectedEvaluationSchedulerId: number | null;
  register: any;
  setValue: any;
  watch: any;
  handleSubmit: any;
  control: any;
  reset: any;
  Controller: any;
  errors: any;
  clearErrors: any;
}

function EditEvaluationSchedulerModal({
  refetch,
  isOpen,
  setIsOpen,
  selectedEvaluationSchedulerId,
  register,
  setValue,
  watch,
  handleSubmit,
  control,
  reset,
  Controller,
  errors,
  clearErrors,
}: EditEvaluationSchedulerModalProps) {
  const cancelButtonRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(1);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key state
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Add loading state
  const {
    data: dataEvaluationSchedulerDetails,
    isLoading: isGetEvaluationSchedulerLoading,
    isFetching: isGetEvaluationSchedulerFetching,
    refetch: refetchEvaluationSchedulerDetails,
    remove: evaluationSchedulerDetailRemove,
  } = useGetEvaluationSchedulerDetails(selectedEvaluationSchedulerId);
  const { mutate, isLoading } = useUpdateEvaluationScheduler();

  // Data is only safe to render once the fetch (triggered on open) has resolved
  // AND the form has been populated from it — isFetching covers the manual
  // refetch() this modal triggers on open, since the underlying query is enabled:false.
  const isEvaluationSchedulerReady = !isOpen || (isDataLoaded && !isGetEvaluationSchedulerFetching);

  // Reset data loaded state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsDataLoaded(false);
      refetchEvaluationSchedulerDetails();
    }
  }, [isOpen, refetchEvaluationSchedulerDetails]);

  // Set form values when data is loaded
  useEffect(() => {
    if (dataEvaluationSchedulerDetails && !isGetEvaluationSchedulerLoading) {
      // Create a complete form data object
      const formData: any = {
        name: dataEvaluationSchedulerDetails.name,
        evaluation_template: dataEvaluationSchedulerDetails.evaluation_template
          ? String(dataEvaluationSchedulerDetails.evaluation_template)
          : '',
        recipient: dataEvaluationSchedulerDetails.recipient || [],
        frequency_value: typeof dataEvaluationSchedulerDetails.frequency_value === 'object' && 
                        dataEvaluationSchedulerDetails.frequency_value !== null ? 
                        JSON.stringify(dataEvaluationSchedulerDetails.frequency_value) : 
                        dataEvaluationSchedulerDetails.frequency_value,
        frequency_unit: dataEvaluationSchedulerDetails.frequency_unit,
        reminder_schedule: dataEvaluationSchedulerDetails.reminder_schedule || '',
        employees: dataEvaluationSchedulerDetails.employees || [],
        message: dataEvaluationSchedulerDetails.message || '',
        attachment: dataEvaluationSchedulerDetails.attachment || '',
        close_after_deadline: dataEvaluationSchedulerDetails.close_after_deadline !== undefined 
          ? dataEvaluationSchedulerDetails.close_after_deadline 
          : true,
      };

      // Handle deadline - expects JSON object with "day" and "time" (e.g., {"day": 10, "time": "12:31"})
      const parseDeadline = (deadlineValue: any) => {
        if (!deadlineValue) {
          return { day: '', time: '', json: '' };
        }

        // Already parsed object with day/time
        if (typeof deadlineValue === 'object' && deadlineValue !== null && !Array.isArray(deadlineValue)) {
          if (deadlineValue.day && deadlineValue.time) {
            return {
              day: deadlineValue.day,
              time: deadlineValue.time,
              json: JSON.stringify({ day: deadlineValue.day, time: deadlineValue.time }),
            };
          }

          // Legacy map of month -> date string; pick earliest month
          const firstMonthKey = Object.keys(deadlineValue).sort((a, b) => parseInt(a) - parseInt(b))[0];
          const legacyDate = firstMonthKey ? deadlineValue[firstMonthKey] : null;
          if (legacyDate) {
            const d = new Date(legacyDate);
            if (!isNaN(d.getTime())) {
              const day = d.getDate();
              const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
              return { day, time, json: JSON.stringify({ day, time }) };
            }
          }
        }

        // String date (legacy single value)
        if (typeof deadlineValue === 'string') {
          // Try parsing JSON string first
          try {
            const parsed = JSON.parse(deadlineValue);
            if (parsed?.day && parsed?.time) {
              return { day: parsed.day, time: parsed.time, json: JSON.stringify(parsed) };
            }
          } catch (_) {
            // Fallback to Date parse
            const d = new Date(deadlineValue);
            if (!isNaN(d.getTime())) {
              const day = d.getDate();
              const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
              return { day, time, json: JSON.stringify({ day, time }) };
            }
          }
        }

        return { day: '', time: '', json: '' };
      };

      const { day, time, json } = parseDeadline(dataEvaluationSchedulerDetails.deadline);
      formData.deadline_day = day;
      formData.deadline_time = time;
      formData.deadline = json;
      
      // Reset entire form with all values at once
      reset(formData);
      
      // Force a refresh of the UI
      setRefreshKey(prev => prev + 1);
      setIsDataLoaded(true);
    }
  }, [dataEvaluationSchedulerDetails, isGetEvaluationSchedulerLoading, reset]);

  const customCloseModal = () => {
    evaluationSchedulerDetailRemove();
    setIsOpen(false);
    setIsDataLoaded(false);
  };

  const handleCustomFrequencySelectFromTab = (frequency: string, months?: number[], day?: number) => {
    const freqValue = JSON.stringify({
      months: months || [1],
      day: day || 1
    });
    setValue('frequency_unit', frequency); // quarterly, semi-annually, or annually
    setValue('frequency_value', freqValue);
    
    // Force a UI refresh by incrementing the refresh key
    setRefreshKey(prev => prev + 1);
    
    // Close the modal after saving
    setIsCustomModalOpen(false);
  };

  const handleCloseCustomModal = () => {
    setIsCustomModalOpen(false);
    // Increment refresh key to trigger UI update in SchedulerInfoTab
    setRefreshKey(prev => prev + 1);
  };

  const onSubmit = handleSubmit((data: any) => {
    // Check if deadline is already a JSON string with day and time
    if (data.deadline && typeof data.deadline === 'string' && data.deadline.startsWith('{')) {
      // Already in JSON format, use as is
      // Backend expects JSON string with day and time
    } else if (data.deadline_day && data.deadline_time) {
      // Build JSON object with day and time
      const deadlineJSON = {
        day: parseInt(String(data.deadline_day)),
        time: data.deadline_time
      };
      data.deadline = JSON.stringify(deadlineJSON);
    } else {
      data.deadline = '';
    }
    
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        customCloseModal();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    mutate({ evaluationSchedulerId: selectedEvaluationSchedulerId, data: data }, callbackReq);
  });

  return (
    <>
      <Transition show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => customCloseModal()}>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </TransitionChild>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <TransitionChild
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <DialogPanel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Edit Evaluation Scheduler</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  
                  {!isEvaluationSchedulerReady ? (
                    <div className='flex min-h-[420px] items-center justify-center'>
                      <LoadingSpinner size='xl' showText text='Loading evaluation scheduler details...' />
                    </div>
                  ) : (
                    <div className='min-h-[420px]'>
                      {selectedTab === 1 && (
                        <SchedulerInfoTab
                          register={register}
                          handleSubmit={handleSubmit}
                          setSelectedTab={setSelectedTab}
                          watch={watch}
                          setValue={setValue}
                          setIsCustomModalOpen={setIsCustomModalOpen}
                          control={control}
                          Controller={Controller}
                          errors={errors}
                          clearErrors={clearErrors}
                          key={refreshKey} // Add a key prop to force re-render when refreshKey changes
                        />
                      )}

                      {selectedTab === 2 && (
                        <EmployeeAssigneeTab
                          control={control}
                          Controller={Controller}
                          watch={watch}
                          onSubmit={onSubmit}
                          isLoading={isLoading}
                          setSelectedTab={setSelectedTab}
                          recipientNames={dataEvaluationSchedulerDetails?.recipient_names}
                          employeeNames={dataEvaluationSchedulerDetails?.employee_names}
                          recipientEmails={dataEvaluationSchedulerDetails?.recipient_emails}
                          employeeEmails={dataEvaluationSchedulerDetails?.employee_emails}
                          setValue={setValue}
                          errors={errors}
                        />
                      )}
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <CustomFrequencyModal
        isOpen={isCustomModalOpen}
        onClose={handleCloseCustomModal}
        onSave={handleCustomFrequencySelectFromTab}
        selectedCustomFrequency={watch('frequency_unit')}
        selectedCustomFrequencyValue={watch('frequency_value')}
      />
    </>
  );
}

export default EditEvaluationSchedulerModal;