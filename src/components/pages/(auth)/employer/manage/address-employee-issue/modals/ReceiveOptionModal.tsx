import { Dispatch } from 'react';

import ModalLayout from '@/components/ModalLayout';

import { T_ReceiveOptionModal } from '@/types/globals';

import { EnvelopeIcon, HandRaisedIcon } from '@heroicons/react/24/outline';

// Same chooser pattern as Onboarding's OrientOptionModal ("How do you want to do your orientation?")
const ReceiveOptionModal = ({
  isOpen,
  setIsOpen,
  onSelectManualUpload,
}: {
  isOpen: T_ReceiveOptionModal | null;
  setIsOpen: Dispatch<T_ReceiveOptionModal | null>;
  onSelectManualUpload: (data: T_ReceiveOptionModal) => void;
}) => {
  const stepLabel = isOpen?.type === 'decision' ? 'decision' : 'NTE';

  return (
    <ModalLayout
      isOpen={!!isOpen}
      handleClose={() => setIsOpen(null)}
      title={isOpen?.type === 'decision' ? 'Receive Decision' : 'Receive NTE'}
      maxWidth='max-w-xl'
    >
      <div className='text-center py-9 px-4'>
        <p className='text-[1.4rem] mb-2 font-semibold'>How did the employee respond?</p>
        <p className='text-sm text-gray-500 mb-8'>
          Upload the signed {stepLabel} the employee handed over, or record why there is none so the case can move forward.
        </p>
        <div className='flex justify-center'>
          <button
            type='button'
            className='flex flex-col items-center shadow-md border-[1px] border-savoy-blue rounded-[20px] py-5 mx-4 w-[150px] disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={true}
          >
            <EnvelopeIcon className='w-11 h-11 m-2 text-savoy-blue' />
            <span className='text-[12px] font-semibold'>
              Via Email
              <br />
              <span className='font-normal text-gray-500'>Waiting for employee response</span>
            </span>
          </button>
          <button
            type='button'
            className='flex flex-col items-center shadow-md border-[1px] border-savoy-blue rounded-[20px] py-5 mx-4 w-[150px] hover:bg-gray-50'
            onClick={() => {
              if (isOpen) onSelectManualUpload(isOpen);
            }}
          >
            <HandRaisedIcon className='w-11 h-11 m-2 text-savoy-blue' />
            <span className='text-[12px] font-semibold'>
              Manual
              <br />
              Upload
            </span>
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ReceiveOptionModal;
