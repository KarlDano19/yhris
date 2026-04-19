'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ClipboardDocumentCheckIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

import useUpdateEAF from '../../hooks/eaf/useUpdateEAF';
import CustomToast from '@/components/CustomToast';
import toast from 'react-hot-toast';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDone: () => void;
  applicationId: number;
  applicantName?: string;
  positionTitle?: string;
};

export default function FinalizeApprovalFormModal({
  isOpen,
  onClose,
  onDone,
  applicationId,
  applicantName,
  positionTitle,
}: Props) {
  const [recruitmentNotes, setRecruitmentNotes] = useState('');

  const updateEAF = useUpdateEAF();

  const handleClose = () => {
    setRecruitmentNotes('');
    onClose();
  };

  const handleGeneratePreview = async () => {
    try {
      await updateEAF.mutateAsync({
        appliedJobId: applicationId,
        recruitment_notes: recruitmentNotes || undefined,
      });
      onDone();
    } catch (err: any) {
      toast.custom(() => <CustomToast message={err.message || 'Failed to update EAF.'} type='error' />, { duration: 4000 });
    }
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-40' onClose={handleClose}>
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
            <div className='flex min-h-full items-center justify-center p-4'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg'>
                  {/* Header */}
                  <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100'>
                        <ClipboardDocumentCheckIcon className='h-5 w-5 text-blue-600' />
                      </div>
                      <Dialog.Title as='h3' className='text-base font-bold text-gray-900'>
                        Finalize Approval Form
                      </Dialog.Title>
                    </div>
                    <button type='button' onClick={handleClose} className='text-gray-400 hover:text-gray-600'>
                      <XMarkIcon className='h-5 w-5' />
                    </button>
                  </div>

                  {/* Body */}
                  <div className='px-6 py-5 space-y-5'>
                    {/* Recruitment Notes */}
                    <div>
                      <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>
                        Add Recruitment Notes & Recommendations
                      </p>
                      <textarea
                        value={recruitmentNotes}
                        onChange={(e) => setRecruitmentNotes(e.target.value)}
                        rows={5}
                        placeholder="Provide justifications for the hire, specific skills identified during screening, or any special conditions for the CEO's review..."
                        className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                      />
                      <p className='text-xs text-gray-400 italic mt-1.5'>
                        This note will be visible in the screening &amp; approval history section of the generated document.
                      </p>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className='flex justify-end gap-3 px-6 py-4 border-t border-gray-100'>
                    <button
                      type='button'
                      onClick={handleClose}
                      className='text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2'
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={handleGeneratePreview}
                      disabled={updateEAF.isLoading}
                      className='flex items-center gap-2 bg-blue-600 text-white rounded-lg py-2 px-5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60'
                    >
                      <EyeIcon className='h-4 w-4' />
                      {updateEAF.isLoading ? 'Saving...' : 'Generate Preview'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>

        </Dialog>
      </Transition.Root>
    </>
  );
}
