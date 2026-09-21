'use client';

import { Dispatch, useEffect } from 'react';

import ModalLayout from '@/components/ModalLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import useGetDirectiveDetails from '../hooks/useGetDirectiveDetails';

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

  useEffect(() => {
    if (isOpen && directiveId) {
      refetch();
    }
  }, [isOpen, directiveId, refetch]);

  const handleClose = () => setIsOpen(false);

  const documentUrl = typeof data?.document === 'string' ? data.document : '';
  const signatories = data?.signatories || [];

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

            {/* Signatories */}
            <div className='lg:flex-[1]'>
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
    </ModalLayout>
  );
};

export default ViewDirectiveModal;
