'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import Link from "next/link";
import 'react-datepicker/dist/react-datepicker.css';

import EmployeeCertificatePreview from "./components/previews/EmployeeCertificatePreview";
import EmploymentAgreementPreview from "./components/previews/EmploymentAgreementPreview";
import NoticeToExplainPreview from "./components/previews/NoticeToExplainPreview";
import SignatureModal from "./modals/SignatureModal";
import LetterheadModal from "./modals/LetterheadModal";
import LogoModal from "./modals/LogoModal";
import Form from "@/components/Form";
import CustomToast from "@/components/CustomToast";

import { EmployeeCertificateFormData } from "@/types/document-generator/documents";
import { EmploymentAgreementFormData } from "@/types/document-generator/documents";
import { NoticeToExplainFormData } from "@/types/document-generator/documents";
import { DocumentType } from "@/types/document-generator/form";

import { print } from './utils/print/index';
import initColorPolyfill from './utils/colorPolyfill';

export default function Content() {
  // Always default to employee certificate type
  const [documentType, setDocumentType] = useState<DocumentType>('employee-certificate');
  
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
    date: '',
    place: '',
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
  
  // Initialize color input polyfill for Safari
  useEffect(() => {
    initColorPolyfill();
  }, []);
  
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
      
      setNoticeToExplainData(noticeData);
    }
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
      
      print(currentData, options);
      
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

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">Document Generator</h1>
          <Link 
            href="/manage" 
            className="text-blue-600 hover:underline"
          >
            Go Back
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
      
      <SignatureModal 
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureSave}
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