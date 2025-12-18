'use client';

import { useState, useRef, useEffect } from 'react';

import { useParams } from 'next/navigation';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useGetSeparationById } from './hooks/useGetSeparationById';
import useAcknowledgeSeparation from './hooks/useAcknowledgeSeparation';

import DropDownArrow from '@/svg/DropDownArrow';

const Content = () => {
  const params = useParams();
  const separationId = params.id as string;
  
  // File preview states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch separation data using our custom hook
  const { 
    data: separation, 
    isLoading: isLoadingSeparation, 
    error: separationError,
    refetch
  } = useGetSeparationById(separationId);

  // Acknowledge separation mutation
  const { 
    mutate: acknowledgeSeparation,
    isLoading: isAcknowledging 
  } = useAcknowledgeSeparation();

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Handle file download/view
  const handleViewFile = (fileType: 'letter' | 'documents' | 'quit_claim' | 'last_pay') => {
    setIsDropdownOpen(false);
    
    let fileUrl = '';
    if (fileType === 'letter' && separation?.letter_attachment) {
      fileUrl = separation.letter_attachment;
    } else if (fileType === 'documents' && separation?.documents_attachment) {
      fileUrl = separation.documents_attachment;
    } else if (fileType === 'quit_claim' && separation?.quit_claim_attachment) {
      fileUrl = separation.quit_claim_attachment;
    } else if (fileType === 'last_pay' && separation?.last_pay_attachment) {
      fileUrl = separation.last_pay_attachment;
    }
    
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  // Handle acknowledgment
  const handleAcknowledgment = () => {
    acknowledgeSeparation(
      { separation_id: Number(separationId) },
      {
        onSuccess: () => {
          toast.custom(
            () => <CustomToast message="Successfully acknowledged the separation document!" type='success' />,
            { duration: 5000 }
          );
          // Refetch the data to update the UI
          refetch();
        },
        onError: (error) => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to acknowledge separation';
          toast.custom(
            () => <CustomToast message={errorMessage} type='error' />,
            { duration: 7000 }
          );
        }
      }
    );
  };

  if (isLoadingSeparation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" color="yellow" />
      </div>
    );
  }

  if (separationError || !separation) {
    // Check for specific error cases
    const errorMessage = separationError instanceof Error ? separationError.message : 'Unknown error';
    
    const errorStatus = errorMessage.includes('403') ? 403 :
                        errorMessage.includes('404') ? 404 :
                        errorMessage.includes('410') ? 410 : 
                        500;
    
    const errorTitle = errorStatus === 403 ? "Access Denied" : 
                       errorStatus === 404 ? "Separation Not Found" :
                       errorStatus === 410 ? "Separation Deleted" :
                       "Error Loading Separation";
                       
    const errorDescription = errorStatus === 403 ? "You don't have permission to view this separation document." :
                         errorStatus === 404 ? "The requested separation document does not exist." :
                         errorStatus === 410 ? "This separation has been deleted by your HR administrator and is no longer available." :
                         "There was a problem loading this separation document. Please try again later.";
    
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">{errorTitle}</p>
          <p className="text-sm mt-2">{errorDescription}</p>
          {errorMessage && (
            <p className="text-xs mt-2 text-red-500">Details: {errorMessage}</p>
          )}
          <div className="mt-4 flex gap-2">
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

  // Check if separation has viewable files
  const hasViewableFiles = separation && (
    separation.letter_attachment || 
    separation.documents_attachment || 
    separation.quit_claim_attachment || 
    separation.last_pay_attachment
  );

  // Determine letter type from the file name or set a default
  const letterType = separation.letter_attachment && 
    separation.letter_attachment.includes('acceptance') ? 'Acceptance' : 'Separation';

  return (
    <div className="min-h-screen flex justify-center items-center p-4" style={{
      backgroundImage: "url('/assets/memo-policy_background.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      <div className="relative w-full max-w-4xl mx-auto my-8">
        <div className="bg-white rounded-lg overflow-hidden border border-[#ACB9CB]">
          <div className="px-16 py-12">
            <h1 className="text-xl font-bold text-center text-blue-600 mb-10">
              LETTER OF {letterType.toUpperCase()}
            </h1>
            
            <div className="mb-8">
              {/* Employee Information Section */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Employee Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Position:</span>
                    <span className="ml-2">{separation.position}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Department:</span>
                    <span className="ml-2">{separation.department}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Separation Date:</span>
                    <span className="ml-2">{formatDate(separation.date_of_separation)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Effective Date:</span>
                    <span className="ml-2">{formatDate(separation.effective_date)}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Reason for Leaving:</span>
                    <span className="ml-2">{separation.reason_of_leaving}</span>
                  </div>
                </div>
              </div>

              {/* Letter Content Section */}
              <div className="prose max-w-none text-gray-700 leading-relaxed mb-8">
                <div className="text-justify">
                  {separation.message ? (
                    <div 
                      className="ql-editor !p-0" 
                      dangerouslySetInnerHTML={{ __html: separation.message }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">No letter content available.</p>
                  )}
                </div>
              </div>

              {/* Approval Section */}
              {separation.approved_by && (
                <div className="mt-12">
                  <div className="flex flex-col items-start">
                    <p className="text-sm text-gray-600 mb-2">Approved by:</p>
                    <div className="border-t border-gray-400 pt-2 min-w-[200px]">
                      <p className="font-semibold text-sm">{separation.approved_by}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Separation Journey Status */}
              <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Separation Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Letter Status */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${separation.is_letter_received ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium">Letter</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      separation.is_letter_received ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {separation.is_letter_received ? 'Received' : 'Pending'}
                    </span>
                  </div>

                  {/* Documents Status */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${separation.is_documents_received ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium">Documents</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      separation.is_documents_received ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {separation.is_documents_received ? 'Received' : 'Pending'}
                    </span>
                  </div>

                  {/* Last Pay Status */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${separation.is_last_pay_released ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium">Last Pay</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      separation.is_last_pay_released ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {separation.is_last_pay_released ? 'Released' : 'Pending'}
                    </span>
                  </div>

                  {/* Quit Claim Status */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${separation.is_quit_claim_received ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-medium">Quit Claim</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      separation.is_quit_claim_received ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {separation.is_quit_claim_received ? 'Received' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acknowledgment Button */}
              <div className="mt-8">
                <button
                  onClick={handleAcknowledgment}
                  disabled={separation.is_letter_received || isAcknowledging}
                  className={`py-4 px-6 rounded-md text-white font-medium transition-all duration-300 w-full ${
                    separation.is_letter_received 
                      ? 'bg-green-500 cursor-not-allowed'
                      : isAcknowledging
                      ? 'bg-blue-400 cursor-wait'
                      : 'bg-[#355FD0] hover:bg-[#2347B2]'
                  }`}
                >
                  {separation.is_letter_received 
                    ? 'Thank you for acknowledging!'
                    : isAcknowledging
                    ? 'Processing...'
                    : 'I acknowledge and understand'}
                </button>
              </div>
            </div>

            {/* Attachments dropdown menu */}
            {hasViewableFiles && (
              <div className="mb-6 relative w-48" ref={dropdownRef}>
                <div className="w-full">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-900 shadow-sm ${
                      isDropdownOpen 
                        ? 'ring-2 ring-inset ring-black focus:ring-black' 
                        : 'ring-1 ring-inset ring-gray-300'
                    } rounded-md bg-white hover:bg-gray-50 transition-all`}
                  >
                    <span>View Documents</span>
                    <span className="ml-2">
                      <DropDownArrow />
                    </span>
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {separation.letter_attachment && (
                        <button
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleViewFile('letter')}
                        >
                          View Letter Document
                        </button>
                      )}
                      
                      {separation.documents_attachment && (
                        <button
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleViewFile('documents')}
                        >
                          View Signed Documents
                        </button>
                      )}
                      
                      {separation.quit_claim_attachment && (
                        <button
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleViewFile('quit_claim')}
                        >
                          View Quit Claim
                        </button>
                      )}
                      
                      {separation.last_pay_attachment && (
                        <button
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleViewFile('last_pay')}
                        >
                          View Last Pay Document
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;