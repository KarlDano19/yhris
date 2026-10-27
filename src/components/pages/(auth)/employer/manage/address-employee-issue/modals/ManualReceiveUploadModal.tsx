import { Dispatch, useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';

import ModalLayout from '@/components/ModalLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

import { T_ManualReceivePayload, T_ReceiveOptionModal } from '@/types/globals';

import SelectChevronDown from '@/svg/SelectChevronDown';
import Warning from '@/svg/Warning';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_FILE_TYPES =
  'image/jpeg, image/png, application/msword, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document';

// Reasons HR can give when proceeding without a signed copy (match RECEIPT_TYPE_CHOICES on the backend)
const NOT_RECEIVED_REASONS = [
  { value: 'no_response', label: 'No response within the deadline' },
  { value: 'refused_to_sign', label: 'Employee refused to sign' },
  { value: 'other', label: 'Other' },
];

type T_ManualReceiveForm = {
  file: FileList;
  receiptType: string;
  receiptOtherReason: string;
  receiptRemarks: string;
};

const ManualReceiveUploadModal = ({
  isOpen,
  setIsOpen,
  onConfirm,
  isLoading,
}: {
  isOpen: T_ReceiveOptionModal | null;
  setIsOpen: Dispatch<T_ReceiveOptionModal | null>;
  onConfirm: (payload: T_ManualReceivePayload) => void;
  isLoading: boolean;
}) => {
  const formMethods = useForm<T_ManualReceiveForm>({
    defaultValues: { receiptType: 'no_response', receiptOtherReason: '', receiptRemarks: '' },
  });
  const {
    control,
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = formMethods;
  // null = asking the question, true = YES (signed copy), false = NO (proceed without it)
  const [hasReceivedSignedCopy, setHasReceivedSignedCopy] = useState<boolean | null>(null);

  const stepLabel = isOpen?.type === 'decision' ? 'decision' : 'NTE';
  const isOtherReason = watch('receiptType') === 'other';

  const handleClose = () => {
    if (isLoading) return;
    reset();
    setHasReceivedSignedCopy(null);
    setIsOpen(null);
  };

  const handleBack = () => {
    reset();
    setHasReceivedSignedCopy(null);
  };

  const onSubmit = handleSubmit((data) => {
    const file = data.file?.[0];
    if (hasReceivedSignedCopy) {
      onConfirm({ receiptType: 'signed_copy', file });
    } else {
      onConfirm({
        receiptType: data.receiptType,
        receiptOtherReason: data.receiptType === 'other' ? data.receiptOtherReason.trim() : undefined,
        receiptRemarks: data.receiptRemarks.trim(),
        file,
      });
    }
  });

  const getTitle = () => {
    if (hasReceivedSignedCopy === false) {
      return isOpen?.type === 'decision' ? 'Proceed Without Signed Decision' : 'Proceed Without Signed NTE';
    }
    return isOpen?.type === 'decision' ? 'Upload Signed Decision' : 'Upload Signed NTE';
  };

  return (
    <ModalLayout isOpen={!!isOpen} handleClose={handleClose} title={getTitle()} maxWidth='max-w-xl'>
      {hasReceivedSignedCopy === null ? (
        // Step 1 — ask first (like Onboarding's NoticeModal)
        <div className='p-9 space-y-5'>
          <div className='flex justify-center'>
            <Warning />
          </div>
          <h5 className='text-xl font-bold text-indigo-dye text-center'>
            Have you already RECEIVED the signed {stepLabel.toUpperCase()} from the EMPLOYEE?
          </h5>
          <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:justify-between'>
            <button
              type='button'
              className='flex-1 sm:ml-10 justify-center items-center gap-2 text-lg block sm:flex m-auto font-bold leading-6 text-white bg-savoy-blue shadow-sm py-3 px-6 rounded-md transition-all'
              onClick={() => setHasReceivedSignedCopy(true)}
            >
              YES, I HAVE.
            </button>
            <button
              type='button'
              className='flex-1 justify-center text-lg block sm:flex m-auto font-bold leading-6 text-savoy-blue shadow-sm border border-savoy-blue py-3 px-6 rounded-lg transition-all mt-3 sm:mt-0'
              onClick={() => setHasReceivedSignedCopy(false)}
            >
              NO, I HAVEN&apos;T.
            </button>
          </div>
        </div>
      ) : (
        // Step 2 — YES: upload the signed copy. NO: give the reason, proof of service is optional
        <form onSubmit={onSubmit}>
          <div className='px-4 pt-4 pb-6 space-y-4'>
            {hasReceivedSignedCopy ? (
              <p className='text-sm text-gray-600'>
                Upload the signed {stepLabel} the employee handed over. The {stepLabel} will be marked as received.
              </p>
            ) : (
              <>
                <p className='text-sm text-gray-600'>
                  The {stepLabel} will be recorded without a signed copy so the case can move forward. The employee can
                  still respond through the email link.
                </p>
                <div>
                  <label htmlFor='manual-receive-reason' className='block text-sm font-medium leading-6 text-gray-900'>
                    Reason <span className='text-red-500'>*</span>
                  </label>
                  <div className='mt-2'>
                    <Controller
                      name='receiptType'
                      control={control}
                      rules={{ required: 'Please select a reason.' }}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          inputId='manual-receive-reason'
                          className='text-sm'
                          classNamePrefix='select'
                          options={NOT_RECEIVED_REASONS}
                          value={NOT_RECEIVED_REASONS.find((reason) => reason.value === value) || null}
                          onChange={(option) => onChange(option ? option.value : '')}
                          components={{
                            DropdownIndicator: () => (
                              <div className='pointer-events-none px-2'>
                                <SelectChevronDown />
                              </div>
                            ),
                            IndicatorSeparator: () => null,
                          }}
                          isClearable={false}
                          isSearchable={false}
                          placeholder='Select reason...'
                          menuPortalTarget={document.body}
                          menuPosition='fixed'
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 50 }),
                            menu: (base) => ({ ...base, zIndex: 50 }),
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.receiptType && <span className='text-sm text-red-500'>{errors.receiptType.message}</span>}
                  {isOtherReason && (
                    <div className='mt-2'>
                      <input
                        id='manual-receive-other-reason'
                        type='text'
                        maxLength={255}
                        placeholder='Please specify the reason...'
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-savoy-blue sm:text-sm sm:leading-6'
                        {...register('receiptOtherReason', {
                          shouldUnregister: true,
                          validate: (value) => (value || '').trim().length > 0 || 'Please specify the reason.',
                        })}
                      />
                      {errors.receiptOtherReason && (
                        <span className='text-sm text-red-500'>{errors.receiptOtherReason.message}</span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor='manual-receive-remarks' className='block text-sm font-medium leading-6 text-gray-900'>
                    Remarks <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    id='manual-receive-remarks'
                    rows={3}
                    placeholder='e.g. NTE served on 07/20, no reply after 5 days'
                    className='mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6'
                    {...register('receiptRemarks', {
                      validate: (value) => value.trim().length > 0 || 'Please explain why there is no signed copy.',
                    })}
                  />
                  {errors.receiptRemarks && (
                    <span className='text-sm text-red-500'>{errors.receiptRemarks.message}</span>
                  )}
                </div>
              </>
            )}
            <div>
              <label htmlFor='manual-receive-file' className='block text-sm font-medium leading-6 text-gray-900'>
                {hasReceivedSignedCopy ? (
                  <>
                    Signed {stepLabel} <span className='text-red-500'>*</span>
                  </>
                ) : (
                  'Proof of service (optional)'
                )}
              </label>
              <div className='mt-2'>
                <input
                  id='manual-receive-file'
                  type='file'
                  accept={ACCEPTED_FILE_TYPES}
                  className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100'
                  {...register('file', {
                    validate: {
                      required: (files) =>
                        !hasReceivedSignedCopy || files?.length > 0 || 'Please upload the signed document.',
                      maxSize: (files) => (files?.[0]?.size ?? 0) <= MAX_FILE_SIZE || 'Maximum file size is 5mb.',
                    },
                  })}
                />
              </div>
              <p className='text-xs mt-1 text-gray-400'>
                {hasReceivedSignedCopy
                  ? 'PDF, Word or image. Maximum file size: 5mb'
                  : 'e.g. email screenshot, courier receipt or witness note. Maximum file size: 5mb'}
              </p>
              {errors.file && <span className='text-sm text-red-500'>{errors.file.message}</span>}
            </div>
          </div>
          <hr />
          <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4 pb-4'>
            <button
              type='submit'
              className='inline-flex w-full justify-center items-center gap-2 rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto disabled:opacity-75'
              disabled={isLoading}
            >
              {isLoading && <LoadingSpinner size='xs' color='white' />}
              {hasReceivedSignedCopy ? 'Mark as Received' : 'Proceed'}
            </button>
            <button
              type='button'
              className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-75'
              disabled={isLoading}
              onClick={handleBack}
            >
              Back
            </button>
          </div>
        </form>
      )}
    </ModalLayout>
  );
};

export default ManualReceiveUploadModal;
