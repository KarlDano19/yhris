import { Dispatch } from 'react';

import ModalLayout from '@/components/ModalLayout';

const ViewBenefitModal = ({
  isOpen,
  setIsOpen,
  benefit,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  benefit: any;
}) => {
  const handleClose = () => setIsOpen(false);

  const registeredRecipients = benefit?.registered_recipients || [];
  const externalRecipients = benefit?.external_recipients || [];

  const renderField = (label: string, value: string) => {
    if (!value) return null;
    return (
      <div>
        <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>{label}</h4>
        <p className='mt-1 text-sm text-gray-800 whitespace-pre-wrap break-words'>{value}</p>
      </div>
    );
  };

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title='View Benefit' maxWidth='max-w-2xl'>
      <div className='p-6 max-h-[70vh] overflow-y-auto space-y-4'>
        <div>
          <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Title</h4>
          <p className='mt-1 text-sm font-semibold text-gray-900'>{benefit?.title}</p>
        </div>

        <div>
          <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Sent to</h4>
          <div className='mt-1 flex flex-col gap-0.5'>
            {registeredRecipients.map((recipient: any, index: number) => (
              <span key={`registered-${index}`} className='text-sm text-gray-800'>
                {recipient.name} <span className='text-gray-500'>({recipient.email})</span>
              </span>
            ))}
            {externalRecipients.map((email: string, index: number) => (
              <span key={`external-${index}`} className='text-sm text-gray-800'>{email}</span>
            ))}
            {registeredRecipients.length === 0 && externalRecipients.length === 0 && (
              <span className='text-sm text-gray-300'>—</span>
            )}
          </div>
        </div>

        {renderField('Purpose', benefit?.purpose)}
        {renderField('Benefits', benefit?.benefits)}
        {renderField('Coverage', benefit?.coverage)}
        {renderField('Eligibility', benefit?.eligibility)}

        <div className='flex justify-end pt-2'>
          <button
            type='button'
            className='rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50'
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ViewBenefitModal;
