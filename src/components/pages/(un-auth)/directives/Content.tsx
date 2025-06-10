'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGetDirectiveById } from './hooks/useGetDirectiveById';
import { useSendVerification } from './hooks/useSendVerification';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import EmailSelectionModal from './modals/EmailSelectionModal';
import VerificationCodeModal from './modals/VerificationCodeModal';
import FilePreviewModal from './modals/FilePreviewModal';
import useVerifyDirective from './hooks/useVerifyDirective';
import DropDownArrow from '@/svg/DropDownArrow';

const Content = () => {
  const params = useParams();
  const directiveId = params.id as string;
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  
  // File preview states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState('');
  const [filePreviewTitle, setFilePreviewTitle] = useState('');
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

  // Fetch directive data using our custom hook
  const { 
    data: directive, 
    isLoading: isLoadingDirective, 
    error: directiveError 
  } = useGetDirectiveById(directiveId);

  // Send verification code mutation
  const { 
    mutate: sendVerification,
    isLoading: isSendingVerification 
  } = useSendVerification(directiveId);

  const { mutate: verifyDirective, isLoading: isVerifying } = useVerifyDirective();

  // Get the list of recipient emails from directive data
  const getRecipientEmails = (): string[] => {
    if (!directive?.to) return [];
    
    // If to is already an array, return it
    if (Array.isArray(directive.to)) {
      return directive.to;
    }
    
    // If to is a string, try to parse it as JSON
    try {
      const parsed = JSON.parse(directive.to);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  
  // Handle file preview
  const handlePreviewFile = (fileType: 'qr_code' | 'attachments') => {
    setIsDropdownOpen(false);
    
    if (fileType === 'qr_code' && directive?.qr_code) {
      setFilePreviewUrl(directive.qr_code as string);
      setFilePreviewTitle('QR Code');
      setShowFilePreviewModal(true);
    } else if (fileType === 'attachments' && directive?.attachments) {
      setFilePreviewUrl(directive.attachments as string);
      setFilePreviewTitle('Attachment');
      setShowFilePreviewModal(true);
    }
  };

  const handleConfirm = () => {
    // const availableEmails = getRecipientEmails();
    // if (availableEmails.length === 0) {
    //   toast.custom(
    //     () => <CustomToast message="No available emails found for this directive." type='warning' />,
    //     { duration: 5000 }
    //   );
    //   return;
    // }
    setShowEmailModal(true);
  };

  const handleEmailSelection = async (email: string) => {
    setSelectedEmail(email);
    setShowEmailModal(false);
    
    sendVerification(
      { email },
      {
        onSuccess: () => {
          toast.custom(() => <CustomToast message="Verification code sent to your email." type='success' />, { duration: 5000 });
          setShowVerificationModal(true);
        },
        onError: (error) => {
          toast.custom(() => <CustomToast message={error.message || "Failed to send verification code."} type='error' />, { duration: 5000 });
          // Reopen email modal if there was an error
          setShowEmailModal(true);
        }
      }
    );
  };

  const handleVerificationSubmit = async (code: string) => {
    verifyDirective(
      { 
        directiveId: Number(directiveId), 
        email: selectedEmail, 
        code 
      },
      {
        onSuccess: () => {
          setShowVerificationModal(false);
          setIsConfirmed(true);
          toast.custom(
            () => <CustomToast message="Successfully verified and confirmed!" type='success' />,
            { duration: 5000 }
          );
          
          // Redirect to homepage after a short delay
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        },
        onError: () => {
          toast.custom(
            () => <CustomToast message="Invalid verification code." type='error' />,
            { duration: 5000 }
          );
        }
      }
    );
  };
  
  // Check if directive has viewable files
  const hasViewableFiles = directive && (directive.qr_code || directive.signature || directive.attachments);

  if (isLoadingDirective) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (directiveError || !directive) {
    // Check for specific error cases
    const errorMessage = directiveError instanceof Error ? directiveError.message : 'Unknown error';
    
    const errorStatus = errorMessage.includes('403') ? 403 :
                        errorMessage.includes('404') ? 404 : 
                        500;
    
    const errorTitle = errorStatus === 403 ? "Access Denied" : 
                       errorStatus === 404 ? "Directive Not Found" :
                       "Error Loading Directive";
                       
    const errorDescription = errorStatus === 403 ? "You don't have permission to view this memo/policy." :
                         errorStatus === 404 ? "The requested memo/policy does not exist or has been deleted." :
                         "There was a problem loading this memo/policy. Please try again later.";
    
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

  // Determine the directive type (handle both API formats)
  const directiveType = directive.directive_type;

  // Render different content based on directive type
  const renderDirectiveContent = () => {
    if (directiveType === 'memo') {
      return (
        <div className="prose max-w-none text-gray-700 leading-relaxed">
          <p className="text-justify indent-8">{directive.body || 'No memo content available.'}</p>
        </div>
      );
    } else {
      // Policy type - first check for custom_policy_fields
      if (directive.custom_policy_fields && Array.isArray(directive.custom_policy_fields) && directive.custom_policy_fields.length > 0) {
        return (
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {directive.custom_policy_fields.map((field, index) => (
              <div className="mb-6" key={index}>
                <h3 className="font-semibold text-lg">{field.inputLabel}</h3>
                <p>{field.inputName}</p>
              </div>
            ))}
            
            {/* Provisions sections */}
            {directive.eligibility && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg">Eligibility</h3>
                <p>{directive.eligibility}</p>
              </div>
            )}
            
            {directive.application && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg">Application</h3>
                <p>{directive.application}</p>
              </div>
            )}
            
            {directive.coverage && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg">Coverage</h3>
                <p>{directive.coverage}</p>
              </div>
            )}
            
            {directive.termination && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg">Termination</h3>
                <p>{directive.termination}</p>
              </div>
            )}
          </div>
        );
      } else {
        // For backward compatibility with existing policies
        const directiveAny = directive as any;
        
        // Check for any non-standard fields that might be custom policy fields
        const standardFields = ['id', 'title', 'directive_type', 'is_responded', 'to', 'is_active', 
                               'attachments', 'eligibility', 'application', 'coverage', 'termination', 
                               'body', 'name', 'position', 'signature', 'qr_code', 'created_at', 'updated_at',
                               'employer', 'reads', 'read_count'];
        
        // Extract potential legacy policy fields from the directive object
        const legacyPolicyFields = Object.keys(directiveAny)
          .filter(key => !standardFields.includes(key) && directiveAny[key])
          .map(key => ({
            fieldName: key,
            fieldValue: directiveAny[key]
          }));
        
        const hasLegacyFields = legacyPolicyFields.length > 0;
        const hasProvisionFields = 
          directive.eligibility || 
          directive.application || 
          directive.coverage || 
          directive.termination;
        
        if (hasLegacyFields || hasProvisionFields) {
          return (
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {/* Render any legacy policy fields */}
              {legacyPolicyFields.map((field, index) => (
                <div className="mb-6" key={index}>
                  <h3 className="font-semibold text-lg">{field.fieldName.charAt(0).toUpperCase() + field.fieldName.slice(1)}</h3>
                  <p>{field.fieldValue}</p>
                </div>
              ))}
              
              {/* Render provision fields */}
              {directive.eligibility && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg">Eligibility</h3>
                  <p>{directive.eligibility}</p>
                </div>
              )}
              
              {directive.application && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg">Application</h3>
                  <p>{directive.application}</p>
                </div>
              )}
              
              {directive.coverage && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg">Coverage</h3>
                  <p>{directive.coverage}</p>
                </div>
              )}
              
              {directive.termination && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg">Termination</h3>
                  <p>{directive.termination}</p>
                </div>
              )}
            </div>
          );
        } else {
          // If no specific policy fields, fall back to body
          return (
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <p>{directive.body || 'No policy content available.'}</p>
            </div>
          );
        }
      }
    }
  };

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
              {directiveType === 'memo' ? 'MEMO:' : 'POLICY:'} {directive.title}
            </h1>
            
            <div className="mb-20">
              {renderDirectiveContent()}
              
              {directiveType === 'memo' && (
                <div className="mt-20">
                  <div className="mb-1">
                    {directive.signature ? (
                      <img 
                        src={directive.signature as string} 
                        alt="Signature" 
                        className="h-14 object-contain -mb-6 -ml-10 max-w-[120%]"
                      />
                    ) : (
                      <div className="h-10 flex items-center -ml-5">
                        <svg viewBox="0 0 200 50" className="w-32 -mb-1">
                          <path d="M10,30 Q30,5 50,30 T90,30" stroke="black" fill="transparent" strokeWidth="2"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-sm mb-2">{directive.name}</p>
                  <p className="text-gray-600 text-sm">{directive.position}</p>
                </div>
              )}
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
                    <span>View Attachments</span>
                    <span className="ml-2">
                      <DropDownArrow />
                    </span>
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {directive.qr_code && (
                        <button
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handlePreviewFile('qr_code')}
                        >
                          View QR Code
                        </button>
                      )}
                      
                      {directive.attachments && (
                        <button
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handlePreviewFile('attachments')}
                        >
                          View Uploaded File
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-20">
              <button
                onClick={handleConfirm}
                disabled={isConfirmed}
                className={`py-4 px-6 rounded-md text-white font-medium transition-all duration-300 w-full ${
                  isConfirmed 
                    ? 'bg-green-500 cursor-not-allowed'
                    : 'bg-[#355FD0] hover:bg-[#2347B2]'
                }`}
              >
                {isConfirmed 
                  ? 'Thank you for confirming!'
                  : 'I have read & understood the Memo/Policy'}
              </button>
            </div>

            {/* Add the modals */}
            <EmailSelectionModal
              isOpen={showEmailModal}
              onClose={() => setShowEmailModal(false)}
              onSubmit={handleEmailSelection}
              emails={getRecipientEmails()}
            />

            <VerificationCodeModal
              isOpen={showVerificationModal}
              onClose={() => setShowVerificationModal(false)}
              onSubmit={handleVerificationSubmit}
              email={selectedEmail}
            />
            
            {/* File Preview Modal */}
            <FilePreviewModal
              isOpen={showFilePreviewModal}
              onClose={() => setShowFilePreviewModal(false)}
              fileUrl={filePreviewUrl}
              title={filePreviewTitle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content; 