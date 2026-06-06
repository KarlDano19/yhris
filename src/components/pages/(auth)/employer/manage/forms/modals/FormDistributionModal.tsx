import React, { Dispatch, useState } from 'react';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import ModalLayout from '@/components/ModalLayout';
import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import EmployeeSelect from '@/components/common/EmployeeSelect';

import useCreateDistribution from '../hooks/useCreateDistribution';
import useSendDistribution from '../hooks/useSendDistribution';

interface Props {
  formId: number;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  onSuccess: () => void;
}

interface DistributionFormData {
  name: string;
  deadline: string;
  employees: number[];
  message: string;
  send_now: boolean;
}

const FormDistributionModal = ({ formId, isOpen, setIsOpen, onSuccess }: Props) => {
  const [employeeSearch, setEmployeeSearch] = useState('');

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DistributionFormData>({
    defaultValues: { send_now: true, employees: [] },
  });

  const { mutate: createDistribution, isLoading: isCreating } = useCreateDistribution();
  const { mutate: sendDistribution, isLoading: isSending } = useSendDistribution();

  const isLoading = isCreating || isSending;
  const deadlineValue = watch('deadline');

  const handleClose = () => {
    reset();
    setEmployeeSearch('');
    setIsOpen(false);
  };

  const onSubmit = (values: DistributionFormData) => {
    const employeeIds = values.employees ?? [];

    if (employeeIds.length === 0) {
      toast.custom(
        () => <CustomToast message='Please select at least one employee.' type='error' />,
        { duration: 4000 }
      );
      return;
    }

    const payload = {
      name: values.name,
      employees: employeeIds,
      deadline: values.deadline || null,
      message: values.message || '',
    };

    createDistribution(
      { formId, data: payload },
      {
        onSuccess: (res: any) => {
          const distributionId = res?.data?.id;
          if (values.send_now && distributionId) {
            sendDistribution(distributionId, {
              onSuccess: () => {
                toast.custom(
                  () => (
                    <CustomToast
                      message={`Form distributed to ${employeeIds.length} employee(s).`}
                      type='success'
                    />
                  ),
                  { duration: 4000 }
                );
                handleClose();
                onSuccess();
              },
              onError: (err: any) => {
                toast.custom(
                  () => <CustomToast message={err?.message ?? 'Failed to send emails.'} type='error' />,
                  { duration: 4000 }
                );
              },
            });
          } else {
            toast.custom(
              () => <CustomToast message='Distribution created. Send it when ready.' type='success' />,
              { duration: 4000 }
            );
            handleClose();
            onSuccess();
          }
        },
        onError: (err: any) => {
          toast.custom(
            () => <CustomToast message={err?.message ?? 'Failed to create distribution.'} type='error' />,
            { duration: 4000 }
          );
        },
      }
    );
  };

  return (
    <ModalLayout
      title='Distribute Form'
      isOpen={isOpen}
      handleClose={handleClose}
      maxWidth='max-w-lg'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-6'>
        {/* Distribution Name */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Distribution Name <span className='text-red-500'>*</span>
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            placeholder='e.g. Q2 2025 Exit Survey'
            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
          />
          {errors.name && (
            <p className='mt-1 text-xs text-red-500'>{errors.name.message}</p>
          )}
        </div>

        {/* Employees */}
        <div>
          <div className='flex items-center justify-between mb-1'>
            <label className='block text-sm font-medium text-gray-700'>
              Employees <span className='text-red-500'>*</span>
            </label>
            {watch('employees')?.length > 0 && (
              <button
                type='button'
                className='text-xs text-red-600 hover:text-red-800 hover:underline'
                onClick={() => setValue('employees', [])}
              >
                Unselect All
              </button>
            )}
          </div>
          <EmployeeSelect
            control={control}
            name='employees'
            label=''
            required={true}
            placeholder='Select employees...'
            isMulti={true}
            isClearable={false}
            employeeSearch={employeeSearch}
            setEmployeeSearch={setEmployeeSearch}
            className=''
            showEmail={true}
          />
          {errors.employees && (
            <p className='mt-1 text-xs text-red-500'>Please select at least one employee.</p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Deadline <span className='text-gray-400 font-normal text-xs'>(optional)</span>
          </label>
          <CustomDatePicker
            id='distribution-deadline'
            placeholder='mm/dd/yyyy'
            className='appearance-none block w-full rounded-md py-1.5 px-3 md:pl-3 md:pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm leading-6'
            selected={deadlineValue}
            pickerOnChange={(date: any) => setValue('deadline', date)}
            inputOnChange={(value: any) => setValue('deadline', value)}
          />
        </div>

        {/* Message */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Message <span className='text-gray-400 font-normal text-xs'>(optional)</span>
          </label>
          <textarea
            {...register('message')}
            rows={3}
            placeholder='Add a personal message to accompany the form link...'
            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 resize-none'
          />
        </div>

        {/* Send Now */}
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='send_now'
            {...register('send_now')}
            className='h-4 w-4 rounded border-gray-300 text-savoy-blue focus:ring-savoy-blue'
          />
          <label htmlFor='send_now' className='text-sm text-gray-700'>
            Send emails immediately
          </label>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 pt-2 border-t border-gray-100'>
          <button
            type='button'
            onClick={handleClose}
            className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='rounded-md bg-green-500 px-5 py-2 text-sm font-semibold text-white shadow hover:shadow-md disabled:opacity-50'
          >
            {isLoading ? 'Saving...' : 'Distribute'}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}

export default FormDistributionModal
