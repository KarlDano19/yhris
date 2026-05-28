import { Dispatch, Fragment, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import EmployeeProfile from './tabs/EmployeeProfile';
import useAddPersonnelMovement from '../hooks/useAddPersonnelMovement';

import { XCircleIcon } from '@heroicons/react/24/solid';

function CreatePersonelMovementModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm();
  const [selectedTab, setSelectedTab] = useState(1);
  const { mutate: addPersonnelMovement, isLoading: isLoadingAddPersonnelMovement } = useAddPersonnelMovement();

  // Local state for current and new position
  const [currentPosition, setCurrentPosition] = useState('');
  const [newPosition, setNewPosition] = useState('');

  // Local state for employment status
  const [currentEmploymentStatus, setCurrentEmploymentStatus] = useState('');
  const [newEmploymentStatus, setNewEmploymentStatus] = useState('');

  // Reset form and local state only after successful submit
  const resetForm = () => {
    reset();
    setCurrentPosition('');
    setNewPosition('');
    setCurrentEmploymentStatus('');
    setNewEmploymentStatus('');
    setSelectedTab(1);
  };

  const onSubmit = (data: any) => {
    const payload = { ...data };
    if (payload.proposed_rate !== 'Apply Increase') {
      payload.percentage_increase = null;
    } else {
      payload.percentage_increase = payload.percentage_increase !== '' ? parseInt(payload.percentage_increase, 10) : null;
    }

    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, {
          duration: 5000,
        });
        setIsOpen(false);
        resetForm();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    addPersonnelMovement(payload, callbackReq);
  };

  // When closing the modal, do NOT reset the form or local state
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={handleClose}>
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
              <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='flex bg-savoy-blue p-2 items-center rounded-t-lg'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Create Personal Movement Form (PMF)</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={handleClose} />
                </div>
                {selectedTab === 1 && (
                  <EmployeeProfile
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    register={register}
                    handleSubmit={handleSubmit}
                    onValidSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
                    isLoading={isLoadingAddPersonnelMovement}
                    isEdit={false}
                    currentPosition={currentPosition}
                    setCurrentPosition={setCurrentPosition}
                    newPosition={newPosition}
                    setNewPosition={setNewPosition}
                    currentEmploymentStatus={currentEmploymentStatus}
                    setCurrentEmploymentStatus={setCurrentEmploymentStatus}
                    newEmploymentStatus={newEmploymentStatus}
                    setNewEmploymentStatus={setNewEmploymentStatus}
                    errors={errors}
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

export default CreatePersonelMovementModal;
