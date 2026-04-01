'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';

import { toast } from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';

import Forms from "./Forms";
import CustomToast from "@/components/CustomToast";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmployeeCertificatePreview from "./form-previews/EmployeeCertificatePreview";
import EmploymentAgreementPreview from "./form-previews/EmploymentAgreementPreview";
import NoticeToExplainPreview from "./form-previews/NoticeToExplainPreview";
import useGetEmployeeIssueDetails from '../address-employee-issue/hooks/useGetEmployeeIssueDetails';
import useUploadEmployeeIssueAttachments from '../address-employee-issue/hooks/useUploadEmployeeIssueAttachments';
import SignatureModal from "./modals/SignatureModal";
import LetterheadModal from "./modals/LetterheadModal";
import LogoModal from "./modals/LogoModal";
import useGetAcceptanceMemo from './hooks/useGetAcceptanceMemo';
import useGetChecklist from '@/components/pages/(auth)/employer/setup-employer-profile/onboarding-checklist/hooks/useGetChecklist';
import { useSubmitAcceptanceMemo } from './hooks/useSubmitAcceptanceMemo';
import AcceptanceMemoPreview from './form-previews/AcceptanceMemoPreview';

import {
  EmployeeCertificateFormData,
  EmploymentAgreementFormData,
  NoticeToExplainFormData,
  AcceptanceMemoFormData,
} from '@/types/document-generator/documents';
import { DocumentType } from '@/types/document-generator/form';
import { T_MemoFormData } from './form-previews/AcceptanceMemoPreview';
import { print } from './print/print';
import initColorPolyfill from '@/helpers/colorPolyfill';
import { handleProceedUtil } from './integrated-modules/handleProceedGenerateNTE';
import useAddDocumentGeneratorAudit from './hooks/useAddDocumentGeneratorAudit';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import classNames from '@/helpers/classNames';

