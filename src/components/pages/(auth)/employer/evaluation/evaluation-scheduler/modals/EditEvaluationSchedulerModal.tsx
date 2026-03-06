import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
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
}: EditEvaluationSchedulerModalProps) {
  const cancelButtonRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(1);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key state
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Add loading state
  const {
    data: dataEvaluationSchedulerDetails,
    isLoading: isGetEvaluationSchedulerLoading,
    refetch: refetchEvaluationSchedulerDetails,
    remove: evaluationSchedulerDetailRemove,
  } = useGetEvaluationSchedulerDetails(selectedEvaluationSchedulerId);
  const { mutate, isLoading } = useUpdateEvaluationScheduler();

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
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => customCloseModal()}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Edit Evaluation Scheduler</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  
                  {isGetEvaluationSchedulerLoading && (
                    <div className="flex justify-center items-center py-20">
                      <div role="status" className="flex flex-col items-center">
                        <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                        <p className="text-sm text-gray-500 mt-2">Loading data...</p>
                      </div>
                    </div>
                  )}
                  
                  {isDataLoaded && selectedTab === 1 && (
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
                      key={refreshKey} // Add a key prop to force re-render when refreshKey changes
                    />
                  )}
                  
                  {isDataLoaded && selectedTab === 2 && (
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

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