import { Dispatch, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import ModalLayout from '@/components/ModalLayout';
import CustomToast from '@/components/CustomToast';

import useUpdateChecklist201Requirement from '../hooks/useUpdateChecklist201Requirement';

type FormValues = {
  name: string;
  is_active: boolean;
};

type T_EditModalData = {
  open: boolean;
  id: number;
  name: string;
  is_active: boolean;
};

export default function EditModal({
  isOpen,
  setIsOpen,
  refetch,
}: {
  isOpen: T_EditModalData;
  setIsOpen: Dispatch<T_EditModalData | null>;
  refetch: any;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const { mutate: updateChecklist201Requirement, isLoading } = useUpdateChecklist201Requirement();

  useEffect(() => {
    if (isOpen) {
      reset({ name: isOpen.name, is_active: isOpen.is_active });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    setIsOpen(null);
  };

  const onSubmit = handleSubmit((data) => {
    updateChecklist201Requirement(
      { checklist_201_requirement_id: isOpen.id, data },
      {
        onSuccess: (res: any) => {
          toast.custom(() => <CustomToast message={res.message} type='success' />, { duration: 4000 });
          handleClose();
          refetch();
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, { duration: 5000 });
        },
      }
    );
  });

  return (
    <ModalLayout isOpen={isOpen?.open ?? false} handleClose={handleClose} title='Edit 201 Checklist Requirement' maxWidth='max-w-lg'>
      <form onSubmit={onSubmit}>
        <div className='px-6 pt-6 pb-6'>
          <label htmlFor='name' className='block text-sm font-medium leading-6 text-gray-900'>
            Requirement Name<span className='text-red-600'> *</span>
          </label>
          <input
            id='name'
            type='text'
            {...register('name', { required: 'Requirement name is required.' })}
            className='mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
          />
          {errors?.name && (
            <p className='text-xs text-red-600 mt-1'>{errors.name.message}</p>
          )}

          <label className='mt-4 flex items-center gap-2'>
            <input type='checkbox' {...register('is_active')} className='w-4 h-4 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue' />
            <span className='text-sm font-medium leading-6 text-gray-900'>Active</span>
          </label>
          <p className='text-xs text-gray-500 mt-1'>
            Inactive requirements no longer get added to new applicants&apos; checklists, but stay on checklists that already have them.
          </p>
        </div>
        <div className='flex justify-center w-full px-6 space-x-8 pb-6'>
          <span className='flex w-full rounded-md shadow-sm sm:w-auto'>
            <button
              type='button'
              className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-blue-600 px-10 py-2 bg-white text-sm font-bold text-gray-700 shadow-sm hover:text-gray-500 sm:text-sm'
              onClick={handleClose}
            >
              Cancel
            </button>
          </span>
          <button
            type='submit'
            className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:w-auto disabled:opacity-50'
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
