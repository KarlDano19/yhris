import { Dispatch, Fragment, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import SchedulerInfoTab from '../tabs/SchedulerInfoTab';
import CustomFrequencyModal from './CustomFrequencyModal';
import EmployeeAssigneeTab from '../tabs/EmployeeAssigneeTab';
import useAddEvaluationScheduler from '../hooks/useAddEvaluationScheduler';

import { XCircleIcon } from '@heroicons/react/24/solid';

interface CreateEvaluationSchedulerModalProps {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  register: any;
  watch: any;
  handleSubmit: any;
  reset: any;
  control: any;
  setValue: any;
  Controller: any;
}

function CreateEvaluationSchedulerModal({
  refetch,
  isOpen,
  setIsOpen,
  register,
  watch,
  handleSubmit,
  reset,
  control,
  setValue,
  Controller,
}: CreateEvaluationSchedulerModalProps) {
  const cancelButtonRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(1);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const { mutate, isLoading } = useAddEvaluationScheduler();

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        setSelectedTab(1);
        setIsOpen(false);
        reset();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    mutate(data, callbackReq);
  });

  const handleCustomFrequencySelectFromTab = (frequency: string, months?: number[], day?: number) => {
    // This handler is called from SchedulerInfoTab when custom frequency is selected
    const freqValue = JSON.stringify({
      months: months || [1],
      day: day || 1
    });
    setValue('frequency_unit', frequency); // quarterly, semi-annually, or annually
    setValue('frequency_value', freqValue);
    
    // Close the modal after saving
    setIsCustomModalOpen(false);
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setIsOpen}>
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
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Create Evaluation Scheduler</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                  </div>
                  {selectedTab === 1 && (
                    <SchedulerInfoTab 
                      register={register} 
                      handleSubmit={handleSubmit} 
                      setSelectedTab={setSelectedTab} 
                      watch={watch}
                      setValue={setValue}
                      setIsCustomModalOpen={setIsCustomModalOpen}
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
        onClose={() => setIsCustomModalOpen(false)}
        onSave={handleCustomFrequencySelectFromTab}
        selectedCustomFrequency={watch('frequency_unit') || ''}
        selectedCustomFrequencyValue={watch('frequency_value')}
      />
    </>
  );
}

export default CreateEvaluationSchedulerModal;