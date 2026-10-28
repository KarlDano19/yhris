'use client';

import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import ConfirmModal from '@/components/ConfirmModal';
import CustomToast from '@/components/CustomToast';
import ModalLayout from '@/components/ModalLayout';

import useUpdateOnboardingStatus from '../hooks/useUpdateOnboardingStatus';

type MarkCompleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  record: { id: number; employer_name: string; account_manager?: string } | null;
};

const MarkCompleteModal = ({ isOpen, onClose, record }: MarkCompleteModalProps) => {
  const { mutateAsync, isLoading } = useUpdateOnboardingStatus();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({
    defaultValues: { marked_completed_by: '' },
  });

  // Prefill with the client's account manager each time the modal opens
  useEffect(() => {
    if (isOpen) {
      reset({ marked_completed_by: record?.account_manager || '' });
      setIsConfirmOpen(false);
    }
  }, [isOpen, record, reset]);

  const handleClose = () => {
    setIsConfirmOpen(false);
    onClose();
  };

  const onSubmit = handleSubmit(() => setIsConfirmOpen(true));

  const handleConfirm = async () => {
    if (!record) return;
    try {
      await mutateAsync({
        recordId: record.id,
        status: 'COMPLETED',
        marked_completed_by: getValues('marked_completed_by').trim(),
      });
      toast.custom(() => <CustomToast message={`${record.employer_name} marked as completed.`} type='success' />, {
        duration: 3000,
      });
      handleClose();
    } catch (error: any) {
      setIsConfirmOpen(false);
      toast.custom(() => <CustomToast message={error.message || 'Failed to mark onboarding as completed.'} type='error' />, {
        duration: 5000,
      });
    }
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      handleClose={handleClose}
      title='Mark Onboarding as Completed'
      maxWidth='max-w-md'
      nestedModals={
        <ConfirmModal
          isOpen={isConfirmOpen}
          setIsOpen={setIsConfirmOpen}
          isLoading={isLoading}
          confirmAction={handleConfirm}
          message={`Save changes?\nThis will mark the onboarding of ${record?.employer_name ?? 'this client'} as completed.`}
        />
      }
    >
      <form onSubmit={onSubmit} className='p-6 space-y-4'>
        <p className='text-sm text-gray-600'>
          Once the client has confirmed onboarding is done, enter the account manager marking{' '}
          <span className='font-semibold text-gray-800'>{record?.employer_name}</span> as completed.
        </p>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Account Manager *</label>
          <input
            {...register('marked_completed_by', {
              validate: (value) => !!value.trim() || 'Account manager name or code is required.',
              maxLength: { value: 100, message: 'Maximum of 100 characters.' },
            })}
            className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
            placeholder='Name or consultant code'
          />
          {errors.marked_completed_by && (
            <p className='text-red-500 text-xs mt-1'>{errors.marked_completed_by.message}</p>
          )}
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 text-sm rounded-md bg-savoy-blue text-white hover:opacity-90'
          >
            Save Changes
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

export default MarkCompleteModal;
