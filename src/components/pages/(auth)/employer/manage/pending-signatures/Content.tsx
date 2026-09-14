'use client';

import { useState } from 'react';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import SignatureModal from '../create-memo-policy/modals/SignatureModal';
import useGetPendingSignatures, { PendingSignature } from './hooks/useGetPendingSignatures';
import useSignDocument from './hooks/useSignDocument';

const PendingSignaturesContent = () => {
  const { data: pendingSignatures, isLoading, isError } = useGetPendingSignatures();
  const { mutateAsync: signDocument, isLoading: isSigning } = useSignDocument();

  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [activeSignatory, setActiveSignatory] = useState<PendingSignature | null>(null);

  // SignatureModal returns a base64 data URL; convert it to a blob and submit.
  const handleSignatureCaptured = async (dataUrl: string) => {
    if (!activeSignatory || !dataUrl) return;
    try {
      const signatureBlob = await fetch(dataUrl).then((res) => res.blob());
      await signDocument({ signatoryId: activeSignatory.signatory_id, signature: signatureBlob });
      toast.custom(() => <CustomToast message='Signed successfully.' type='success' />, { duration: 4000 });
    } catch (error: any) {
      toast.custom(() => <CustomToast message={error.message || 'Failed to sign.'} type='error' />, {
        duration: 5000,
      });
    } finally {
      setActiveSignatory(null);
    }
  };

  return (
    <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
      <h1 className='text-2xl font-bold text-gray-900 my-6'>Pending Signatures</h1>

      {isLoading ? (
        <div className='flex justify-center py-16'>
          <LoadingSpinner size='lg' showText text='Loading pending signatures...' />
        </div>
      ) : isError ? (
        <p className='text-sm text-red-500'>Failed to load pending signatures.</p>
      ) : !pendingSignatures || pendingSignatures.length === 0 ? (
        <p className='text-sm text-gray-500 py-16 text-center'>You have no documents awaiting your signature.</p>
      ) : (
        <div className='overflow-x-auto rounded-lg border border-gray-200'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>Title</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>Type</th>
                <th className='px-4 py-3 text-center text-sm font-semibold text-gray-900'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {pendingSignatures.map((signatory) => (
                <tr key={signatory.signatory_id}>
                  <td className='px-4 py-4 text-sm text-gray-800'>{signatory.title || '—'}</td>
                  <td className='px-4 py-4 text-sm capitalize text-gray-500'>{signatory.directive_type || '—'}</td>
                  <td className='px-4 py-4 text-center'>
                    <button
                      type='button'
                      disabled={isSigning}
                      onClick={() => {
                        setActiveSignatory(signatory);
                        setSignatureModalOpen(true);
                      }}
                      className='rounded-md bg-savoy-blue px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50'
                    >
                      Sign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SignatureModal
        isOpen={signatureModalOpen}
        setIsOpen={setSignatureModalOpen}
        setSignatureUrl={handleSignatureCaptured}
      />
    </div>
  );
};

export default PendingSignaturesContent;
