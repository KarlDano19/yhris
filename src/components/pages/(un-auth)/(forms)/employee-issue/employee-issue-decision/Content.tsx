'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import Image from 'next/image';

import toast from 'react-hot-toast';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

import CustomToast from '@/components/CustomToast';
import ConfirmSubmitModal from '../modals/ConfirmSubmitModal';
import useGetEmployeeIssueActionDetails from '../hooks/useGetEmployeeIssueActionDetails';
import useUpdateEmployeeIssueAction from '../hooks/useUpdateEmployeeIssueAction';
import SignatureModal from '../modals/SignatureModal';

import ConfettiLogo from '@/svg/Confetti';

function Content() {
  const { width, height } = useWindowSize();
  const params = useParams<{ employee_issue_id: string }>();
  const [hasIssue, setHasIssue] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isConfirmSubmitModalOpen, setIsConfirmSubmitModalOpen] = useState(false);
  const [employeeIssueDetails, setEmployeeIssueDetails] = useState<any>({});
  const [signatureFile, setSignatureFile] = useState<File | string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  
  const {
    data: dataEmployeeIssueDecisionDetails,
    isLoading: employeeIssueDecisionDetailsLoading,
    refetch: refetchEmployeeIssueDecisionDetails,
  } = useGetEmployeeIssueActionDetails(params.employee_issue_id || null);
  const { mutate, isLoading } = useUpdateEmployeeIssueAction();

  useEffect(() => {
    if (
      dataEmployeeIssueDecisionDetails &&
      Object.keys(dataEmployeeIssueDecisionDetails).length !== 0 &&
      !employeeIssueDecisionDetailsLoading
    ) {
      setHasIssue(true);
      setEmployeeIssueDetails(dataEmployeeIssueDecisionDetails);

      if (dataEmployeeIssueDecisionDetails.employee_signature) {
        setIsAcknowledged(true);
      }
    }
  }, [dataEmployeeIssueDecisionDetails, employeeIssueDecisionDetailsLoading]);

  // Helper function to convert base64 data URL to File
  const convertDataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: 'image/png' });
  };

  // Handle signature from modal (both drawn and uploaded)
  const handleSignatureSave = async (signatureData: string | File) => {
    try {
      if (typeof signatureData === 'string') {
        // Drawn signature (base64 data URL)
        const signatureFile = await convertDataUrlToFile(signatureData, 'signature.png');
        setSignatureFile(signatureFile);
      } else {
        // Uploaded file
        setSignatureFile(signatureData);
      }
    } catch (error) {
      console.error('Error processing signature:', error);
      toast.custom(() => <CustomToast message="Error processing signature. Please try again." type='error' />, { duration: 4000 });
    }
  };

  // Handle transparency check (optional)
  const handleTransparencyCheck = (result: {hasTransparency: boolean, message: string, type: 'success' | 'warning' | 'error'}) => {
    if (result.type === 'error') {
      toast.custom(() => <CustomToast message={result.message} type='error' />, { duration: 4000 });
    } else if (result.type === 'warning') {
      toast.custom(() => <CustomToast message={result.message} type='warning' />, { duration: 4000 });
    }
  };

  const handleSubmit = () => {
    if (!signatureFile) {
      toast.custom(() => <CustomToast message="Please provide your signature." type='error' />, { duration: 4000 });
      return;
    }

    setIsConfirmSubmitModalOpen(true);
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    
    const callbackReq = {
      onSuccess: (data: any) => {
        setIsAcknowledged(true);
        setIsConfirmSubmitModalOpen(false);
        setIsSubmitting(false);
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
        
        // Refetch decision details to get updated data
        refetchEmployeeIssueDecisionDetails();
      },
      onError: (err: any) => {
        setIsSubmitting(false);
        const errorMessage = typeof err === 'string' ? err : err.message || 'An error occurred';
        toast.custom(() => <CustomToast message={errorMessage} type='error' />, {
          duration: 7000,
        });
      },
    };

    if (signatureFile) {
      try {
        // Ensure we have a File object for upload
        const fileToUpload = typeof signatureFile === 'string' 
          ? await convertDataUrlToFile(signatureFile, 'signature.png')
          : signatureFile;
          
        mutate(
          {
            employee_issue_id: params.employee_issue_id,
            action_type: 'decision',
            employee_signature: fileToUpload,
          },
          callbackReq
        );
      } catch (error) {
        console.error('Error processing signature file:', error);
        toast.custom(() => <CustomToast message="Error processing signature. Please try again." type='error' />, { duration: 4000 });
        setIsSubmitting(false);
      }
    }
  };

  if (employeeIssueDecisionDetailsLoading) {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <div className='fixed z-20 inset-0 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0'>
            <div className='fixed inset-0 transition-opacity'>
              <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
            </div>
            <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
            <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6 py-4 px-8'>
              <div className='text-center sm:text-left'>
                <div className='my-4 flex justify-center'>
                  <svg className='h-[56px] w-[83] mr-3 animate-spin' viewBox='0 0 24 24'>
                    <circle cx='12' cy='12' r='10' stroke='#2757ED' strokeWidth='4' fill='none' />
                    <path
                      fill='#2757ED'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20.735a8 8 0 008-8h4a12 12 0 01-12 12v-4.265zM20 12a8 8 0 01-8 8v4.265a12 12 0 0012-12h-4zm-8-6.735a8 8 0 018-8v-4.265a12 12 0 00-12 12h4z'
                    />
                  </svg>
                </div>
                <h1 className='text-center text-blue-600 text-[32px] font-bold'>Loading...</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasIssue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Employee Issue Decision Not Found</h1>
          <p className="text-gray-600">The employee issue decision you&apos;re looking for could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAcknowledged ? (
        <>
          <div className='w-screen h-screen flex justify-center items-center'>
            <div className='fixed z-20 inset-0 overflow-y-auto'>
              <div className='flex items-center justify-center min-h-screen px-4 pt-2 pb-20 text-center sm:block sm:p-0'>
                <div className='fixed inset-0 transition-opacity'>
                  <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                </div>
                <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
                <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:pb-6 py-4 px-8'>
                  <div className='text-center sm:text-left'>
                    <div className='my-4 flex justify-center'>
                      <ConfettiLogo />
                    </div>
                    <h1 className='text-center text-[#46d663] text-[32px] font-bold'>
                      Thank you for acknowledging the decision!
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Confetti width={width} height={height} />
        </>
      ) : (
        <div className="min-h-screen bg-gray-50">
          {/* Main Content - Side by Side Layout */}
          <div className="mx-auto max-w-7xl h-screen flex justify-center items-center">
            <div className="flex h-[calc(100vh-3rem)] w-full">
              {/* Left Side - PDF Viewer */}
              <div className="flex-1 bg-white border-2 rounded-lg border-gray-200 mr-4">
                <div className="h-full flex flex-col">
                  {/* PDF Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200 rounded-t-lg">
                    <h2 className="text-lg font-semibold text-gray-900">Employee Issue Decision Document</h2>
                    <p className="text-sm text-gray-600 mt-1">Please review the decision document before providing your acknowledgment</p>
                  </div>
                  
                  {/* PDF Content */}
                  <div className="flex-1 p-6">
                    {employeeIssueDetails.nte_attachment ? (
                      <div className="h-full">
                        <iframe
                          src={employeeIssueDetails.nte_attachment}
                          className="w-full h-full border border-gray-300 rounded-lg shadow-sm"
                          title="Decision Document"
                        />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">No Decision Document</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            No attachment was provided with this decision.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Acknowledgment Form */}
              <div className="w-96 bg-white border-2 rounded-lg border-gray-200">
                <div className="h-full flex flex-col">
                  {/* Form Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200 rounded-t-lg">
                    <h2 className="text-lg font-semibold text-gray-900">Decision Acknowledgment</h2>
                    <p className="text-sm text-gray-600 mt-1">Please provide your signature to acknowledge the decision</p>
                  </div>
                  
                  {/* Form Content */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                      {/* Decision Message Display */}
                      {employeeIssueDetails.decision_message && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-blue-900 mb-2">Management Decision:</h3>
                          <div 
                            className="text-sm text-blue-800"
                            dangerouslySetInnerHTML={{ __html: employeeIssueDetails.decision_message }}
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Provide your signature:
                        </label>
                        
                        <div className={`border-2 border-dashed rounded-md p-3 sm:p-6 flex flex-col items-center justify-center ${
                          isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                        }`}>
                          {signatureFile ? (
                            <div className="flex flex-col items-center w-full">
                              <Image 
                                src={typeof signatureFile === 'string' 
                                  ? signatureFile 
                                  : URL.createObjectURL(signatureFile as File)} 
                                alt="Signature Preview" 
                                width={160}
                                height={80}
                                style={{ maxHeight: '6rem', width: 'auto', objectFit: 'contain' }}
                                className="mb-3 sm:mb-4"
                                unoptimized={true}
                              />
                              {!isSubmitting && (
                                <button 
                                  onClick={() => setIsSignatureModalOpen(true)}
                                  className="text-blue-500 text-xs sm:text-sm hover:underline focus:outline-none"
                                >
                                  Change Signature
                                </button>
                              )}
                            </div>
                          ) : (
                            <button 
                              onClick={() => setIsSignatureModalOpen(true)}
                              className="flex flex-col items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3"
                              disabled={isSubmitting}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-12 sm:h-12 text-gray-400">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                <polyline points="10 17 15 12 10 7"></polyline>
                                <line x1="15" y1="12" x2="3" y2="12"></line>
                              </svg>
                              <span className="hover:underline focus:outline-none text-sm sm:text-base text-center text-blue-500">
                                Click to add signature
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isSubmitting || isLoading}
                          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Signature
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="border-t-2 border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
                    <div className="text-center text-xs text-gray-500">
                      <p>
                        If you have any questions about this decision, please contact your HR representative.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <ConfirmSubmitModal
            isOpen={isConfirmSubmitModalOpen}
            setIsOpen={setIsConfirmSubmitModalOpen}
            isLoading={isLoading}
            onSubmit={submitForm}
            title="Are you sure you want to"
            highlightText="submit your signature"
            subtitle="for this decision?"
          />
          
          <SignatureModal
            isOpen={isSignatureModalOpen}
            onClose={() => setIsSignatureModalOpen(false)}
            onSave={handleSignatureSave}
            onTransparencyCheck={handleTransparencyCheck}
          />
        </div>
      )}
    </>
  );
}

export default Content;