export default function Content({ hasActiveSubscription }: { hasActiveSubscription: boolean }) {
  const { mutate: uploadAttachment } = useUploadEmployeeIssueAttachments();
  const { mutate: logAudit } = useAddDocumentGeneratorAudit();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const urlDocType = searchParams.get('type') as DocumentType | null;
  const employeeId = searchParams.get('employee');
  const fromChecklist = searchParams.get('from') === 'checklist';
  const itemId = searchParams.get('itemId');

  // Always default to employee certificate type, unless specified in URL
  const [documentType, setDocumentType] = useState<DocumentType>(
    urlDocType && ['employee-certificate', 'employment-agreement', 'notice-to-explain', 'acceptance-memo'].includes(urlDocType)
      ? urlDocType
      : 'employee-certificate'
  );

  // Fetch employee issue details if employeeId is provided
  const { data: selectedEmployeeIssue, refetch: refetchEmployeeIssue } = useGetEmployeeIssueDetails(employeeId ? Number(employeeId) : null);

  // Fetch existing acceptance memo (always called; only used when documentType === 'acceptance-memo')
  const { data: existingMemo, isLoading: isMemoLoading } = useGetAcceptanceMemo();
  const { data: checklistData } = useGetChecklist();
  const { mutate: submitMemo } = useSubmitAcceptanceMemo();
  // State for each document type
  const [employeeCertificateData, setEmployeeCertificateData] = useState<EmployeeCertificateFormData>({
    employeeName: '',
    companyName: '',
    position: '',
    startDate: '',
    endDate: '',
    purpose: '',
    dateOfIssuance: '',
    placeOfIssuance: '',
    signatoryName: '',
    signatoryPosition: '',
    letterheadImage: null,
    sampleLetterheadPath: '',
    signature: null,
    documentTitle: 'Certificate of Employment',
    borderColor: '#FFC107'
  });
  
  const [employmentAgreementData, setEmploymentAgreementData] = useState<EmploymentAgreementFormData>({
    employeeName: '',
    companyName: '',
    position: '',
    startDate: '',
    probationPeriod: '6',
    workingHours: '8',
    dailySalary: '1',
    dateOfIssuance: '',
    placeOfIssuance: '',
    signatoryName: '',
    signatoryPosition: '',
    companyAddress: '',
    signature: null,
  });

  const [acceptanceMemoData, setAcceptanceMemoData] = useState<AcceptanceMemoFormData>({
    companyName: '',
    startDate: '',
    endDate: '',
    authorityName: '',
    authorityPosition: '',
    authorityDate: new Date().toISOString().split('T')[0],
    signature: null,
  });

  const [isViewMode, setIsViewMode] = useState(false);

  const [noticeToExplainData, setNoticeToExplainData] = useState<NoticeToExplainFormData>({
    employeeName: '',
    position: '',
    department: '',
    dateIssued: '',
    companyName: '',
    dateOfIssuance: '',
    placeOfIssuance: '',
    signatoryName: '',
    signatoryPosition: '',
    incidentDate: '',
    incidentPlace: '',
    briefBackground: '',
    preparedBy: '',
    reviewedBy: '',
    receivedBy: '',
    employeeExplanation: '',
    hearingNotes: '',
    managementDecision: '',
    logoImage: null,
    sampleLogoPath: '',
    signature: null,
    borderColor: '#FFC107',
    referenceNumber: ''
  });
  
  // Modal states
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isLetterheadModalOpen, setIsLetterheadModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);
  
  // Add loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize color input polyfill for Safari
  useEffect(() => {
    initColorPolyfill();
  }, []);
  
  // Reset form data when component unmounts - NOT when printing or proceeding
  // This was causing the form to reset after printing
  useEffect(() => {
    // Store a flag to track if this is a real unmount vs a re-render
    let isUnmounting = false;
    
    // Use beforeunload to detect actual page navigation away
    const handleBeforeUnload = () => {
      isUnmounting = true;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Only reset if this is a true unmount (navigating away from the page)
      // not just a re-render caused by printing
      if (isUnmounting) {
        // Reset all form data to initial state when component unmounts
        setEmployeeCertificateData({
          employeeName: '',
          companyName: '',
          position: '',
          startDate: '',
          endDate: '',
          purpose: '',
          dateOfIssuance: '',
          placeOfIssuance: '',
          signatoryName: '',
          signatoryPosition: '',
          letterheadImage: null,
          sampleLetterheadPath: '',
          signature: null,
          documentTitle: 'Certificate of Employment',
          borderColor: '#FFC107'
        });
        
        setEmploymentAgreementData({
          employeeName: '',
          companyName: '',
          position: '',
          startDate: '',
          probationPeriod: '6',
          workingHours: '8',
          dailySalary: '1',
          dateOfIssuance: '',
          placeOfIssuance: '',
          signatoryName: '',
          signatoryPosition: '',
          companyAddress: '',
          signature: null,
        });
        
        setNoticeToExplainData({
          employeeName: '',
          position: '',
          department: '',
          dateIssued: '',
          companyName: '',
          dateOfIssuance: '',
          placeOfIssuance: '',
          signatoryName: '',
          signatoryPosition: '',
          incidentDate: '',
          incidentPlace: '',
          briefBackground: '',
          preparedBy: '',
          reviewedBy: '',
          receivedBy: '',
          employeeExplanation: '',
          hearingNotes: '',
          managementDecision: '',
          logoImage: null,
          sampleLogoPath: '',
          signature: null,
          borderColor: '#FFC107',
          referenceNumber: ''
        });
      }
    };
  }, []);
  
  // Populate form with employee data if employeeId is provided
  useEffect(() => {
    if (documentType === 'notice-to-explain' && employeeId && selectedEmployeeIssue) {
      // Format the incident date from API date format
      const incidentDate = selectedEmployeeIssue.incident_date 
        ? new Date(selectedEmployeeIssue.incident_date).toISOString().split('T')[0]
        : '';
      // Find the employee info
      const employeeName = selectedEmployeeIssue.employee_name || '';
      const position = selectedEmployeeIssue.position || '';
      const department = selectedEmployeeIssue.department || '';
      const incidentPlace = selectedEmployeeIssue.place_of_incident || '';
      
      // Get company name from cached profile if available
      const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
      const profileData = cachedProfile?.state?.data as { name?: string };
      const companyName = profileData?.name || '';
      
      // Update form data
      setNoticeToExplainData(prev => ({
        ...prev,
        employeeName,
        position,
        department,
        incidentDate,
        incidentPlace,
        companyName, // Add company name from cached profile
        briefBackground: selectedEmployeeIssue.brief_background || '',
        receivedBy: employeeName,
        dateOfIssuance: new Date().toISOString().split('T')[0],
        referenceNumber: selectedEmployeeIssue.nte_id || ''
      }));
    }
  }, [documentType, employeeId, selectedEmployeeIssue, queryClient]);
  
  // Populate acceptance memo form from existing submitted memo or auto-fill dates
  useEffect(() => {
    if (documentType === 'acceptance-memo') {
      if (existingMemo) {
        setAcceptanceMemoData({
          companyName: existingMemo.company_name,
          startDate: existingMemo.start_date,
          endDate: existingMemo.end_date,
          authorityName: existingMemo.authority_name,
          authorityPosition: existingMemo.authority_position,
          authorityDate: existingMemo.authority_date,
          signature: existingMemo.signature,
        });
        setIsViewMode(true);
      } else {
        const today = new Date().toISOString().split('T')[0];
        const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
        const profileData = cachedProfile?.state?.data as { name?: string } | undefined;
        setAcceptanceMemoData((prev) => ({
          ...prev,
          companyName: profileData?.name || prev.companyName,
          startDate: checklistData?.completed_at || today,
          endDate: today,
        }));
      }
    }
  }, [documentType, existingMemo, fromChecklist, checklistData, queryClient]);

  // Populate company name for all document types when switching between them
  useEffect(() => {
    const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']);
    const profileData = cachedProfile?.state?.data as { name?: string };
    
    if (profileData?.name) {
      const companyName = profileData.name;
      
      // Populate company name for all document types when switching
      if (documentType === 'employee-certificate' && !employeeCertificateData.companyName) {
        setEmployeeCertificateData(prev => ({
          ...prev,
          companyName
        }));
      } else if (documentType === 'employment-agreement' && !employmentAgreementData.companyName) {
        setEmploymentAgreementData(prev => ({
          ...prev,
          companyName
        }));
      } else if (documentType === 'notice-to-explain' && !noticeToExplainData.companyName) {
        setNoticeToExplainData(prev => ({
          ...prev,
          companyName
        }));
      }
    }
  }, [documentType, queryClient, employeeCertificateData.companyName, employmentAgreementData.companyName, noticeToExplainData.companyName]);
  
  // Get current data based on document type
  const getCurrentData = () => {
    switch (documentType) {
      case 'employee-certificate':
        return employeeCertificateData;
      case 'employment-agreement':
        return employmentAgreementData;
      case 'notice-to-explain':
        return noticeToExplainData;
      case 'acceptance-memo':
        return acceptanceMemoData;
      default:
        return employeeCertificateData;
    }
  };
  
  const currentData = getCurrentData();
  
  // Handle document type change
  const handleDocumentTypeChange = (type: DocumentType) => {
    // First set the document type
    setDocumentType(type);
    
    // Then ensure the current data is set to the appropriate data for the new type
    // This prevents React errors when switching between document types with different fields
    switch (type) {
      case 'employee-certificate':
        // No need to update employeeCertificateData as it's already in state
        break;
      case 'employment-agreement':
        // No need to update employmentAgreementData as it's already in state
        break;
      case 'notice-to-explain':
        // No need to update noticeToExplainData as it's already in state
        break;
    }
  };
  
  // Handle form changes
  const handleFormChange = (data: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData | AcceptanceMemoFormData) => {
    if (documentType === 'employee-certificate') {
      setEmployeeCertificateData(data as EmployeeCertificateFormData);
    } else if (documentType === 'employment-agreement') {
      setEmploymentAgreementData(data as EmploymentAgreementFormData);
    } else if (documentType === 'acceptance-memo') {
      setAcceptanceMemoData(data as AcceptanceMemoFormData);
    } else if (documentType === 'notice-to-explain') {
      const noticeData = data as NoticeToExplainFormData;
      
      // Ensure receivedBy is synced with employeeName
      if (noticeData.employeeName && (!noticeData.receivedBy || noticeData.receivedBy === noticeToExplainData.receivedBy)) {
        noticeData.receivedBy = noticeData.employeeName;
      }
      
      // If coming from employee issues, preserve the disabled fields
      if (isDocumentTypeDisabled) {
        setNoticeToExplainData(prev => ({
          ...prev,
          // Only update fields that should remain editable
          dateIssued: noticeData.dateIssued,
          companyName: noticeData.companyName,
          briefBackground: noticeData.briefBackground,
          preparedBy: noticeData.preparedBy,
          reviewedBy: noticeData.reviewedBy,
          signature: noticeData.signature,
          borderColor: noticeData.borderColor,
          logoImage: noticeData.logoImage,
          sampleLogoPath: noticeData.sampleLogoPath,
        }));
      } else {
        setNoticeToExplainData(noticeData);
      }
    }
  };
  
  // Handle acceptance memo submission
  const handleAcceptanceMemoSubmit = () => {
    setIsLoading(true);
    submitMemo(
      {
        company_name: acceptanceMemoData.companyName,
        start_date: acceptanceMemoData.startDate,
        end_date: acceptanceMemoData.endDate,
        authority_name: acceptanceMemoData.authorityName,
        authority_position: acceptanceMemoData.authorityPosition,
        authority_date: acceptanceMemoData.authorityDate,
        signature: acceptanceMemoData.signature,
        checklist_item_id: itemId ? Number(itemId) : null,
      },
      {
        onSuccess: async () => {
          setIsLoading(false);
          toast.custom(() => <CustomToast type="success" message="Acceptance Memo submitted successfully." />);
          await fetch('/api/refresh-onboarding-session', { method: 'POST' });
          router.push('/dashboard');
        },
        onError: (err: any) => {
          setIsLoading(false);
          toast.custom(() => <CustomToast type="error" message={err?.message || 'Failed to submit memo.'} />);
        },
      }
    );
  };

  // Handle proceeding (marking as sent and returning to employee issues)
  const handleProceed = async () => {
    setIsLoading(true);
    await handleProceedUtil({
      documentType,
      employeeId: employeeId || '',
      currentData: currentData as NoticeToExplainFormData,
      uploadAttachment: (data: any, callbacks: any) => {
        uploadAttachment(data, {
          ...callbacks,
          onSuccess: (...args: any[]) => {
            setIsLoading(false);
            callbacks?.onSuccess?.(...args);
          },
          onError: (...args: any[]) => {
            setIsLoading(false);
            callbacks?.onError?.(...args);
          }
        });
      },
      router,
      toast,
      CustomToast,
      // Only provide updateEmployeeIssue function if coming from employee issues page
      updateEmployeeIssue: employeeId ? true : undefined
    });
  };
  
  // Handle print
  const handlePrint = async () => {
    try {
      let options = {
        elementId: 'employee-certificate-preview',
        title: 'Certificate of Employment',
        fileName: 'certificate-of-employment',
      };

      switch (documentType) {
        case 'employee-certificate':
          options = { elementId: 'employee-certificate-preview', title: 'Certificate of Employment', fileName: 'certificate-of-employment' };
          break;
        case 'employment-agreement':
          options = { elementId: 'agreement-preview', title: 'Employment Agreement', fileName: 'employment-agreement' };
          break;
        case 'notice-to-explain':
          options = { elementId: 'notice-to-explain-preview', title: 'Notice to Explain', fileName: 'notice-to-explain' };
          break;
        case 'acceptance-memo':
          options = { elementId: 'acceptance-memo-preview', title: 'Acceptance Memo', fileName: 'acceptance-memo' };
          break;
      }
      
      // Determine document type for audit
      const docType = 'incidentDate' in currentData && 'incidentPlace' in currentData && 'briefBackground' in currentData
        ? 'notice-to-explain'
        : 'probationPeriod' in currentData && 'workingHours' in currentData && 'dailySalary' in currentData
          ? 'employment-agreement'
          : 'employee-certificate';
      
      // Proceed with printing (validation already happened in Form.tsx)
      print(currentData as EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData | AcceptanceMemoFormData, options)
        .then(() => {
          // Only log audit AFTER successful print
          logAudit({
            document_type: docType,
            document_data: currentData
          });
        })
        .catch(error => {
          toast.custom(() => <CustomToast message="There was an error preparing your document. Please try again." type="error" />);
        });
      
      // Toast is now handled in the individual print functions
    } catch (error) {
      toast.custom(() => <CustomToast message="There was an error preparing your document. Please try again." type="error" />);
    }
  };
  
  // Handle signature modal
  const handleOpenSignatureModal = () => {
    setIsSignatureModalOpen(true);
  };
  
  const handleSignatureSave = (signatureData: string | File | null) => {
    if (documentType === 'employee-certificate') {
      setEmployeeCertificateData({
        ...employeeCertificateData,
        signature: signatureData
      });
    } else if (documentType === 'employment-agreement') {
      setEmploymentAgreementData({
        ...employmentAgreementData,
        signature: signatureData
      });
    } else if (documentType === 'notice-to-explain') {
      setNoticeToExplainData({
        ...noticeToExplainData,
        signature: signatureData
      });
    } else if (documentType === 'acceptance-memo') {
      const sig = typeof signatureData === 'string'
        ? signatureData
        : signatureData ? URL.createObjectURL(signatureData) : null;
      setAcceptanceMemoData({ ...acceptanceMemoData, signature: sig });
    }

    setIsSignatureModalOpen(false);
  };
  
  const handleTransparencyCheck = (result: {hasTransparency: boolean, message: string, type: 'success' | 'warning' | 'error'}) => {
    // Display the toast message
    toast.custom(() => (
      <CustomToast 
        message={result.message} 
        type={result.type} 
        onClose={() => setToastMessage(null)} 
      />
    ));
  };
  
  // Handle letterhead modal
  const handleOpenLetterheadModal = () => {
    setIsLetterheadModalOpen(true);
  };
  
  const handleLetterheadSelect = (path: string) => {
    if (documentType === 'employee-certificate') {
      setEmployeeCertificateData({
        ...employeeCertificateData,
        letterheadImage: null,
        sampleLetterheadPath: path
      });
    }
    
    setIsLetterheadModalOpen(false);
  };
  
  const handleLetterheadUpload = (file: File) => {
    if (documentType === 'employee-certificate') {
      setEmployeeCertificateData({
        ...employeeCertificateData,
        letterheadImage: file,
        sampleLetterheadPath: ''
      });
    }
    
    setIsLetterheadModalOpen(false);
  };
  
  // Handle logo modal
  const handleOpenLogoModal = () => {
    setIsLogoModalOpen(true);
  };
  
  const handleLogoSelect = (path: string) => {
    if (documentType === 'notice-to-explain') {
      setNoticeToExplainData({
        ...noticeToExplainData,
        logoImage: null,
        sampleLogoPath: path
      });
    }
    
    setIsLogoModalOpen(false);
  };
  
  const handleLogoUpload = (file: File) => {
    if (documentType === 'notice-to-explain') {
      setNoticeToExplainData({
        ...noticeToExplainData,
        logoImage: file,
        sampleLogoPath: ''
      });
    }
    
    setIsLogoModalOpen(false);
  };

  // Only allow "notice-to-explain" document type if coming from address-employee-issue page
  // Also lock when coming from onboarding checklist (acceptance-memo is pre-selected)
  const isDocumentTypeDisabled = !!employeeId || fromChecklist;

  // Custom function to determine if specific field should be disabled
  const isFieldDisabled = (fieldName: string): boolean => {
    if (!isDocumentTypeDisabled) return false; // If not coming from employee issues, nothing is disabled
    
    // Fields that should be disabled when populated from employee issue data
    const disabledFields = [
      'employeeName',
      'position',
      'incidentDate',
      'incidentPlace'
    ];
    
    return disabledFields.includes(fieldName);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
          <LoadingSpinner size="xl" color="yellow" />
          <span className="text-yellow-600 font-semibold text-xl mt-4">Generating PDF document...</span>
        </div>
      )}
      {!isLoading && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {toastMessage && (
            <div className="fixed top-4 right-4 z-50">
              <CustomToast 
                message={toastMessage.message} 
                type={toastMessage.type} 
                onClose={() => setToastMessage(null)} 
              />
            </div>
          )}
          <div className="flex p-4">
            <Link
              href={fromChecklist ? '/setup-employer-profile/onboarding-checklist' : (employeeId ? '/manage/address-employee-issue' : '/manage')}
              className="flex-none flex gap-3 items-center hover:bg-gray-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <h4>{fromChecklist ? 'HRIS Implementation Checklist' : 'Manage'}</h4>
            </Link>
          </div>
          <div className="px-2 md:px-8 lg:px-4">
            <h2 className="text-xl font-bold text-indigo-dye">Document Generator</h2>
            <div className={classNames("grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6", !hasActiveSubscription && 'opacity-50 pointer-events-none')}>
              <div className="transition-all duration-300">
                <Forms
                  documentType={documentType}
                  onDocumentTypeChange={handleDocumentTypeChange}
                  onFormChange={handleFormChange}
                  initialData={currentData}
                  onPrint={handlePrint}
                  onOpenSignatureModal={handleOpenSignatureModal}
                  onOpenLetterheadModal={handleOpenLetterheadModal}
                  onOpenLogoModal={handleOpenLogoModal}
                  onProceed={
                    documentType === 'acceptance-memo' && !isViewMode
                      ? handleAcceptanceMemoSubmit
                      : (employeeId && documentType === 'notice-to-explain' ? handleProceed : undefined)
                  }
                  isDocumentTypeDisabled={isDocumentTypeDisabled}
                  isFormDisabled={documentType === 'acceptance-memo' && isMemoLoading}
                  isFieldDisabled={isFieldDisabled}
                  isViewMode={isViewMode}
                />
              </div>
              <div className="transition-all duration-300">
                {documentType === 'employee-certificate' ? (
                  <div id="employee-certificate-preview">
                    <EmployeeCertificatePreview formData={employeeCertificateData} />
                  </div>
                ) : documentType === 'employment-agreement' ? (
                  <div id="agreement-preview">
                    <EmploymentAgreementPreview formData={employmentAgreementData} />
                  </div>
                ) : documentType === 'acceptance-memo' ? (
                  <div id="acceptance-memo-preview">
                    <AcceptanceMemoPreview
                      formData={{
                        ...(acceptanceMemoData as T_MemoFormData),
                        phases: checklistData?.phases,
                      }}
                    />
                  </div>
                ) : (
                  <div id="notice-to-explain-preview">
                    <NoticeToExplainPreview data={noticeToExplainData} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      
      {isSignatureModalOpen && (
        <SignatureModal 
          isOpen={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
          onSave={handleSignatureSave}
          onTransparencyCheck={handleTransparencyCheck}
        />
      )}
      
      {isLetterheadModalOpen && (
        <LetterheadModal 
          isOpen={isLetterheadModalOpen}
          onClose={() => setIsLetterheadModalOpen(false)}
          onSelect={handleLetterheadSelect}
          onUpload={handleLetterheadUpload}
          selectedPath={documentType === 'employee-certificate' ? 
            (currentData as EmployeeCertificateFormData).sampleLetterheadPath : 
            ''}
          showToast={(message, type = 'error') => {
            toast.custom(() => (
              <CustomToast message={message} type={type} onClose={() => setToastMessage(null)} />
            ));
          }}
        />
      )}

      {isLogoModalOpen && (
        <LogoModal 
          isOpen={isLogoModalOpen}
          onClose={() => setIsLogoModalOpen(false)}
          onSelect={handleLogoSelect}
          onUpload={handleLogoUpload}
          selectedPath={documentType === 'notice-to-explain' ? (currentData as NoticeToExplainFormData).sampleLogoPath : ''}
        />
      )}
    </div>
  );
} 