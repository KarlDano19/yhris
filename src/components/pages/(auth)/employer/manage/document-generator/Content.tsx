'use client';

import { useState, useEffect } from 'react';

import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';

import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'react-datepicker/dist/react-datepicker.css';

import Form from "./Form";
import CustomToast from "@/components/CustomToast";
import EmployeeCertificatePreview from "./previews/EmployeeCertificatePreview";
import EmploymentAgreementPreview from "./previews/EmploymentAgreementPreview";
import NoticeToExplainPreview from "./previews/NoticeToExplainPreview";
import useGetEmployeeIssueDetails from '../address-employee-issue/hooks/useGetEmployeeIssueDetails';
import useUploadEmployeeIssueAttachments from '../address-employee-issue/hooks/useUploadEmployeeIssueAttachments';
import SignatureModal from "./modals/SignatureModal";
import LetterheadModal from "./modals/LetterheadModal";
import LogoModal from "./modals/LogoModal";

import { EmployeeCertificateFormData } from "@/types/document-generator/documents";
import { EmploymentAgreementFormData } from "@/types/document-generator/documents";
import { NoticeToExplainFormData } from "@/types/document-generator/documents";
import { DocumentType } from "@/types/document-generator/form";
import { print } from './print/index';
import { generateNoticeToExplainHTML } from './print/documents/NoticeToExplain';
import initColorPolyfill from '@/helpers/colorPolyfill';
import { handleProceedUtil } from './utils/handleProceed';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function Content() {
  const { mutate: uploadAttachment } = useUploadEmployeeIssueAttachments();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlDocType = searchParams.get('type') as DocumentType | null;
  const employeeId = searchParams.get('employee');
  
  // Always default to employee certificate type, unless specified in URL
  const [documentType, setDocumentType] = useState<DocumentType>(
    urlDocType && ['employee-certificate', 'employment-agreement', 'notice-to-explain'].includes(urlDocType) 
      ? urlDocType 
      : 'employee-certificate'
  );

  // Fetch employee issue details if employeeId is provided
  const { data: selectedEmployeeIssue, refetch: refetchEmployeeIssue } = useGetEmployeeIssueDetails(employeeId ? Number(employeeId) : null);
  
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

  const [noticeToExplainData, setNoticeToExplainData] = useState<NoticeToExplainFormData>({
    employeeName: '',
    position: '',
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
    borderColor: '#FFC107'
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
          borderColor: '#FFC107'
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
      const employeeName = selectedEmployeeIssue.name || '';
      const position = selectedEmployeeIssue.position || '';
      const department = selectedEmployeeIssue.department || '';
      const incidentPlace = selectedEmployeeIssue.place_of_incident || '';
      // Update form data
      setNoticeToExplainData(prev => ({
        ...prev,
        employeeName,
        position,
        department,
        incidentDate,
        incidentPlace,
        briefBackground: selectedEmployeeIssue.brief_background || '',
        receivedBy: employeeName,
        dateOfIssuance: new Date().toISOString().split('T')[0],
      }));
    }
  }, [documentType, employeeId, selectedEmployeeIssue]);
  
  // Get current data based on document type
  const getCurrentData = () => {
    switch (documentType) {
      case 'employee-certificate':
        return employeeCertificateData;
      case 'employment-agreement':
        return employmentAgreementData;
      case 'notice-to-explain':
        return noticeToExplainData;
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
  const handleFormChange = (data: EmployeeCertificateFormData | EmploymentAgreementFormData | NoticeToExplainFormData) => {
    if (documentType === 'employee-certificate') {
      setEmployeeCertificateData(data as EmployeeCertificateFormData);
    } else if (documentType === 'employment-agreement') {
      setEmploymentAgreementData(data as EmploymentAgreementFormData);
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
  
  // Handle proceeding (marking as sent and returning to employee issues)
  const handleProceed = () => {
    setIsLoading(true);
    handleProceedUtil({
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
      generateNoticeToExplainHTML,
      jsPDF,
      html2canvas
    });
  };
  
  // Handle print
  const handlePrint = () => {
    try {
      const options = {
        elementId: documentType === 'employee-certificate' 
          ? 'employee-certificate-preview' 
          : documentType === 'employment-agreement'
            ? 'agreement-preview'
            : 'notice-to-explain-preview',
        title: documentType === 'employee-certificate' 
          ? 'Certificate of Employment' 
          : documentType === 'employment-agreement'
            ? 'Employment Agreement'
            : 'Notice to Explain',
        fileName: documentType === 'employee-certificate' 
          ? 'certificate-of-employment' 
          : documentType === 'employment-agreement'
            ? 'employment-agreement'
            : 'notice-to-explain'
      };
      
      print(currentData, options)
        .catch(error => {
          console.error('Print error:', error);
          toast.custom(() => <CustomToast message="There was an error preparing your document. Please try again." type="error" />);
        });
      
      // Toast is now handled in the individual print functions
    } catch (error) {
      console.error('Print error:', error);
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
  const isDocumentTypeDisabled = !!employeeId;

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
          <svg
            aria-hidden="true"
            className="inline w-16 h-16 mb-4 text-gray-200 animate-spin fill-yellow-400"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="text-yellow-600 font-semibold text-xl">Generating PDF document...</span>
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
              href={employeeId ? "/manage/address-employee-issue" : "/manage"} 
              className="flex-none flex gap-3 items-center hover:bg-gray-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <h4>Manage</h4>
            </Link>
          </div>
          <div className="px-2 md:px-8 lg:px-4">
            <h2 className="text-xl font-bold text-indigo-dye">Document Generator</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              <div className="transition-all duration-300">
                <Form 
                  documentType={documentType}
                  onDocumentTypeChange={handleDocumentTypeChange}
                  onFormChange={handleFormChange} 
                  initialData={currentData} 
                  onPrint={handlePrint}
                  onOpenSignatureModal={handleOpenSignatureModal}
                  onOpenLetterheadModal={handleOpenLetterheadModal}
                  onOpenLogoModal={handleOpenLogoModal}
                  onProceed={employeeId && documentType === 'notice-to-explain' ? handleProceed : undefined}
                  isDocumentTypeDisabled={isDocumentTypeDisabled}
                  isFieldDisabled={isFieldDisabled}
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
      
      <SignatureModal 
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureSave}
        onTransparencyCheck={handleTransparencyCheck}
      />
      
      <LetterheadModal 
        isOpen={isLetterheadModalOpen}
        onClose={() => setIsLetterheadModalOpen(false)}
        onSelect={handleLetterheadSelect}
        onUpload={handleLetterheadUpload}
        selectedPath={documentType === 'employee-certificate' ? 
          (currentData as EmployeeCertificateFormData).sampleLetterheadPath : 
          ''}
      />
      
      <LogoModal 
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        onSelect={handleLogoSelect}
        onUpload={handleLogoUpload}
        selectedPath={documentType === 'notice-to-explain' ? (currentData as NoticeToExplainFormData).sampleLogoPath : ''}
      />
    </div>
  );
} 