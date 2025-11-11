'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import toast from 'react-hot-toast';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

import CustomToast from '@/components/CustomToast';
import ConfirmSubmitModal from '../modals/ConfirmSubmitModal';
import useGetEmployeeIssueActionDetails from '../hooks/useGetEmployeeIssueActionDetails';
import useUpdateEmployeeIssueAction from '../hooks/useUpdateEmployeeIssueAction';

import ConfettiLogo from '@/svg/Confetti';

function Content() {
  const { width, height } = useWindowSize();
  const params = useParams<{ employee_issue_id: string }>();
  const [hasIssue, setHasIssue] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmSubmitModalOpen, setIsConfirmSubmitModalOpen] = useState(false);
  const [employeeIssueDetails, setEmployeeIssueDetails] = useState<any>({});
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: dataEmployeeIssueResponseDetails,
    isLoading: employeeIssueResponseDetailsLoading,
    refetch: refetchEmployeeIssueResponseDetails,
  } = useGetEmployeeIssueActionDetails(params.employee_issue_id || null);
  const { mutate, isLoading } = useUpdateEmployeeIssueAction();

  useEffect(() => {
    if (
      dataEmployeeIssueResponseDetails &&
      Object.keys(dataEmployeeIssueResponseDetails).length !== 0 &&
      !employeeIssueResponseDetailsLoading
    ) {
      setHasIssue(true);
      setEmployeeIssueDetails(dataEmployeeIssueResponseDetails);

      // If already responded, show submitted state
      if (dataEmployeeIssueResponseDetails.is_responded) {
        setIsSubmitted(true);
        setResponseText(dataEmployeeIssueResponseDetails.response || '');
      }
    }
  }, [dataEmployeeIssueResponseDetails, employeeIssueResponseDetailsLoading]);

  const handleSubmit = () => {
    if (!responseText.trim()) {
      toast.custom(() => <CustomToast message="Please provide your response." type='error' />, { duration: 4000 });
      return;
    }

    setIsConfirmSubmitModalOpen(true);
  };

  const submitForm = () => {
    setIsSubmitting(true);
    
    const callbackReq = {
      onSuccess: (data: any) => {
        setIsSubmitted(true);
        setIsConfirmSubmitModalOpen(false);
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
        
        // Refetch response details to get updated data
        refetchEmployeeIssueResponseDetails();
      },
      onError: (err: any) => {
        const errorMessage = typeof err === 'string' ? err : err.message || 'An error occurred';
        toast.custom(() => <CustomToast message={errorMessage} type='error' />, {
          duration: 7000,
        });
      },
    };

    mutate(
      {
        employee_issue_id: params.employee_issue_id,
        action_type: 'response',
        data: {
          response: responseText,
        },
      },
      callbackReq
    );
  };

  if (employeeIssueResponseDetailsLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Employee Issue Not Found</h1>
          <p className="text-gray-600">The employee issue you&apos;re looking for could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isSubmitted ? (
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
                      Congratulations on submitting your response!
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
                    <h2 className="text-lg font-semibold text-gray-900">Notice to Explain Document</h2>
                    <p className="text-sm text-gray-600 mt-1">Please review the document before providing your response</p>
                  </div>
                  
                  {/* PDF Content */}
                  <div className="flex-1 p-6">
                    {employeeIssueDetails.nte_attachment ? (
                      <div className="h-full">
                        <iframe
                          src={employeeIssueDetails.nte_attachment}
                          className="w-full h-full border border-gray-300 rounded-lg shadow-sm"
                          title="NTE Document"
                        />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">No NTE Document</h3>
                          <p className="mt-2 text-sm text-gray-500">
                            No attachment was provided with this Notice to Explain.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Response Form */}
              <div className="w-96 bg-white border-2 rounded-lg border-gray-200">
                <div className="h-full flex flex-col">
                  {/* Form Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200 rounded-t-lg">
                    <h2 className="text-lg font-semibold text-gray-900">Your Response</h2>
                    <p className="text-sm text-gray-600 mt-1">Provide your response to the incident</p>
                  </div>
                  
                  {/* Form Content */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-3">
                          Your response to the incident:
                        </label>
                        <textarea
                          id="response"
                          rows={12}
                          className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none px-3 py-2"
                          placeholder="write your response here..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isSubmitting || isLoading}
                          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Response
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="border-t-2 border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
                    <div className="text-center text-xs text-gray-500">
                      <p>
                        If you have any questions about this employee issue, please contact your HR representative.
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
            highlightText="submit"
            subtitle="your response?"
          />
        </div>
      )}
    </>
  );
}

export default Content;
