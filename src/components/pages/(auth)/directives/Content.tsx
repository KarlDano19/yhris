'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useGetDirectiveById } from './hooks/useGetDirectiveById';
import { useMarkDirectiveAsRead } from './hooks/useMarkDirectiveAsRead';
import useCheckDirectiveReadStatus from './hooks/useCheckDirectiveReadStatus';
import { getCookie } from 'cookies-next';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';

// Utility functions
const getEmailFromUrl = (): string | null => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const email = url.searchParams.get('email');
    
    if (email) {
      localStorage.setItem('directive_reader_email', email);
      return email;
    }
    
    return localStorage.getItem('directive_reader_email');
  }
  return null;
};

const setEmailCookie = (email: string): void => {
  if (typeof document !== 'undefined') {
    document.cookie = `userEmail=${email}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }
};

interface ContentProps {
  userEmail?: string;
}

const Content = ({ userEmail: initialUserEmail }: ContentProps) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(initialUserEmail || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const directiveId = params.id as string;

  // Get email from URL or localStorage on component mount
  useEffect(() => {
    const email = searchParams.get('email') || getEmailFromUrl();
    if (email) {
      setUserEmail(email);
      setEmailCookie(email);
    }
  }, [searchParams, initialUserEmail]);

  // Fetch directive data using our custom hook
  const { 
    data: directive, 
    isLoading: isLoadingDirective, 
    error: directiveError 
  } = useGetDirectiveById(directiveId);

  // Check if the directive has already been read by this user
  const {
    data: readStatus,
    isLoading: isCheckingReadStatus
  } = useCheckDirectiveReadStatus(directiveId, userEmail);

  // Set confirmed state based on read status
  useEffect(() => {
    if (readStatus?.has_read) {
      setIsConfirmed(true);
    }
  }, [readStatus]);

  // Mutation to mark directive as read using our custom hook
  const { mutate: markAsRead, isLoading: isMarking } = useMarkDirectiveAsRead(directiveId);

  const handleConfirm = () => {
    if (userEmail) {
      console.log('Marking directive as read with email:', userEmail);
      console.log('Auth token:', getCookie('token'));
      
      markAsRead( 
        { email: userEmail },
        {
          onSuccess: () => {
            console.log('Successfully marked directive as read');
            setIsConfirmed(true);
            toast.custom(() => <CustomToast message="Successfully read & understood Memo/Policy." type='success' />, { duration: 5000 });
            
            // Redirect to homepage after a short delay to allow the toast to be visible
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          },
          onError: (error) => {
            console.error('Error marking directive as read:', error);
            setErrorMessage(error.message);
            toast.custom(() => <CustomToast message={error.message || "Error confirming read status"} type='error' />, { duration: 5000 });
          }
        }
      );
    } else {
      toast.custom(() => <CustomToast message="Unable to identify your email. Please contact your administrator." type='error' />, { duration: 5000 });
    }
  };

  const isLoading = isLoadingDirective || isCheckingReadStatus;

  if (isLoading) {
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
          <p>{directive.body || 'No memo content available.'}</p>
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
      } 
      // For backward compatibility with existing policies
      else {
        // Use type assertion for legacy data
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
    <div className="flex justify-center items-center p-4" style={{
      backgroundImage: "url('/assets/memo-policy_background.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "calc(100vh - 64px)" // Adjust based on header height
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
            
            <div className="mt-20">
              {readStatus?.has_read ? (
                <div className="py-6 px-6 rounded-md bg-green-500 text-white font-bold text-center">
                  You have already read this {directiveType === 'memo' ? 'memo' : 'policy'} on {readStatus.read_at ? new Date(readStatus.read_at).toLocaleString() : 'a previous date'}
                </div>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmed || !userEmail || isMarking}
                  className={`py-4 px-6 rounded-md text-white font-medium transition-all duration-300 w-full ${
                    isConfirmed 
                      ? 'bg-green-500 cursor-not-allowed' 
                      : !userEmail
                      ? 'bg-gray-400 cursor-not-allowed'
                      : isMarking
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-[#355FD0]'
                  }`}
                >
                  {isConfirmed 
                    ? 'Thank you for confirming!' 
                    : !userEmail
                    ? 'Unable to identify user'
                    : isMarking
                    ? 'Confirming...'
                    : 'I have read & understood the Memo/Policy'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content; 