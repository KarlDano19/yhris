import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import SchedulerInfoTab from '../tabs/SchedulerInfoTab';
import EmployeeAssigneeTab from '../tabs/EmployeeAssigneeTab';
import useGetEvaluationSchedulerDetails from '../hooks/useGetEvaluationSchedulerDetails';
import useUpdateEvaluationScheduler from '../hooks/useUpdateEvaluationScheduler';

import { XCircleIcon } from '@heroicons/react/24/solid';

function CreateEvaluationSchedulerModal({
  refetch,
  isOpen,
  setIsOpen,
  selectedEvaluationSchedulerId,
}: {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  selectedEvaluationSchedulerId: number | null;
}) {
  const cancelButtonRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(1);
  const { register, setValue, watch, handleSubmit, control } = useForm();
  const {
    data: dataEvaluationSchedulerDetails,
    refetch: refetchEvaluationSchedulerDetails,
    remove: evaluationSchedulerDetailRemove,
  } = useGetEvaluationSchedulerDetails(selectedEvaluationSchedulerId);
  const { mutate, isLoading } = useUpdateEvaluationScheduler();

  useEffect(() => {
    if (isOpen) {
      refetchEvaluationSchedulerDetails();
    }
  }, [isOpen]);

  useEffect(() => {
    if (dataEvaluationSchedulerDetails) {
      setValue('name', dataEvaluationSchedulerDetails.name);
      setValue('evaluation_template', dataEvaluationSchedulerDetails.evaluation_template);
      setValue('frequency_value', dataEvaluationSchedulerDetails.frequency_value);
      setValue('frequency_unit', dataEvaluationSchedulerDetails.frequency_unit);
      setValue('reminder_schedule', dataEvaluationSchedulerDetails.reminder_schedule);
      setValue('employee', dataEvaluationSchedulerDetails.employee);
      setValue('message', dataEvaluationSchedulerDetails.message);
      setValue('attachment', dataEvaluationSchedulerDetails.attachment);
    }
  }, [dataEvaluationSchedulerDetails]);

  const customCloseModal = () => {
    evaluationSchedulerDetailRemove();
    setIsOpen(false);
  };

  const onSubmit = handleSubmit((data: any) => {
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Edit Evaluation Scheduler</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  {selectedTab === 1 && (
                    <SchedulerInfoTab register={register} handleSubmit={handleSubmit} setSelectedTab={setSelectedTab} />
                  )}
                  {selectedTab === 2 && (
                    <EmployeeAssigneeTab
                      control={control}
                      Controller={Controller}
                      register={register}
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
    </>
  );
}

export default CreateEvaluationSchedulerModal;
