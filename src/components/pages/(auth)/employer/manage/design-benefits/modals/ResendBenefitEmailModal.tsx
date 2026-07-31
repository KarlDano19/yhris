import { Dispatch } from 'react';

import toast from 'react-hot-toast';

import ModalLayout from '@/components/ModalLayout';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import useResendBenefitEmail from '../hooks/useResendBenefitEmail';

const ResendBenefitEmailModal = ({
  isOpen,
  setIsOpen,
  benefit,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  benefit: any;
  refetch: any;
}) => {
  const { mutate: resendEmail, isLoading } = useResendBenefitEmail();

  const handleClose = () => {
    if (isLoading) return;
    setIsOpen(false);
  };

  const handleConfirm = () => {
    resendEmail(benefit.id, {
      onSuccess: () => {
        toast.custom(() => <CustomToast message='Benefit email resent successfully.' type='success' />, { duration: 5000 });
        refetch();
        setIsOpen(false);
      },
      onError: (error: any) => {
        toast.custom(() => <CustomToast message={error?.toString() || 'Failed to resend benefit email.'} type='error' />, { duration: 5000 });
      },
    });
  };

  const recipientCount = benefit?.to?.length || 0;

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title='Resend Benefit Email' maxWidth='max-w-md'>
      <div className='p-6'>
        <p className='text-sm text-gray-700'>
          Resend the <span className='font-semibold'>{benefit?.title}</span> benefit email to {recipientCount} recipient
          {recipientCount === 1 ? '' : 's'}?
        </p>
        <p className='text-sm text-gray-500 mt-2'>
          The email content will be regenerated from this benefit{`'`}s current purpose, benefits, coverage, and eligibility.
        </p>

        <div className='flex justify-end gap-3 mt-6'>
          <button
            type='button'
            className='rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50'
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type='button'
            className='rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-md disabled:opacity-50 flex items-center gap-2'
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <LoadingSpinner size='xs' color='white' />}
            Resend
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ResendBenefitEmailModal;
