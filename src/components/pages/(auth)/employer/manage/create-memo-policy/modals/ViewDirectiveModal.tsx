'use client';

import { Dispatch, useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import ModalLayout from '@/components/ModalLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomToast from '@/components/CustomToast';
import useGetDirectiveDetails from '../hooks/useGetDirectiveDetails';
import useRegenerateDirectiveSummary from '../hooks/useRegenerateDirectiveSummary';

import { ArrowPathIcon } from '@heroicons/react/24/outline';

const StatusBadge = ({ status }: { status?: string }) => (
  <span
    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
      status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
    }`}
  >
    {status === 'signed' ? 'Signed' : 'Pending'}
  </span>
);

const ViewDirectiveModal = ({
  isOpen,
  setIsOpen,
  directiveId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  directiveId: number | null;
}) => {
  const { data, refetch, isFetching } = useGetDirectiveDetails(directiveId);
  const regenerateSummaryMutation = useRegenerateDirectiveSummary();
  // Set right after a Regenerate click so the panel says "generating" without a refetch
  const [isRegenerateQueued, setIsRegenerateQueued] = useState(false);

  useEffect(() => {
    if (isOpen && directiveId) {
      setIsRegenerateQueued(false);
      refetch();
    }
  }, [isOpen, directiveId, refetch]);

  const handleRegenerateSummary = async () => {
    if (!directiveId) return;
    try {
      const response = await regenerateSummaryMutation.mutateAsync(directiveId);
      setIsRegenerateQueued(true);
      toast.custom(() => <CustomToast message={response?.message || 'The summary is being generated.'} type='success' />, {
        duration: 4000,
      });
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.custom(() => <CustomToast message={msg} type='error' />, { duration: 4000 });
    }
  };

  const handleClose = () => setIsOpen(false);

  const documentUrl = typeof data?.document === 'string' ? data.document : '';
  const signatories = data?.signatories || [];
  const summaryStatus: string = isRegenerateQueued ? 'pending' : data?.brief_explanation_status || 'pending';

  return (
    <ModalLayout isOpen={isOpen} handleClose={handleClose} title='View Memo/Policy' maxWidth='max-w-5xl'>
      <div className='p-6'>
        {isFetching ? (
          <div className='flex h-[60vh] items-center justify-center'>
            <LoadingSpinner size='lg' showText text='Loading document...' />
          </div>
        ) : (
          <div className='flex flex-col gap-6 lg:flex-row'>
            {/* Document preview */}
            <div className='lg:flex-[2]'>
              <p className='mb-2 text-sm font-medium text-gray-900'>Document</p>
              {documentUrl ? (
                <iframe
                  src={documentUrl}
                  title='Memo/Policy document'
                  className='h-[60vh] w-full rounded border border-gray-200'
                />
              ) : (
                <div className='flex h-[60vh] items-center justify-center rounded border border-gray-200 text-sm text-gray-400'>
                  No rendered document available.
                </div>
              )}
            </div>

            <div className='flex flex-col gap-6 lg:flex-[1]'>
              {/* AI Brief Explanation */}
              <div>
                <div className='mb-2 flex items-center justify-between gap-2'>
                  <p className='text-sm font-medium text-gray-900'>Brief Explanation</p>
                  <button
                    type='button'
                    onClick={handleRegenerateSummary}
                    disabled={regenerateSummaryMutation.isLoading || isRegenerateQueued}
                    data-tooltip-id='regenerate-summary-tooltip'
                    data-tooltip-content='Generate the AI summary again'
                    data-tooltip-place='bottom'
                    className='flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    {regenerateSummaryMutation.isLoading ? (
                      <LoadingSpinner size='xs' />
                    ) : (
                      <ArrowPathIcon className='h-4 w-4' />
                    )}
                    Regenerate summary
                  </button>
                </div>
                {summaryStatus === 'done' && data?.brief_explanation ? (
                  <p className='whitespace-pre-line rounded-md border border-gray-200 p-3 text-sm text-gray-700'>
                    {data.brief_explanation}
                  </p>
                ) : summaryStatus === 'failed' ? (
                  <p className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
                    The summary could not be generated. Click Regenerate summary to try again.
                  </p>
                ) : (
                  <p className='rounded-md border border-gray-200 p-3 text-sm italic text-gray-400'>
                    {isRegenerateQueued
                      ? 'The summary is being generated. Reopen this memo/policy in a moment to see it.'
                      : 'No summary yet. It is generated automatically, or click Regenerate summary.'}
                  </p>
                )}
              </div>

              {/* Signatories */}
              <div>
                <p className='mb-2 text-sm font-medium text-gray-900'>Signatories</p>
                {signatories.length === 0 ? (
                  <p className='text-sm text-gray-400'>No signatories assigned.</p>
                ) : (
                  <ul className='space-y-3'>
                    {signatories.map((signatory: any) => (
                      <li
                        key={signatory.id}
                        className='rounded-md border border-gray-200 p-3'
                      >
                        <div className='flex items-center justify-between gap-2'>
                          <span className='text-sm font-semibold text-gray-800'>{signatory.user_name}</span>
                          <StatusBadge status={signatory.status} />
                        </div>
                        {signatory.signature_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={signatory.signature_url}
                            alt={`${signatory.user_name} signature`}
                            className='mt-2 max-h-16 object-contain'
                          />
                        ) : (
                          <p className='mt-2 text-xs italic text-gray-400'>Awaiting signature</p>
                        )}
                        {signatory.signed_at && (
                          <p className='mt-1 text-xs text-gray-400'>
                            Signed {new Date(signatory.signed_at).toLocaleString()}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center justify-end gap-2 border-t border-gray-200 px-6 py-4'>
        <button
          type='button'
          onClick={handleClose}
          className='rounded-md bg-savoy-blue px-4 py-1.5 text-sm font-semibold text-white'
        >
          Close
        </button>
      </div>
      <Tooltip id='regenerate-summary-tooltip' />
    </ModalLayout>
  );
};

export default ViewDirectiveModal;
