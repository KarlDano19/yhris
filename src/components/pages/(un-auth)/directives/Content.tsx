'use client';

import { useState, useRef, useEffect } from 'react';

import { useParams } from 'next/navigation';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useGetDirectiveById } from './hooks/useGetDirectiveById';
import { useSendVerification } from './hooks/useSendVerification';
import useVerifyDirective from './hooks/useVerifyDirective';
import EmailSelectionModal from './modals/EmailSelectionModal';
import VerificationCodeModal from './modals/VerificationCodeModal';
import FilePreviewModal from './modals/FilePreviewModal';

import DropDownArrow from '@/svg/DropDownArrow';

import 'react-quill/dist/quill.snow.css';

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

  // Render HTML formatted body content
  const renderBodyContent = (bodyContent: any) => {
    if (!bodyContent) return null;
    const markup = { __html: bodyContent };
    return <span className='ql-editor !p-0' dangerouslySetInnerHTML={markup}></span>;
  };

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
  const handlePreviewFile = (fileType: 'qr_code' | 'attachments', attachmentIndex?: number) => {
    setIsDropdownOpen(false);
    
    if (fileType === 'qr_code' && directive?.qr_code) {
      setFilePreviewUrl(directive.qr_code as string);
      setFilePreviewTitle('QR Code');
      setShowFilePreviewModal(true);
    } else if (fileType === 'attachments') {
      // Handle multiple attachments (array) or single attachment (backward compatibility)
      const attachments = directive?.attachments;
      
      if (Array.isArray(attachments) && attachments.length > 0) {
        // Multiple attachments - use index if provided, otherwise use first
        const attachment = attachmentIndex !== undefined 
          ? attachments[attachmentIndex] 
          : attachments[0];
        
        // Attachment can be an object with attachment/attachment_name or a string URL
        const attachmentUrl = typeof attachment === 'object' 
          ? attachment.attachment 
          : attachment;
        const attachmentName = typeof attachment === 'object' 
          ? attachment.attachment_name || 'Attachment'
          : 'Attachment';
        
        setFilePreviewUrl(attachmentUrl as string);
        setFilePreviewTitle(attachmentName);
        setShowFilePreviewModal(true);
      } else if (attachments && typeof attachments === 'string') {
        // Backward compatibility: single attachment as string
        setFilePreviewUrl(attachments);
        setFilePreviewTitle('Attachment');
        setShowFilePreviewModal(true);
      } else if ((directive as any)?.attachment) {
        // Fallback to backward compatibility field
        setFilePreviewUrl((directive as any).attachment as string);
        setFilePreviewTitle('Attachment');
        setShowFilePreviewModal(true);
      }
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
    
    // Show verification modal immediately with loading state
    setShowVerificationModal(true);
    
    sendVerification(
      { email },
      {
        onSuccess: () => {
          toast.custom(() => <CustomToast message="Verification code sent to your email." type='success' />, { duration: 5000 });
          // Modal is already open with initialLoading=true
        },
        onError: (error) => {
          // Close the verification modal if there's an error
          setShowVerificationModal(false);
          toast.custom(() => <CustomToast message={error.message || "Failed to send verification code."} type='error' />, { duration: 5000 });
          // Reopen email modal if there was an error
          setShowEmailModal(true);
        }
      }
    );
  };

  const handleResendCode = async () => {
    if (selectedEmail) {
      return new Promise<void>((resolve, reject) => {
        sendVerification(
          { email: selectedEmail },
          {
            onSuccess: () => {
              toast.custom(() => <CustomToast message="Verification code resent to your email." type='success' />, { duration: 5000 });
              resolve();
            },
            onError: (error) => {
              // Always reject with cooldown_remaining if available to trigger modal timer
              if (error.cooldown_remaining) {
                reject({ cooldown_remaining: error.cooldown_remaining });
              } else {
                toast.custom(() => <CustomToast message={error.message || "Failed to resend verification code."} type='error' />, { duration: 5000 });
                // Reject with a default cooldown to prevent immediate retries
                reject({ cooldown_remaining: 5 });
              }
            }
          }
        );
      });
    }
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
  const hasViewableFiles = directive && (
    directive.qr_code || 
    directive.signature || 
    (Array.isArray(directive.attachments) && directive.attachments.length > 0) ||
    (directive.attachments && typeof directive.attachments === 'string') ||
    (directive as any)?.attachment
  );

  if (isLoadingDirective) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" color="yellow" />
      </div>
    );
  }

  if (directiveError || !directive) {
    // Display error message from backend
    const errorMessage = directiveError instanceof Error ? directiveError.message : 'An error occurred while loading this memo/policy.';
    
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Unable to Load Memo/Policy</p>
          <p className="text-sm mt-2">{errorMessage}</p>
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to landing page
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
          <div className="text-justify">
            {directive.body ? renderBodyContent(directive.body) : 'No memo content available.'}
          </div>
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
        const standardFields = ['id', 'title', 'directive_type', 'to', 'is_active', 
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
              <div>
                {directive.body ? renderBodyContent(directive.body) : 'No policy content available.'}
              </div>
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
                  {directive.signature && (
                    <div className="mb-2">
                      <img
                        src={directive.signature as string}
                        alt="Signature"
                        className="h-12 object-contain object-left"
                        style={{ maxWidth: '200px' }}
                      />
                    </div>
                  )}
                  <p className="font-semibold text-sm mb-2">{directive.name}</p>
                  <p className="text-gray-600 text-sm">{directive.position}</p>
                </div>
              )}
            </div>

            {/* Attachments dropdown menu */}
            {hasViewableFiles && (
              <div className="mb-6 relative w-64 max-w-full" ref={dropdownRef}>
                <div className="w-full">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-900 shadow-sm ${
                      isDropdownOpen 
                        ? 'ring-2 ring-inset ring-black focus:ring-black' 
                        : 'ring-1 ring-inset ring-gray-300'
                    } rounded-md bg-white hover:bg-gray-50 transition-all`}
                  >
                    <span className="truncate">View Attachments</span>
                    <span className="ml-2 flex-shrink-0">
                      <DropDownArrow />
                    </span>
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {directive.qr_code && (
                        <button
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 truncate"
                          onClick={() => handlePreviewFile('qr_code')}
                          title="View QR Code"
                        >
                          View QR Code
                        </button>
                      )}
                      
                      {/* Handle multiple attachments */}
                      {Array.isArray(directive.attachments) && directive.attachments.length > 0 && (
                        <>
                          {directive.attachments.map((attachment: any, index: number) => {
                            const attachmentName = typeof attachment === 'object' 
                              ? attachment.attachment_name || `Attachment ${index + 1}`
                              : `Attachment ${index + 1}`;
                            
                            const fullText = `View ${attachmentName}`;
                            
                            return (
                              <button
                                key={index}
                                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 overflow-hidden"
                                onClick={() => handlePreviewFile('attachments', index)}
                                title={fullText}
                              >
                                <span className="block truncate">{fullText}</span>
                              </button>
                            );
                          })}
                        </>
                      )}
                      
                      {/* Backward compatibility: single attachment as string or attachment field */}
                      {!Array.isArray(directive.attachments) && (
                        (directive.attachments && typeof directive.attachments === 'string') || (directive as any)?.attachment
                      ) && (
                        <button
                          className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 truncate"
                          onClick={() => handlePreviewFile('attachments')}
                          title="View Uploaded File"
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
              onResendCode={handleResendCode}
              initialLoading={true}
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