'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import toast from 'react-hot-toast';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import SignatureModal from '../(forms)/employee-issue/modals/SignatureModal';
import { useGetSeparationById } from './hooks/useGetSeparationById';
import useAcknowledgeSeparation from './hooks/useAcknowledgeSeparation';

import ConfettiLogo from '@/svg/Confetti';

const Content = () => {
  const params = useParams();
  const separationId = params.id as string;
  const { width, height } = useWindowSize();

  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: separation,
    isLoading: isLoadingSeparation,
    error: separationError,
    refetch,
  } = useGetSeparationById(separationId);

  const { mutate: acknowledgeSeparation } = useAcknowledgeSeparation();

  // Convert base64 data URL to File
  const convertDataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: 'image/png' });
  };

  const handleSignatureSave = async (signatureData: string | File) => {
    try {
      if (typeof signatureData === 'string') {
        const file = await convertDataUrlToFile(signatureData, 'signature.png');
        setSignatureFile(file);
      } else {
        setSignatureFile(signatureData);
      }
    } catch {
      toast.custom(() => <CustomToast message="Error processing signature. Please try again." type="error" />, { duration: 4000 });
    }
  };

  const handleTransparencyCheck = (result: { hasTransparency: boolean; message: string; type: 'success' | 'warning' | 'error' }) => {
    if (result.type === 'error') {
      toast.custom(() => <CustomToast message={result.message} type="error" />, { duration: 4000 });
    } else if (result.type === 'warning') {
      toast.custom(() => <CustomToast message={result.message} type="warning" />, { duration: 4000 });
    }
  };

  const handleSubmit = async () => {
    if (!signatureFile) {
      toast.custom(() => <CustomToast message="Please provide your signature." type="error" />, { duration: 4000 });
      return;
    }

    setIsSubmitting(true);

    try {
      const fileToUpload = typeof signatureFile === 'string'
        ? await convertDataUrlToFile(signatureFile, 'signature.png')
        : signatureFile;

      acknowledgeSeparation(
        { separation_id: Number(separationId), signature: fileToUpload },
        {
          onSuccess: () => {
            setIsAcknowledged(true);
            setIsSubmitting(false);
            refetch();
          },
          onError: (error) => {
            setIsSubmitting(false);
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit signature';
            toast.custom(() => <CustomToast message={errorMessage} type="error" />, { duration: 7000 });
          },
        }
      );
    } catch {
      setIsSubmitting(false);
      toast.custom(() => <CustomToast message="Error processing signature. Please try again." type="error" />, { duration: 4000 });
    }
  };

  if (isLoadingSeparation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" color="yellow" />
      </div>
    );
  }

  if (separationError || !separation) {
    const errorMessage = separationError instanceof Error ? separationError.message : 'Unknown error';
    const errorStatus = errorMessage.includes('403') ? 403
      : errorMessage.includes('404') ? 404
      : errorMessage.includes('410') ? 410
      : 500;

    const errorTitle = errorStatus === 403 ? 'Access Denied'
      : errorStatus === 404 ? 'Separation Not Found'
      : errorStatus === 410 ? 'Separation Deleted'
      : 'Error Loading Separation';

    const errorDescription = errorStatus === 403 ? "You don't have permission to view this separation document."
      : errorStatus === 404 ? 'The requested separation document does not exist.'
      : errorStatus === 410 ? 'This separation has been deleted by your HR administrator and is no longer available.'
      : 'There was a problem loading this separation document. Please try again later.';

    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">{errorTitle}</p>
          <p className="text-sm mt-2">{errorDescription}</p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Already acknowledged state
  if (separation.is_letter_received || isAcknowledged) {
    return (
      <>
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="fixed z-20 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6 py-4 px-8">
                <div className="text-center sm:text-left">
                  <div className="my-4 flex justify-center">
                    <ConfettiLogo />
                  </div>
                  <h1 className="text-center text-[#46d663] text-[32px] font-bold">
                    Thank you for acknowledging the letter!
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Confetti width={width} height={height} />
      </>
    );
  }

  const letterType = separation.letter_attachment &&
    separation.letter_attachment.includes('acceptance') ? 'Acceptance' : 'Separation';

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-screen-2xl h-screen flex justify-center items-center">
          <div className="flex h-[calc(100vh-3rem)] w-full">
            {/* Left Side — PDF or letter content */}
            <div className="flex-1 bg-white border-2 rounded-lg border-gray-200 mr-4">
              <div className="h-full flex flex-col">
                <div className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-gray-900">Letter of {letterType}</h2>
                  <p className="text-sm text-gray-600 mt-1">Please review the letter before providing your signature</p>
                </div>

                <div className="flex-1 p-6">
                  {separation.letter_attachment ? (
                    <div className="h-full">
                      <iframe
                        src={separation.letter_attachment}
                        className="w-full h-full border border-gray-300 rounded-lg shadow-sm"
                        title="Separation Letter"
                      />
                    </div>
                  ) : (
                    <div className="h-full overflow-y-auto">
                      <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div><span className="font-medium">Position:</span> {separation.position}</div>
                          <div><span className="font-medium">Department:</span> {separation.department}</div>
                          <div><span className="font-medium">Separation Date:</span> {separation.date_of_separation ? new Date(separation.date_of_separation).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</div>
                          <div><span className="font-medium">Reason:</span> {separation.reason_of_leaving}</div>
                        </div>
                      </div>
                      {separation.message ? (
                        <div className="ql-editor !p-0 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: separation.message }} />
                      ) : (
                        <p className="text-gray-500 italic">No letter content available.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side — Signature panel */}
            <div className="w-96 bg-white border-2 rounded-lg border-gray-200">
              <div className="h-full flex flex-col">
                <div className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-gray-900">Letter Acknowledgment</h2>
                  <p className="text-sm text-gray-600 mt-1">Please provide your signature to acknowledge the letter</p>
                </div>

                <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Provide your signature:
                    </label>

                    <div
                      className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        isSubmitting ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300 hover:border-yellow-400'
                      }`}
                      onClick={() => !isSubmitting && setIsSignatureModalOpen(true)}
                    >
                      {signatureFile ? (
                        <div className="flex flex-col items-center w-full">
                          <img
                            src={signatureFile instanceof File ? URL.createObjectURL(signatureFile) : signatureFile}
                            alt="Your signature"
                            className="max-h-24 object-contain mb-2"
                          />
                          <p className="text-xs text-gray-500">Click to change signature</p>
                        </div>
                      ) : (
                        <>
                          <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <p className="text-sm text-gray-500">Click to add signature</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleSubmit}
                      disabled={!signatureFile || isSubmitting}
                      className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
                        !signatureFile || isSubmitting
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-[#355FD0] hover:bg-[#2347B2]'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Signature'}
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      If you have any questions about this decision, please contact your HR representative.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureSave}
        onTransparencyCheck={handleTransparencyCheck}
      />
    </>
  );
};

export default Content;
